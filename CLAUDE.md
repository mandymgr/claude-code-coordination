# Claude Code Coordination - Ontwikkelingsguide

## 🚀 AKTIV SPRINT 1 (2025-08-26 → 2025-09-06)

### 🎯 Sprintmål
Fra VS Code: "Assign task" → (beriket kontekst) → AI-diff → Quality Gate → Apply patch  
**Minimere manuell inngripen og logge alt.**

### 📦 Sprint Backlog
**PR1:** ContextOrchestrator (server) - Berik med ESLint/git-history → 15% token-saving  
**PR2:** QualityPipeline (server) - Build/syntaks + test-impact + SAST → requestFix() ved fail  
**PR3:** Quality Gate UI (extension) - Webview med pass/fail + Auto-fix knapp  
**PR4:** Audit-logging (server) - JSONL per task + npm run metrics  
**PR5:** Secret/lisens-scan - Blokker patch ved secrets/GPL-brudd  
**PR6 (bonus):** CostOptimizer LRU - Cache repeats med fingerprint  

### ✅ Definition of Done
- "Assign task" gir diff + Quality Gate panel
- 3+ røde funn blokkeres korrekt (syntaks/test/security)
- "Auto-fix" genererer passert diff
- Apply fungerer uten konflikter i demo-repo
- Audit-linje: agent/tokens/pass/fail/varighet
- (Bonus) Cache-treff for repetert oppgave

### 📈 Sprint KPI'er
- ≥80% patches passerer uten manuell endring
- ≥15% token-reduksjon via ContextOrchestrator  
- ≤5 min median Assign → Apply
- (Bonus) ≥25% cache-hit rate

### 🧪 Demo-script
Templates: todo-nextjs + express-api  
Test: "Add dark mode toggle" → expect 1-2 files  
Test: "Add eval() logging" → expect SAST block  
Test: "Install GPLv3 package" → expect license warning  

---

## 🎯 Development Philosophy & Core Principles

### ALLTID BEST LØSNING PRINSIPPET
**Vi jobber alltid mot den beste, mest komplette løsningen - aldri halvveis!**

**Viktige prinsipper:**
- ✅ **ALDRI ekskluder filer eller hopp over problemer** - Vi fikser alt ordentlig
- ✅ **FERDIGSTILL hver oppgave fullstendig** før vi går videre til neste
- ✅ **LØSE problemer når de oppstår** - ikke midlertidige workarounds
- ✅ **PERFEKT implementering** - ikke "funker sånn noenlunde"
- ✅ **SYSTEMET SKAL VÆRE BEDRE ENN ALLE ANDRE** - høyeste kvalitet
- ⛔ **IKKE droppe ting fordi det stopper opp** - press gjennom til løsning

**Når problemer oppstår:**
1. Analyser problemet grundig
2. Finn rot-årsaken, ikke bare symptomene  
3. Implementer en komplett, elegant løsning
4. Test at alt fungerer perfekt
5. Dokumenter løsningen for fremtiden

**Eksempel på riktig tilnærming:**
- ❌ Feil: "La oss ekskludere CartTest.tsx fra TypeScript midlertidig"
- ✅ Riktig: "La oss finne og fikse TypeScript-feilen i CartTest.tsx ordentlig"

---

## 🚀 Systemarkitektur

### Hovedkomponenter
- **Magic CLI** - Terminal koordinering og AI-orkestrering
- **Backend Server** - API, database og WebSocket hub
- **Frontend Dashboard** - React-basert visuelt grensesnitt
- **VS Code Extension** - IDE-integrasjon
- **AI Team Optimizer** - ML-basert team-optimalisering

### Teknologi Stack
- **Backend**: Node.js, Express, WebSocket, PostgreSQL, Redis
- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **AI**: OpenAI GPT-4, Anthropic Claude, Google Gemini
- **Deployment**: Vercel, Netlify, AWS, Docker

---

## 📋 Utviklingsworkflow

### 1. Før du starter koding
```bash
# Sjekk systemstatus
magic status

# Start koordinasjonssesjon
magic init

# Start backend (terminal 1)
npm run backend

# Start frontend (terminal 2)
cd src/dev && npm run dev
```

### 2. Under utvikling
- **Alltid teste endringer** før commit
- **Kjør lint og typecheck** for hver endring
- **Bruk TodoWrite tool** for komplekse oppgaver
- **Test både frontend og backend** integration
- **🚨 OPPDATER PROGRESS_LOG 2.md** for alle betydningsfulle endringer

### 3. Før push til git
```bash
# Build og test alt
npm run build
cd src/dev && npm run build

# Sjekk at ingen TypeScript feil
npm run lint

# KRITISK: Oppdater alltid PROGRESS_LOG 2.md
# Dokumenter alle endringer, fixes og forbedringer
# Inkluder build status og tekniske detaljer
```

**🚨 OBLIGATORISK REGEL:** 
**ALLTID oppdater `PROGRESS_LOG 2.md` ved enhver `npm run build` eller `git push`**
- Dokumenter alle endringer og fixes
- Inkluder build status og exit codes  
- Beskriv tekniske forbedringer
- Logg systemstatus og API testing resultater

---

## 🔧 Common Commands

### Backend utvikling
```bash
npm run backend          # Start backend server
npm run backend:dev      # Start med nodemon
node src/magic-cli.js    # Test CLI direkte
```

### Frontend utvikling
```bash
cd src/dev
npm run dev              # Development server
npm run build            # Production build
npm run preview          # Preview build
```

### VS Code extension
```bash
cd extensions/vscode
npm install              # Install dependencies
npm run compile          # Build extension
```

### Testing og deployment
```bash
magic build "test project"    # Test AI team building
magic deploy --provider=vercel # Test deployment
magic optimize               # Run ML optimization
```

---

## 🐛 Troubleshooting

### Port konflikter
```bash
# Finn prosesser på port
lsof -i :3000
lsof -i :8080

# Kill prosess
kill -9 $(lsof -t -i:3000)
```

### TypeScript feil
- **Les feilen grundig** - ikke bare ekskluder filer
- **Fiks type-problemer** i stedet for `@ts-ignore`
- **Oppdater interfaces** når data-strukturer endres

### API connection problemer
```bash
# Sjekk backend status
curl http://localhost:8080/health

# Sjekk miljøvariabler
cat .env.example

# Test WebSocket connection
magic status --verbose
```

### Build problemer
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clean dev build
cd src/dev
rm -rf node_modules package-lock.json dist
npm install
```

---

## 📚 Viktige filer og deres formål

### Root level
- **`package.json`** - Hovedprosjekt dependencies og scripts
- **`src/magic-cli.js`** - Hoved CLI entry point
- **`src/backend-server.js`** - Express server og API endpoints
- **`.env.example`** - Miljøvariabler template

### Frontend (`src/dev/`)
- **`src/DeveloperSystem.tsx`** - Hovedkomponent med navigation
- **`src/sections/`** - Alle funksjonalitets-seksjoner
- **`src/components/`** - Gjenbrukbare UI-komponenter
- **`src/services/api.ts`** - API-service for backend-kommunikasjon

### VS Code Extension (`extensions/vscode/`)
- **`src/extension.ts`** - Hovedfunksjonalitet
- **`package.json`** - Extension manifest

---

## 🎨 Kode-standarder

### TypeScript
- **Alltid bruk interfaces** for data-strukturer
- **Aldri `any` type** - bruk specific types
- **Export/import patterns** må være konsistente

### React komponenter
- **Functional components** med hooks
- **Props interfaces** for alle komponenter  
- **Consistent naming** - PascalCase for komponenter

### CSS/Styling
- **TailwindCSS classes** primært
- **CSS custom properties** for temaing
- **Mobile-first** responsive design

### Git commit messages
```bash
# Format: <type>: <description>
✨ feat: Add new feature
🔧 fix: Fix bug or issue  
📚 docs: Update documentation
🎨 style: Code formatting
♻️ refactor: Code refactoring
🚀 deploy: Deployment changes
```

---

## 🤖 AI Integration Best Practices

### Team Composition
- **Claude** - Frontend, UI/UX, Documentation
- **GPT-4** - Backend, API design, Complex logic
- **Gemini** - DevOps, Infrastructure, Optimization

### API Usage
- **Alltid handle errors** gracefully
- **Use timeout settings** for all API calls
- **Implement retry logic** for failed requests
- **Cache responses** when appropriate

### Performance
- **Monitor AI response times** via dashboard
- **Use ML optimization** for team performance
- **Track success rates** and adjust accordingly

---

## 📖 Documentation Standards

### Code Comments
- **Why, not what** - explain reasoning
- **Complex algorithms** need detailed explanations
- **API endpoints** document parameters and responses

### README files
- **Keep updated** with latest changes
- **Include examples** for all major features
- **Link to relevant documentation**

---

## 🚨 Emergency Procedures

### System down
1. Check backend server status
2. Verify database connection
3. Check API keys and credentials
4. Restart services in correct order

### Data corruption
1. Check recent commits for issues
2. Restore from git if needed
3. Verify database integrity
4. Run health checks

### Performance issues
1. Check system resources
2. Analyze API response times  
3. Review recent changes
4. Scale services if needed

---

*Dette dokumentet oppdateres kontinuerlig. Alle utviklere må følge disse prinsippene for å opprettholde systemkvalitet og konsistens.*