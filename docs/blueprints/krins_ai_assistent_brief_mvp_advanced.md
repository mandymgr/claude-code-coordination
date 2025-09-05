# Krins – AI‑assistent‑brief (MVP + Advanced)

Denne briefen er skrevet for en **AI‑assistent (Claude Code)** som skal bygge Krins steg‑for‑steg. Den dekker mål, rammer, mappestruktur, akseptansekriterier, sprintplan og ferdige **GitHub‑issues‑skript** (MVP + Advanced) som kan kjøres direkte.

---

## 🎯 Mål
Bygg en VS Code‑drevet AI‑utviklingsplattform som orkestrerer flere modeller, jobber diff‑basert, kjører kvalitetskontroller automatisk, og leverer trygge patches med forhåndsvisning – raskt og kostnadseffektivt.

**Kjerneverdier:**
- Diff‑først (sporbarhet, enkel revert)
- Kvalitet **før** apply (build, tester, security, policy)
- Trygge previews (ephemeral branch + deploy URL)
- Kostkontroll (budsjett + smart agentruting + cache)
- Læring over tid (hukommelse, adaptive prompts, routing‑feedback)

---

## 🔧 Rammer & forutsetninger
- **Repo:** ett monorepo med `packages/server`, `packages/extension`, `packages/shared`, `templates/`
- **Språk:** TypeScript på server/extension
- **AI‑nøkler:** kun på server (ENV). JWT mellom extension↔server
- **Git:** alle patches som unified diff, bruk `git apply --3way`
- **VS Code:** extension uten top‑header, fokus på sidebar/rike paneler

---

## 📦 Mappestruktur (måltilstand)
```
packages/
  shared/
    src/{types.ts,prompts.ts}
  server/
    src/index.ts
    src/routes/{tasks.ts,locks.ts,deploy.ts,projects.ts}
    src/adapters/{claudeAdapter.ts,openaiAdapter.ts,geminiAdapter.ts}
    src/services/
      diffService.ts
      lockService.ts
      taskService.ts
      deployService.ts
      codeGraph/{parser.ts,graph.ts,ownership.ts,store.ts}
      specMode/{specGenerator.ts,patchRunner.ts,sandbox.ts}
      agents/{proposer.ts,judge.ts,orchestrator.ts}
      previews/{branch.ts,deploy.ts,status.ts}
      cost/{budget.ts,router.ts,cache.ts}
      improvement/{detector.ts,suggestions.ts,scheduler.ts}
      policy/{secrets.ts,licenses.ts,sbom.ts,gate.ts}
      memory/{memoryService.ts,embeddings.ts,rules.ts}
      routing/{intelligentRouter.ts,features.ts,outcomes.ts}
  extension/
    src/extension.ts
    src/commands/{assignTask.ts,createProjectFromPrompt.ts,deploy.ts,toggleFileLock.ts}
    src/ui/{QualityGate.tsx,WhyPanel.tsx,NarrowScope.tsx,PreviewBar.tsx}
    src/experience/{flowSense.ts,suggestions.tsx,feedback.tsx}
    src/{websocket.ts,decorations.ts}
  templates/
    todo-nextjs/
    express-api/
```

---

## ✅ Definisjon av “Done” (globalt)
- Patch **passerer** Quality Gate (build + impacted tests + security + policy)
- Previews (om aktivert): deploy OK og man kan «Promote to main»
- Audit‑linje skrevet (agent, tokens, varighet, quality, policy)

---

## 🚀 Sprint 1 – MVP (2 uker)
**Mål:** «Assign task» → beriket kontekst → AI‑diff → Quality Gate → apply trygt, alt logges.

**Issues (P1):**
1. **ContextOrchestrator** – berik oppgavekontekst
2. **QualityPipeline (MVP)** – build/syntaks, test‑impact, enkel SAST
3. **Quality Gate UI (extension)** – panel for pass/fail + autofix
4. **Audit‑logg** – JSONL + ukesrapport
5. **Secret & lisens‑scan (pre‑apply)**
*(Bonus)* 6. **CostOptimizer LRU**

---

## 🔁 Sprint 2–4 – Advanced (utdrag)
- **CodeGraph** (AST + modulgraf) → mer treffsikre endringer
- **Spec Mode** (test‑før‑patch) → skriv tester først, patch til grønt
- **Proposer → Judge** (self‑check) → blokkér svake endringer tidlig
- **Previews** (ephemeral branch + deploy‑URL) → trygg test før merge
- **Kostvakta** (budsjett + ruting + cache) → lavere kost/patch
- **Proaktiv forbedring** (batch nattlig) → hygiene uten friksjon
- **Policy & supply chain** (secrets/licens/SBOM) → enterprise‑trygghet
- **Human UX** (Why/Narrow + flow‑sensing) → tillit og kontroll
- **Project Memory** (beslutningshukommelse) → færre tokens, bedre valg
- **Intelligent Router** (forklarbart + læring) → riktig agent, riktig tid

---

## 🧪 Kvalitet & målinger
- **Per oppgave:** passrate, runder til grønt, tokens, latency, policy‑score
- **Per agent:** success‑rate, kost/patch, menneskelige edits
- **Over tid:** cache‑hit‑rate, cycle time, ESLint‑funn, testdekning

---

## 📜 GitHub‑issues – skript (MVP + Advanced)
Kopier filene under til repoet og kjør i terminal/VS Code. De oppretter labels + issues med akseptansekriterier og sjekklister.

### A) `scripts/krins_mvp_issues.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail

REPO="${REPO:-}"
if [[ -z "$REPO" ]]; then echo "Set REPO=ORG/REPO"; exit 1; fi
command -v gh >/dev/null || { echo "Install GitHub CLI"; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "Run: gh auth login"; exit 1; }

create_label(){ local n="$1" c="$2" d="$3"; gh label list -R "$REPO" --search "$n" | grep -qiE "^$n( |$)" || gh label create "$n" -R "$REPO" --color "$c" --description "$d" || true; }

# Labels
create_label "area:server" "0366d6" "Server"
create_label "area:extension" "8250df" "VS Code extension"
create_label "type:feature" "0e8a16" "Feature"
create_label "type:ui" "fbca04" "UI"
create_label "type:infra" "5319e7" "Infra"
create_label "type:security" "b60205" "Security"
create_label "type:docs" "1d76db" "Docs"
create_label "priority:P1" "d73a4a" "Highest"
create_label "phase:7" "6f42c1" "Phase 7"
create_label "phase:8" "6f42c1" "Phase 8"

new_issue(){ local t="$1" l="$2" b="$3"; gh issue create -R "$REPO" --title "$t" --label "$l" --body "$b"; }

# 1) ContextOrchestrator
new_issue "ContextOrchestrator — berik oppgavekontekst" \
"area:server,type:feature,phase:7,priority:P1" \
"**Estimat:** 5 pts\n**Akseptansekriterier**\n- Les git‑historikk (relevante diffs), ESLint/Prettier/ADR.\n- \\`enrich(task, base)\\` returnerer EnrichedContext med stilregler og beslutninger.\n- Injiseres i alle agent‑kall.\n**Måling:** ≥15% færre tokens/oppgave.\n**Sjekkliste**\n- [ ] \\`packages/server/src/services/taskService.ts\\` injiserer context\n- [ ] \\`shared/prompts.ts\\` oppdatert med retningslinjer\n"

# 2) QualityPipeline MVP
new_issue "QualityPipeline (MVP) — build/syntaks, test‑impact, enkel SAST" \
"area:server,type:feature,phase:7,priority:P1" \
"**Estimat:** 8 pts\n**Akseptansekriterier**\n- Kjør build/syntaks (tsc).\n- Test‑impact: finn relevante tester fra diff.\n- SAST: blokker \\`eval\\`, farlig \\`child_process\\`, mistenkte secrets.\n- Ved feil: \\`requestFix()\\` → ny diff.\n**Sjekkliste**\n- [ ] \\`services/diffService.ts\\` → parse berørte filer\n- [ ] \\`routes/tasks.ts\\` → «quality gate» før apply\n"

# 3) Quality Gate UI (extension)
new_issue "Quality Gate UI — panel, pass/fail + Auto‑fix" \
"area:extension,type:ui,phase:7,priority:P1" \
"**Estimat:** 3 pts\n**Akseptansekriterier**\n- Webview viser Build/Tests/Security status.\n- «Auto‑fix» knapp (POST /quality/fix).\n**Sjekkliste**\n- [ ] \\`src/ui/QualityGate.tsx\\`\n- [ ] \\`commands/assignTask.ts\\` åpner panelet\n"

# 4) Audit‑logg + ukesrapport
new_issue "Audit‑logg — JSONL + ukentlig metrikk" \
"area:server,type:infra,phase:7,priority:P1" \
"**Estimat:** 3 pts\n**Akseptansekriterier**\n- Append JSONL per task (agent, tokens, diff_hash, varighet, pass/fail).\n- Script \\`npm run metrics\\` → ukesrapport (CSV/MD).\n"

# 5) Secret & lisens‑scan (pre‑apply)
new_issue "Security — Secret & licens‑scan (pre‑apply)" \
"area:server,type:security,phase:7,priority:P1" \
"**Estimat:** 3 pts\n**Akseptansekriterier**\n- Regex for secrets; blokkér patch med begrunnelse.\n- license‑checker: rapport for nye deps.\n"

# 6) (Bonus) CostOptimizer LRU
new_issue "CostOptimizer — LRU cache for gjentagere (bonus)" \
"area:server,type:feature,phase:8,priority:P1" \
"**Estimat:** 5 pts\n**Akseptansekriterier**\n- Fingerprint oppgaver (type, filtyper, størrelse).\n- LRU ≥200; threshold konfigurerbar.\n"

echo "MVP issues created ✅"
```

### B) `scripts/krins_additions_issues.sh` (Advanced)
```bash
#!/usr/bin/env bash
set -euo pipefail
REPO="${REPO:-}"; [[ -z "$REPO" ]] && { echo "Set REPO=ORG/REPO"; exit 1; }
command -v gh >/dev/null || { echo "Install GitHub CLI"; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "Run: gh auth login"; exit 1; }

create_label(){ local n="$1" c="$2" d="$3"; gh label list -R "$REPO" --search "$n" | grep -qiE "^$n( |$)" || gh label create "$n" -R "$REPO" --color "$c" --description "$d" || true; }
create_label "area:server" "0366d6" "Server"; create_label "area:extension" "8250df" "Extension"; create_label "type:feature" "0e8a16" "Feature"; create_label "type:ui" "fbca04" "UI"; create_label "priority:P1" "d73a4a" "Highest"; create_label "phase:7" "6f42c1" "Phase 7"; create_label "phase:8" "6f42c1" "Phase 8"; create_label "phase:9" "6f42c1" "Phase 9";

new_issue(){ local t="$1" l="$2" b="$3"; gh issue create -R "$REPO" --title "$t" --label "$l" --body "$b"; }

# Project Memory v1
new_issue "Project Memory v1 — beslutningslogg + recall til ContextOrchestrator" \
"area:server,type:feature,phase:7,priority:P1" \
"**Estimat:** 5 pts\n**Akseptansekriterier**\n- \\`rememberDecision(context, decision, rationale)\\` lagrer hva/hvorfor + filer + tags + ts.\n- \\`recallRelevantContext(task)\\` returnerer 3–5 beslutninger, vektet med time‑decay.\n- ContextOrchestrator injiserer lærdommer i alle agent‑kall.\n**Måling:** ≥15% færre tokens/oppgave.\n"

# Intelligent Router
new_issue "Intelligent Router — forklarbart agentvalg + læringssløyfe" \
"area:server,type:feature,phase:8,priority:P1" \
"**Estimat:** 6 pts\n**Akseptansekriterier**\n- \\`POST /router/select\\` → { agent, confidence, reasoning, alternatives? }.\n- \\`POST /router/record\\` lagrer success, tokens, duration, humanEdits.\n- Respekter budsjett (Kostvakta); rute enkle tasks billig.\n**Måling:** −20–35% kost/patch, færre quality‑feil før pipeline.\n"

# Intelligent Dev Experience (flow‑sensing)
new_issue "Intelligent Dev Experience — flow‑sensing + subtile forslag (extension)" \
"area:extension,type:ui,phase:9,priority:P1" \
"**Estimat:** 5 pts\n**Akseptansekriterier**\n- Oppdag stagnasjon/repetisjon, vis forslag uten spam.\n- «Rich feedback» etter apply: what/why/risks/next.\n**Måling:** +adopsjon, −avviste patches.\n"

echo "Advanced additions issues created ✅"
```

### C) Valgfri VS Code‑task
`.vscode/tasks.json`
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Krins: create MVP issues",
      "type": "shell",
      "command": "bash",
      "args": ["${workspaceFolder}/scripts/krins_mvp_issues.sh"],
      "options": { "env": { "REPO": "ORG/REPO" } },
      "problemMatcher": []
    },
    {
      "label": "Krins: create advanced issues",
      "type": "shell",
      "command": "bash",
      "args": ["${workspaceFolder}/scripts/krins_additions_issues.sh"],
      "options": { "env": { "REPO": "ORG/REPO" } },
      "problemMatcher": []
    }
  ]
}
```

---

## ▶️ Kjørerapid (for assistenten)
1) **Opprett issues:** sett `REPO` og kjør skriptene over.
2) **Lag branch per issue** og følg akseptansekriteriene (se issues).
3) **Implementér:**
   - server: services/routes/adapters som spesifisert
   - extension: UI‑paneler + commands + websocket
4) **Quality Gate før apply**: bygg, test, SAST, policy
5) **(Hvis aktivert) Previews:** opprett ephemeral branch + deploy; “Promote to main”
6) **Audit:** skriv JSONL; kjør ukesrapport

---

## 🔐 Viktige regler
- Ingen API‑nøkler i klient/extension
- JWT mellom klient/server, secrets i ENV på server
- All endring leveres som **unified diff**; apply med `--3way`
- Blokker patch ved secrets/licens/SBOM‑brudd

---

## 📎 Vedlegg/ressurser (i repo)
- `templates/todo-nextjs`, `templates/express-api` (demo‑prosjekter)
- `shared/prompts.ts` (systemprompts pr. agentrolle)
- `shared/types.ts` (TaskRequest, DiffPatch, LockEvent, osv.)

---

**Gi denne briefen til AI‑assistenten og be om å starte med Sprint 1 (MVP).** Når Sprint 1 er grønn, fortsett med Advanced etter rekkefølgen over. Succes‑metrikkene skal logges ukentlig i rapporten fra audit‑dataene.

