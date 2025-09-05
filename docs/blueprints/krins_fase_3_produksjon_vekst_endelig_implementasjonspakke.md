# Krins – Fase 3 (Produksjon & Vekst) – Endelig implementasjonspakke

**Fase 3 = Fase 16–18 i masterplanen**: Produksjonsherding, læringssløyfe og go‑to‑market. Dette dokumentet er en komplett implementasjonspakke: mål/SLO, arkitekturendringer, kodeutdrag, CI/CD, observability, sikkerhet, onboarding, pilot‑opplegg, dashboards, runbooks og ferdige GitHub‑issues.

---

## 🎯 Mål & SLO/SLI
| Flytsteg | SLI | SLO (p95) |
|---|---|---|
| Assign → Diff | End‑to‑end latency | ≤ 45 s |
| Quality Gate | Build+tests+policy | ≤ 60 s |
| Preview URL | Branch + deploy | ≤ 120 s |
| Feilrate | 5xx per 100 tasks | < 2% |
| Budsjett | Tokens per task | ≤ policy |

**Alarmer:** SLO brudd, 429/5xx spike mot leverandør, cache‑hit drop, preview‑feil > 5%, budsjettbrudd.

---

## 🧱 Pålitelghet & resiliens

### 1) Circuit breaker + fallback (per modell)
`packages/server/src/services/agents/orchestrator.ts`
```ts
import { withBreaker } from "../resilience/breaker";
import { runClaude } from "../../adapters/claudeAdapter";
import { runOpenAI } from "../../adapters/openaiAdapter";
import { runGemini } from "../../adapters/geminiAdapter";

export async function proposeDiff(args: RunArgs){
  const chain = [
    withBreaker(runClaude, { key: "anthropic", timeoutMs: 40_000, errorRateOpen: 0.5 }),
    withBreaker(runOpenAI,  { key: "openai",     timeoutMs: 40_000, errorRateOpen: 0.5 }),
    withBreaker(runGemini,  { key: "gemini",     timeoutMs: 40_000, errorRateOpen: 0.5 }),
  ];
  for (const step of chain){
    try { return await step(args); } catch(e){ /* log and continue */ }
  }
  throw new Error("All providers failed");
}
```
`packages/server/src/services/resilience/breaker.ts`
```ts
type Opts = { key:string; timeoutMs:number; errorRateOpen:number };
const state = new Map<string,{open:boolean; fails:number; total:number; openedAt?:number}>();
export function withBreaker<T extends (...a:any)=>Promise<any>>(fn:T, o:Opts){
  return async (...a:Parameters<T>):Promise<Awaited<ReturnType<T>>> => {
    const s = state.get(o.key) || { open:false, fails:0, total:0 };
    if (s.open && Date.now() - (s.openedAt||0) < 15_000) throw new Error("breaker-open");
    const start = Date.now();
    try {
      const p = fn(...a);
      const r = await Promise.race([
        p, new Promise((_,rej)=>setTimeout(()=>rej(new Error("timeout")), o.timeoutMs))
      ]);
      s.total++; state.set(o.key, s); return r as any;
    } catch(e){
      s.fails++; s.total++; if (s.fails/s.total >= o.errorRateOpen){ s.open=true; s.openedAt=Date.now(); }
      state.set(o.key, s); throw e;
    }
  };
}
```

### 2) Idempotens på `/tasks` + jobb‑kø
`packages/server/src/services/queue/jobs.ts`
```ts
import crypto from "crypto";
import { Queue } from "bullmq";
export const tasksQ = new Queue("tasks", { connection: { host: process.env.REDIS_HOST } });

export function taskKey(payload:any){
  return crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}
```
`packages/server/src/routes/tasks.ts`
```ts
app.post("/tasks", async (req,res)=>{
  const key = taskKey(req.body);
  const exists = await tasksQ.getJob(key);
  if (exists) return res.json({ jobId: exists.id, dedup:true });
  const job = await tasksQ.add("runTask", req.body, { jobId: key, attempts: 3, backoff:{type:"exponential", delay: 2000} });
  res.json({ jobId: job.id });
});
```

### 3) Retry/backoff + DLQ
Sett `attempts`, `backoff`, og egen DLQ‑kø `tasks-dead` med årsak.

---

## 🔭 Observability (traces, metrics, logs)

### 1) OpenTelemetry (Node)
`packages/server/src/otel.ts`
```ts
import "./dotenv";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

export const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({ url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT }),
  instrumentations: [getNodeAutoInstrumentations()]
});
```
Kall `sdk.start()` på server‑bootstrap og legg `traceparent` fra extension → server headers.

### 2) Audit‑logg (JSONL) + ukesrapport
`packages/server/src/services/audit/report.ts`
```ts
// pnpm --filter @krins/server run metrics
// Les audit.jsonl → summer per uke: successRate, tokens/patch, time-to-green
```

### 3) Dashboards
- Accepted patches %, Time‑to‑green (p50/p95), Tokens/patch, Cost/agent, Cache hit, Policy‑blokkeringer.

---

## 🔐 Sikkerhet & policy
- **Nøkkelrotasjon** kvartalsvis, secrets i KMS/Secret Manager.
- **Dataretensjon**: 30–90 dager for innhold i logger/patches (hash eller slett).
- **PII‑redaksjon** i prompts/logg (`[REDACTED]`).
- **Policy‑rekkefølge**: secrets/licens/SBOM **før** preview‑deploy.

---

## 🚢 CI/CD – Blue/Green
`.github/workflows/krins_server_bluegreen.yml`
```yaml
name: krins-server-bluegreen
on: { push: { branches: [ main ] } }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @krins/server build
      - uses: actions/upload-artifact@v4
        with: { name: server-dist, path: packages/server/dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/download-artifact@v4
        with: { name: server-dist, path: dist }
      - name: Deploy green
        run: |
          ./infra/deploy_green.sh # start green behind LB
      - name: Health check
        run: |
          curl -fsS https://krins.example.com/health || (echo "health fail" && exit 1)
      - name: Switch traffic
        run: |
          ./infra/switch_to_green.sh # flip LB → green
      - name: Drain blue
        run: |
          ./infra/drain_blue.sh
```

**Health endpoint**: `GET /health` svarer 200 når adaptere, Redis, DB og otel init er OK.

---

## 🧭 Onboarding & Marketplace
- **VS Code Marketplace**: tittel, kort beskrivelse, highlights, GIF av «Assign → Quality → Preview → Apply».
- **Onboarding wizard** (extension): GitHub OAuth → velg repo → safe defaults (budsjett, policy, preview aktiv, apply krever bekreftelse) → første oppgaveguide.

**GIF‑manus (20–30 sek):**
1) Åpne oppgavefelt → skriv “Legg til ‘Clear completed’”.  
2) Diff vises → Quality Gate (1 advarsel) → Auto‑fix → grønt.  
3) Preview URL → “Promote to main”.  
4) Dashboard: tokens/patch + audit‑linje.

---

## 🧪 Læringssløyfe
- **Eval‑sett**: ekte oppgaver + fasit fra audit.
- **Bandit‑ruting**: ε‑greedy/Thompson + cooldown for svake agenter.
- **Prompt A/B**: variant‑tag i prompts + ukesrapport.
- **Memory→Rules**: destiller beslutninger til eksplisitte “Do/Don’t” regler i `shared/prompts.ts`.

---

## 📊 Dashboards (eksempelpaneler)
- `accepted_rate = accepted/total` per uke
- `median_time_to_green` og `p95_time_to_green`
- `cost_per_patch` og `tokens_per_patch`
- `cache_hit_rate` (LRU/semantic)
- `policy_blocks` etter årsak (secret/licence/sbom)

---

## 📦 GitHub‑issues (Fase 3) – script
Plasser som `scripts/krins_phase3_issues.sh` og kjør:
```bash
export REPO=ORG/REPO
bash scripts/krins_phase3_issues.sh
```

```bash
#!/usr/bin/env bash
set -euo pipefail
REPO="${REPO:-}"; [[ -z "$REPO" ]] && { echo "Set REPO=ORG/REPO"; exit 1; }
command -v gh >/dev/null || { echo "Install GitHub CLI"; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "Run: gh auth login"; exit 1; }

mk(){ local n="$1" c="$2" d="$3"; gh label list -R "$REPO" --search "$n" | grep -qiE "^$n( |$)" || gh label create "$n" -R "$REPO" --color "$c" --description "$d" || true; }
mk "phase:16" "6f42c1" "Production hardening"; mk "phase:17" "6f42c1" "Learning loop"; mk "phase:18" "6f42c1" "Go-to-market";
mk "area:server" "0366d6" "Server"; mk "area:extension" "8250df" "Extension"; mk "type:feature" "0e8a16" "Feature"; mk "type:infra" "5319e7" "Infra"; mk "type:ui" "fbca04" "UI"; mk "type:security" "b60205" "Security"; mk "priority:P1" "d73a4a" "P1";

new(){ gh issue create -R "$REPO" --title "$1" --label "$2" --body "$3"; }

# Phase 16 – Production hardening
new "SLO & Alarms — p95 latency, feilrate, preview" \
"area:server,type:infra,phase:16,priority:P1" \
"**Akseptansekriterier**\n- Mål p50/p95 for assign→diff, Quality, preview.\n- Alarmer for SLO‑brudd.\n- Dashboard med alle SLI."

new "Circuit breakers + fallback per modell" \
"area:server,type:infra,phase:16,priority:P1" \
"**Akseptansekriterier**\n- Breaker per leverandør med timeout og error‑rate åpning.\n- Automatisk fallback i Orchestrator."

new "Idempotens på /tasks + BullMQ kø (retry/backoff + DLQ)" \
"area:server,type:infra,phase:16,priority:P1" \
"**Akseptansekriterier**\n- jobId = sha256(payload).\n- DLQ med årsak."

new "End‑to‑end tracing (OTel) + traceparent fra extension" \
"area:server,type:infra,phase:16,priority:P1" \
"**Akseptansekriterier**\n- Traces for routes, adaptere og køjobb.\n- Korrelasjon fra editor til server."

new "Blue/green deploy + health checks" \
"area:server,type:infra,phase:16,priority:P1" \
"**Akseptansekriterier**\n- Green opp, health 200, switch LB, drain blue."

new "Key rotation + dataretensjon + PII‑redaksjon" \
"area:server,type:security,phase:16,priority:P1" \
"**Akseptansekriterier**\n- Rotasjonsprosedyre dokumentert.\n- Retensjon 30–90 d.\n- PII maskeres i logg."

# Phase 17 – Learning loop
new "Eval‑runner + scorekort (success, tokens, time, edits)" \
"area:server,type:feature,phase:17,priority:P1" \
"**Akseptansekriterier**\n- Kjør eval-sett ukentlig og lag rapport."

new "Bandit‑ruting v2 + cooldown + reasoning" \
"area:server,type:feature,phase:17,priority:P1" \
"**Akseptansekriterier**\n- ε‑greedy/Thompson, cooldown for svake agenter.\n- Logg forklarbar routing."

new "Prompt A/B rammeverk + ukesrapport" \
"area:server,type:feature,phase:17,priority:P1" \
"**Akseptansekriterier**\n- Variants med tags og rapport."

new "Memory→Rules v2 (destiller beslutninger til Do/Don’t)" \
"area:server,type:feature,phase:17,priority:P1" \
"**Akseptansekriterier**\n- Genererte regler injiseres i prompts."

# Phase 18 – Go-to-market
new "VS Code Marketplace‑listing (tekst, bilder, GIF)" \
"area:extension,type:ui,phase:18,priority:P1" \
"**Akseptansekriterier**\n- Publiserbar metadata + assets."

new "Onboarding wizard (OAuth→repo→defaults→første oppgave)" \
"area:extension,type:ui,phase:18,priority:P1" \
"**Akseptansekriterier**\n- Stegvis flyt + ‘safe defaults’."

new "Pilot‑telemetry & ROI‑rapport per team" \
"area:server,type:feature,phase:18,priority:P1" \
"**Akseptansekriterier**\n- CSV/PDF per team med nøkkeltall."

new "CODEOWNERS‑gate + auto‑ruting/approval" \
"area:server,type:feature,phase:18,priority:P1" \
"**Akseptansekriterier**\n- Blokker merge uten eier‑approval."

new "SBOM‑eksport per PR (PDF/CSV)" \
"area:server,type:feature,phase:18,priority:P1" \
"**Akseptansekriterier**\n- Vedleggbar rapport for nye deps."

```

---

## 📚 Runbooks (utdrag)
**Leverandør‑nedetid**: Breaker åpnes → fallback‑agent → hvis ingen tilgjengelig: kø jobb og informer bruker (non‑blocking toast + issue‑kommentar).

**Preview‑feil**: Vis “Retry preview” + lenke til build‑logg; ved 3 feil: lag issue automatisk.

**Budsjettbrudd**: Avbryt oppgave, vis «Narrow scope»‑forslag og estimat for billig modell.

**Policy‑brudd**: Blokker, vis årsak + autofix‑forslag; ingen preview før grønt.

---

## ✅ Leveranse‑sjekkliste
- [ ] SLO/SLI måles og alarmer er aktive
- [ ] Breakers + fallback + idempotens + kø
- [ ] OTel tracing og dashboards live
- [ ] Blue/green med helsesjekker i CI
- [ ] Onboarding wizard + Marketplace‑assets
- [ ] Eval/A‑B/bandit/Memory→Rules v2
- [ ] Pilot‑telemetry + ROI‑rapporter
- [ ] Runbooks sjekket inn i `docs/runbooks/`

