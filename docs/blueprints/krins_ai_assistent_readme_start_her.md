# Krins – AI‑assistent README (Start her)

Denne siden er laget for **AI‑assistenten (Claude Code)** og utviklere som skal i gang raskt.

---

## 1) Oversikt
**Mål:** Krins leverer trygge, diff‑baserte kodeendringer fra flere AI‑agenter, validerer dem automatisk (Quality Gate), og tilbyr forhåndsvisning før merge.  
**Kjerneverdier:** diff → kvalitet → preview → apply → audit, med kostkontroll og læring over tid.

---

## 2) Forutsetninger
- GitHub‑repo (monorepo) med mapper:
  - `packages/server`, `packages/extension`, `packages/shared`, `templates/`
- **Node 18+**, **pnpm** anbefalt, **GitHub CLI (gh)**
- API‑nøkler bare på server (`.env`)  
- JWT mellom extension ↔ server

---

## 3) Hurtigoppsett (lokalt)
```bash
# Installer avhengigheter (monorepo)
pnpm install

# Server (dev)
pnpm --filter @krins/server dev

# VS Code‑extension (dev / compile)
pnpm --filter @krins/extension build
# (eller start VS Code og kjør "Run Extension")
```

> Sett VS Code setting **`krins.serverUrl`** til f.eks. `http://localhost:3000`.

---

## 4) Miljøvariabler (server `.env`)
```
PORT=3000
CCC_JWT_SECRET=dev-secret
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
GOOGLE_API_KEY=...
PREVIEWS_TARGET=vercel   # eller netlify
```

---

## 5) Start her – arbeidsflyt
1. **Opprett issues automatisk** (MVP og Advanced):
   ```bash
   # fra repo‑roten, forutsetter gh login
   export REPO=ORG/REPO
   bash scripts/krins_mvp_issues.sh
   bash scripts/krins_additions_issues.sh
   ```
   *VS Code:* `Run Task` → *Krins: create MVP issues* / *create advanced issues*.

2. **Plukk en P1‑issue (Sprint 1)** og opprett branch:  
   `git checkout -b feat/<short‑slug>`

3. **Implementér** iht. akseptansekriterier i issue‑teksten.  
   - Server: routes/services/adapters  
   - Extension: UI‑paneler + commands + websocket

4. **Kjør Quality Gate lokalt** (før PR):
   - Build/syntaks, impacted tests, SAST, secrets/licens policy

5. (Valgfritt) **Preview deploy** på ephemeral branch → “Promote to main”.

6. **Åpne PR** og sørg for grønn Quality + policy. Merge når alt passerer.

7. **Audit**: JSONL‑linje skrives; kjør ukesrapport:
   ```bash
   pnpm --filter @krins/server run metrics
   ```

---

## 6) Sprint 1 (MVP) – mål og scope
- **Mål:** “Assign task” → beriket kontekst → AI‑diff → Quality Gate → *Apply* trygt.
- **Scope (P1):**
  1) ContextOrchestrator (kontekstberikelse)  
  2) QualityPipeline (build/syntaks, test‑impact, enkel SAST)  
  3) Quality Gate UI (extension)  
  4) Audit‑logg + ukesrapport  
  5) Secret & lisens‑scan (pre‑apply)  
  *(Bonus)* CostOptimizer LRU

**DoD:** Patch passerer Quality & policy, kan forhåndsvises, og alt logges.

---

## 7) Advanced (Sprint 2–4) – høy verdi
- **CodeGraph** (AST + modulgraf)  
- **Spec Mode** (test‑før‑patch)  
- **Proposer → Judge** (self‑check)  
- **Previews** (ephemeral branch + deploy)  
- **Kostvakta** (budsjett + ruting + cache)  
- **Proaktiv forbedring** (batch nattlig)  
- **Policy & supply chain** (secrets/licens/SBOM)  
- **Human UX** (Why/Narrow + flow‑sensing)  
- **Project Memory** (beslutningshukommelse)  
- **Intelligent Router** (forklarbart + læring)

---

## 8) Branch/PR‑konvensjoner
- Branch: `feat/*`, `fix/*`, `chore/*`  
- Commits: konvensjonelle meldinger (f.eks. `feat: add spec mode MVP`)
- PR must‑pass: Quality Gate + policy  
- “Apply patch” går via `git apply --3way`; konflikter skal håndteres i UI før merge.

---

## 9) Sikkerhet & policy
- Ingen secrets i klientkode.  
- Secrets/licens/SBOM sjekkes **før** preview.  
- JWT roteres jevnlig.  
- Audit‑logg er append‑only.

---

## 10) Fallback & feilsøking
- Diff nekter å apply?  
  → Lag `.patch` og kjør `git apply --reject` manuelt; vis avvik i UI.
- SAST stoppa endringen?  
  → Bruk *Auto‑fix*; hvis fortsatt rødt, opprett “fix‑task” automatisk.
- Kostbudsjett nådd?  
  → Smalere scope (Narrow slider) eller bruk enklere modell.

---

## 11) Nøkkelkommandoer
```bash
# Installer
pnpm install

# Start server
pnpm --filter @krins/server dev

# Bygg extension
pnpm --filter @krins/extension build

# Opprett MVP/Advanced issues
export REPO=ORG/REPO
bash scripts/krins_mvp_issues.sh
bash scripts/krins_additions_issues.sh
```

---

## 12) Kontaktpunkter
- Templates: `templates/todo-nextjs`, `templates/express-api`  
- Prompts/typer: `packages/shared/src/{prompts.ts,types.ts}`  
- Konfig: `.krins/config.json`, server `.env`

---

**Gi AI‑assistenten denne README’en + “Krins – AI‑assistent‑brief (MVP + Advanced)”.**  
Start med Sprint 1. Når den er grønn, fortsett i rekkefølgen for Advanced. Logg suksess‑metrikk ukentlig fra audit‑dataene.