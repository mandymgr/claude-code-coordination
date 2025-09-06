# 📱 Mobil Utviklingsguide - VS Code + Codespaces + Claude Code

## 🚀 Rask Setup (5 minutter)

### Steg 1: Start Codespace
1. Åpne [dette repoet på GitHub](https://github.com/din-bruker/claude-code-coordination)
2. Trykk **Code** → **Codespaces** → **Create codespace on main**
3. Vent mens miljøet bygges (første gang tar 2-3 minutter)

### Steg 2: Installer Claude Code
Claude Code installeres automatisk via `.devcontainer/devcontainer.json` - ingen manuell installasjon nødvendig!

### Steg 3: Sett API-nøkkel
**Anbefalt metode (sikker):**
1. GitHub → Settings (din profil) → Codespaces → Secrets → New secret
2. Navn: `ANTHROPIC_API_KEY`
3. Verdi: [din Claude API-nøkkel]
4. Add secret

**Alternativ (rask):**
- VS Code Web → Settings → Extensions → Claude Code → API Key

## 📲 Mobiloptimalisering

### Safari/Chrome (anbefalt)
1. Åpne Codespace i Safari/Chrome
2. Trykk Share-knappen → **Add to Home Screen**
3. Gi den navn "Dev Environment" 
4. Nå har du 1-tap tilgang som "app"!

### Skjul verktøylinjer (mer plass)
- **Safari**: Trykk AA-knappen → Hide Toolbar
- **Chrome**: Scroll ned for å skjule adresseline

### Tastaturhurtigtaster (mobil)
- **Command Palette**: Trykk og hold på terminal-området → Command Palette
- **File Explorer**: Swipe fra venstre kant
- **Terminal**: Ctrl+` (hvis du har Bluetooth-tastatur)

## ⌨️ Bluetooth Tastatur (sterkt anbefalt!)

Med Bluetooth-tastatur får du alle VS Code hurtigtaster:
- `⌘+Shift+P` - Command Palette
- `⌘+P` - Åpne fil raskt  
- `Ctrl+`` - Toggle terminal
- `⌘+/` - Kommentér kode
- `F5` - Debug/Run

## 🔧 Tilgjengelige Kommandoer

Alle disse kommandoene fungerer i terminal:

```bash
# Start backend server
npm run backend

# Start frontend (i egen terminal)
cd src/dev && npm run dev

# Magic CLI kommandoer
node src/magic-cli.js status
node src/magic-cli.js build "test project"

# Git workflow  
git add -A
git commit -m "Mobil commit fra Codespaces"
git push
```

## 🌐 Porter og URLs

Codespaces videresender automatisk porter:
- **3000** - Frontend (React app)
- **8080** - Backend API
- **5173** - Vite dev server

Trykk på "Ports" fanen nederst for å åpne app-URLer.

## 🛠️ Forhåndsinstallerte Verktøy

Miljøet kommer ferdig konfigurert med:
- ✅ Claude Code extension
- ✅ Node.js 20 + npm/pnpm
- ✅ Python 3.11
- ✅ Docker support
- ✅ GitHub CLI
- ✅ ESLint + Prettier
- ✅ TailwindCSS support
- ✅ TypeScript support

## 🔍 Feilsøking

### Claude Code fungerer ikke?
1. Sjekk at `ANTHROPIC_API_KEY` er satt i Codespaces Secrets
2. Rebuild container: `⌘+Shift+P` → "Rebuild Container"

### Slow performance?
- Close unødvendige filer/tabs
- Restart Codespace hvis nødvendig

### Terminal kommandoer feiler?
```bash
# Sjekk at du er i riktig directory
pwd

# Installer dependencies hvis mangler
npm install
cd src/dev && npm install
```

## ⚡ Pro Tips

1. **Split terminal**: Høyreklikk på terminal → Split Terminal
2. **File search**: `⌘+P` for rask filnavigasjon  
3. **Multi-cursor**: Hold Alt og klikk flere steder
4. **Zen mode**: `⌘+K Z` for distraction-free koding
5. **Live Share**: Del skjermen med andre utviklere

## 📊 Nyttige Paneler

- **Source Control** (`Ctrl+Shift+G`) - Git status og commits
- **Extensions** (`⌘+Shift+X`) - Manage extensions
- **Explorer** (`⌘+Shift+E`) - File browser
- **Terminal** (`Ctrl+``) - Command line
- **Problems** - TypeScript/linting errors

## 🔄 Commit fra Mobile

```bash
# Quick commit workflow
git add -A
git status                          # sjekk endringer
git commit -m "feat: implementert feature X fra mobil"
git push
```

Eller bruk Source Control panelet i VS Code for visuell Git-handling.

## 🎯 Anbefalte Workflows

### Morning routine:
1. Åpne Codespace fra home screen
2. `git pull` for siste endringer
3. `npm run backend` i terminal 1
4. `cd src/dev && npm run dev` i terminal 2
5. Åpne port 3000 for frontend preview

### Evening routine:
1. Commit dagens arbeid
2. Push til GitHub
3. Stop/pause Codespace (sparer ressurser)

## 🚨 Viktige Notater

- **Codespaces har gratis-tier** - men begrenset timer per måned
- **Auto-stop**: Codespace stoppes automatisk etter 30 min inaktivitet
- **Persistence**: Alle filer lagres automatisk i Codespace
- **Performance**: Kjører på GitHub sine servere - kan være raskere enn lokal utvikling!

---

**Happy mobile coding! 🎉📱💻**