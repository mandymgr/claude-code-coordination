# Krins – Advanced Blueprint (Phases 7–10)

Dette er oppfølger‑blueprinten til MVP‑oppsettet. Den beskriver **funksjoner som faktisk skiller Krins** i markedet, med konkrete moduler, filplassering, API‑endepunkter, akseptansekriterier, måleparametere og PR‑rekkefølge. Alt bygger videre på repo‑strukturen fra første blueprint.

---

## 🎯 Målbilde
- **Lav risiko:** AI‑endringer er testdrevne, kvalitetssikret og kan forhåndsvises trygt.
- **Læring over tid:** Prompts, modellvalg og kodeforståelse forbedres kontinuerlig.
- **Kostkontroll:** Budsjett pr. oppgave og smart ruting/caching.
- **Enterprise‑trygghet:** Policyer, secrets, lisens og SBOM i selve flyten.

---

## 🏗 Nye modulområder

### 1) Semantisk kode‑graf
**Formål:** Krins forstår og utnytter struktur/avhengigheter i kodebasen for mer presise endringer.

**Filer:**
```
packages/server/src/services/codeGraph/
  ├─ parser.ts          // tree-sitter/AST, språkdynamikk
  ├─ graph.ts           // modulgraf (noder=moduler, kanter=avhengigheter)
  ├─ ownership.ts       // eierskap/mapper/teams
  └─ store.ts           // vedvarende cache (sqlite/json)
```
**API:** `POST /graph/rebuild` (async), `GET /graph/module?path=...`

**Akseptansekriterier:**
- Parser støtter minst TS/JS. Modulgraf bygges for repoet med >90% dekningsgrad av filer.
- `GET /graph/module` returnerer nabolag (importers/imports) og foreslår berørte filer gitt en endring.

**Måleparametere:** tokens spart pr. oppgave, Quality‑passrate, konfliktrate etter patch.

---

### 2) Test‑før‑patch (Spec Mode)
**Formål:** AI skriver tester først, så patch som får testene grønne.

**Filer:**
```
packages/server/src/services/specMode/
  ├─ specGenerator.ts   // generer akseptansetester (Vitest/Jest)
  ├─ patchRunner.ts     // kjør test → foreslå patch → re‑test
  └─ sandbox.ts         // isolert kjøring (node/vitest)
```
**API:** `POST /tasks/spec` → `{ tests: [...], diffText }`

**Akseptansekriterier:**
- Minst én ny testfil genereres for oppgaven og kjøres automatisk.
- Patch leveres kun hvis testene passerer lokalt i sandbox.

**Måleparametere:** regresjonsrate (proxy), antall røde→grønne sykluser.

---

### 3) Dobbelt‑agent “Self‑check”
**Formål:** En “Judge”‑agent kvalitetskontrollerer forslag fra “Proposer”.

**Filer:**
```
packages/server/src/services/agents/
  ├─ proposer.ts        // foreslår diff
  ├─ judge.ts           // sjekkliste: sikkerhet/ytelse/arkitektur/UX
  └─ orchestrator.ts    // kjede Proposer → Judge → QualityPipeline
```
**Akseptansekriterier:**
- Judge kan blokkere forslag med begrunnelse (+hint til re‑prompt).
- Minimum 3 sjekkpunkter håndheves (security/perf/arch).

**Måleparametere:** reduksjon i antall Quality‑fail, færre autofix‑runder.

---

### 4) Trygge forhåndsvisninger (ephemeral branches)
**Formål:** Se endringer live i isolert miljø før merge.

**Filer:**
```
packages/server/src/services/previews/
  ├─ branch.ts          // git worktree / ephemeral branch
  ├─ deploy.ts          // Vercel/Netlify preview deploy
  └─ status.ts          // status/events tilbake til extension
```
**API:** `POST /previews/create`, `GET /previews/:id/status`

**Akseptansekriterier:**
- Patch anvendes på ephemeral branch; URL til preview returneres.
- Extension viser “Promote to main” etter godkjenning.

**Måleparametere:** andel patches akseptert første runde, cycle‑time til merge.

---

### 5) Kostvakta (budsjett pr. oppgave)
**Formål:** Kontroll på tokens/kost – rute til billigste modell som duger.

**Filer:**
```
packages/server/src/services/cost/
  ├─ budget.ts          // per‑task budsjett + enforcement
  ├─ router.ts          // velg modell etter kompleksitet + budsjett
  └─ cache.ts           // LRU for gjentagere
```
**Konfig:** `.krins/config.json`
```json
{
  "budget": { "defaultMaxTokens": 20000, "hardStop": true },
  "routing": { "simple": "gpt-4o-mini", "medium": "claude-3-5-sonnet", "complex": "gemini-1.5-pro" }
}
```
**Akseptansekriterier:**
- Oppgaver stopper ved budsjettbrudd med tydelig feilmelding og forslag til innsnevring.
- LRU‑cache returnerer diff ved treff (uten nytt modelkall).

**Måleparametere:** kost/patch, cache‑hit‑rate, andel oppgaver rutet billigere.

---

### 6) Kontinuerlig kodeforbedring
**Formål:** Små, sikre forslag når teamet sover – teknisk hygiene.

**Filer:**
```
packages/server/src/services/improvement/
  ├─ detector.ts        // duplikater, døde imports, lav dekning
  ├─ suggestions.ts     // generer mini‑refactor + micro‑tests
  └─ scheduler.ts       // nattlig jobb (cron/queue)
```
**Akseptansekriterier:**
- Genererer forslag i egen “AI Suggestions” feed i extension.
- “Promote to Task” oppretter ordinær oppgave.

**Måleparametere:** ESLint‑funn over tid, testdekning, antall aksepterte forslag.

---

### 7) Policy‑motor & leverandørkjede
**Formål:** Enterprise‑trygghet (secrets, lisenser, SBOM, policy).

**Filer:**
```
packages/server/src/services/policy/
  ├─ secrets.ts         // detekter og blokker
  ├─ licenses.ts        // license‑checker/allowlist
  ├─ sbom.ts            // Syft SBOM + rapport
  └─ gate.ts            // samlet policy‑vurdering
```
**Akseptansekriterier:**
- Patch blokkeres ved policy‑brudd, med begrunnelse og forslag til fix.
- SBOM genereres for nye avhengigheter.

**Måleparametere:** policy‑score per patch, 0 prod‑lekkasjer.

---

### 8) Human UX for AI (forklarbarhet + kontroll)
**Formål:** Øke tillit og kontroll; føles som å jobbe med et menneske.

**Filer (extension):**
```
packages/extension/src/ui/
  ├─ WhyPanel.tsx       // kort begrunnelse + relevante linjer
  ├─ NarrowScope.tsx    // slider: “smal → bred” endring
  └─ PreviewBar.tsx     // Promote to main, Open preview URL
```
**Akseptansekriterier:**
- “Hvorfor ble dette endret?” viser 1–3 korte grunner + kilde (linjer/komponenter).
- Bruker kan justere omfang før generering (slider) og se tydelig effekt.

**Måleparametere:** brukeradopsjon (klikk), avvisningsrate på patches.

---

## 🔌 API‑endepunkter (tillegg)
```
POST /graph/rebuild            // bygg AST/modulgraf
GET  /graph/module             // naboer, berørte filer
POST /tasks/spec               // test‑før‑patch flyt
POST /previews/create          // ephemeral branch + deploy
GET  /previews/:id/status      // bygg/deploystatus
POST /cost/budget/check        // valider budget for task
POST /policy/evaluate          // kjør gate på diff
```

---

## 🔐 Sikkerhet & observability
- JWT mellom extension↔server (rotérbart); API‑nøkler kun på server.
- Audit JSONL + ukentlig aggregat (tokens, passrate, cost/patch, tid).
- SBOM per PR og policy‑score i Quality Gate.

---

## 🧪 Teststrategi
- **Unit:** parser/graph, budget/router, secrets, licenses, cache.
- **Integration:** `/tasks/spec` end‑to‑end i sandbox (generer test → patch → grønn).
- **E2E (dev):** VS Code “Assign task” → patch → preview → promote.

---

## 🚀 PR‑ og sprintplan (foreslått)

### Sprint 2 (kvalitet først)
**PR7 – CodeGraph (AST+graf, TS/JS)**
- Parser + modulgraf + `GET /graph/module`  
- *DoD:* graf for repo, naboer/berørte filer returneres.

**PR8 – Spec Mode (test‑før‑patch)**
- `POST /tasks/spec` + sandbox + Vitest/Jest støtte  
- *DoD:* grønn test før patch sendes til apply.

**PR9 – Judge‑agent**
- Proposer→Judge orkestrering + sjekkpunkter (security/perf/arch)  
- *DoD:* Judge kan blokkere og re‑prompt gir bedre diff.

### Sprint 3 (tillit & UX)
**PR10 – Previews (ephemeral branches + deploy)**
- `POST /previews/create` + URL i extension  
- *DoD:* “Promote to main”‑flyt i editor.

**PR11 – Human UX**
- WhyPanel + NarrowScope + PreviewBar  
- *DoD:* Bruker kan forstå og justere før generering.

### Sprint 4 (økonomi & enterprise)
**PR12 – Kostvakta (budget/router/cache)**
- Budsjett‑enforcement + billig‑ruting + LRU‑cache  
- *DoD:* hard‑stop på budsjett; cache‑treff logges.

**PR13 – Kontinuerlig forbedring**
- Nattlig jobb + suggestions feed i extension  
- *DoD:* minst 2 forslagstyper (refactor+test) per uke.

**PR14 – Policy & supply chain**
- secrets/licenses/SBOM i gate  
- *DoD:* blokkering ved brudd + tydelig begrunnelse/fix.

---

## ⚙️ Konfig & filer
```
.krins/config.json
  budget.defaultMaxTokens
  routing.simple|medium|complex
  policy.licenseAllowlist
  previews.target: "vercel"|"netlify"
```

---

## 🧭 Risiko & mitigasjon
- **Modelldrift/kost:** Budsjett + ruting + cache (Kostvakta) fra dag 1.
- **Feil‑patcher:** Spec Mode + Judge + Quality Pipeline + Previews.
- **Ytelse på store repoer:** Incremental graf, sqlite‑cache, “berørte filer” i stedet for fullkontekst.

---

## 📌 Notater
- Bygg videre på eksisterende diff‑basert flyt – alle nye moduler kobles inn i `taskService.runTask()` før `apply`.
- Start med TS/JS; lag språkadapter‑interface for senere Python/Go/…
- Hold WhyPanel kort (maks 3 bullets) – verdi uten støy.



---

## ➕ Tillegg (Claude-forslag integrert)

### 9) Project Memory (beslutningshukommelse)
**Formål:** Beholde *hva vi valgte* og *hvorfor*, samt mønstre/teampreferanser – gjenbrukes i alle fremtidige oppgaver.

**Filer:**
```
packages/server/src/services/memory/
  ├─ memoryService.ts     // save/recall av beslutninger og mønstre (JSONL/SQLite)
  ├─ embeddings.ts        // (senere) vektor-søk, tidlig MVP uten
  └─ rules.ts             // syntetiser “retningslinjer” til ContextOrchestrator
```
**API:** `POST /memory/remember`, `POST /memory/recall` (intern for Orchestrator)

**Akseptansekriterier:**
- `rememberDecision(context, decision, rationale)` lagrer med tidsstempel, filer og tags.
- `recallRelevantContext(task)` returnerer 3–5 relevante beslutninger, vektet med **time-decay**.
- ContextOrchestrator injiserer “lærdommer” i alle agent-kall.

**Måleparametere:** −15% tokens/oppgave, +10% pass-rate i Quality Gate.

---

### 10) Intelligent Router (med læring)
**Formål:** Velg *riktig* agent basert på oppgave, historikk og budsjett – og lær av utfallet.

**Filer:**
```
packages/server/src/services/routing/
  ├─ intelligentRouter.ts  // heuristikk + “multi-armed bandit” læring
  ├─ features.ts           // trekk ut features fra task/diff/codegraph
  └─ outcomes.ts           // lagre resultater (suksess, tid, tokens, edits)
```
**API:** `POST /router/select` → `{ agent, confidence, reasoning }`, `POST /router/record`

**Akseptansekriterier:**
- Forklarbarhet: `reasoning` inneholder *hvorfor* agent ble valgt (features + budsjett + historikk).
- `recordOutcome` oppdaterer performancemodell (suksess, tokens, varighet, menneskelig etterarbeid).
- Samspill med **Kostvakta**: respekter maks-budsjett og rute enklere tasks billigere.

**Måleparametere:** −30–40% Quality‑feil før pipeline; −20–35% kost/patch.

---

### 11) Intelligent Developer Experience (flow-sensing)
**Formål:** Hjelpe på riktig tidspunkt uten støy – “unstuck”‑hint og automatisering av repeterte mønstre.

**Filer (extension):**
```
packages/extension/src/experience/
  ├─ flowSense.ts         // detekter stuck/repetisjon (tidsbruk/kommandoer)
  ├─ suggestions.tsx      // subtil notifikasjon + forslag
  └─ feedback.tsx         // rik tilbakemelding (what/why/risks/next)
```
**Akseptansekriterier:**
- Viser forslag kun ved *stagnasjon* eller repetisjon (rate-limited, “no spam”).
- “Rich feedback” etter apply: hva som endret seg, hvorfor, mulige risikoer, neste steg.

**Måleparametere:** +25% adopsjon av AI-flyt, −30% avviste patches pga. omfang/misforståelse.

---

## 📅 Sprint-innpasning (oppdatert)
- **Sprint 2:** Memory v1, Proposer→Judge, Spec Mode (uendret), *pluss* forklarbar ruting (`/router/select`).
- **Sprint 3:** Previews, Human UX (Why/Narrow), *pluss* flow-sensing MVP.
- **Sprint 4:** Kostvakta (full) + Kontinuerlig forbedring + Policy/SBOM, *pluss* læringssløyfe `router.recordOutcome`.

