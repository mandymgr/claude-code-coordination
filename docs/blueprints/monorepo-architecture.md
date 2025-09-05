# Claude Code Coordination – Monorepo Blueprint (oppdatert med faktisk prosjektinnhold + TODOs)

Dette blueprintet er nå justert etter gjennomgang av eksisterende repo (versjon 2.0.0 med VS Code-extension, backend-server og CLI). Jeg har lagt inn en **oppdatert mappeplan** med TODO-kommentarer og en **prioritert PR-plan** som utvikleren kan følge.

---

## 📦 Mappestruktur (oppdatert)
```
claude-code-coordination/
├─ package.json (rot, scripts for dev/test)
├─ pnpm-workspace.yaml (ny)
├─ tsconfig.base.json (ny)
├─ .env.example
├─ packages/
│  ├─ shared/
│  │  ├─ src/
│  │  │  ├─ types.ts        // felles typer (TaskRequest, DiffPatch, LockEvent...)
│  │  │  └─ prompts.ts      // system-prompter for Claude, GPT, Gemini
│  ├─ server/               // backend-server, trekker ut src/backend-server.js
│  │  ├─ src/
│  │  │  ├─ index.ts        // Express + Socket.IO bootstrap
│  │  │  ├─ routes/
│  │  │  │  ├─ tasks.ts     // POST /tasks – kjører AI-adaptere
│  │  │  │  ├─ locks.ts     // POST /locks – sett/løs fil-lås
│  │  │  │  ├─ deploy.ts    // POST /deploy – Vercel/Netlify
│  │  │  │  └─ projects.ts  // POST /projects/from-prompt
│  │  │  ├─ adapters/
│  │  │  │  ├─ claudeAdapter.ts  // Anthropic Messages API
│  │  │  │  ├─ openaiAdapter.ts  // OpenAI Responses API
│  │  │  │  └─ geminiAdapter.ts  // Google Vertex AI
│  │  │  ├─ services/
│  │  │  │  ├─ diffService.ts    // apply unified diff + 3-veis merge fallback
│  │  │  │  ├─ lockService.ts    // TTL + broadcast over socket
│  │  │  │  ├─ taskService.ts    // agent-velger, orchestrering
│  │  │  │  └─ deployService.ts  // kall CLI for Vercel/Netlify
│  │  │  └─ utils/
│  │  │     ├─ env.ts
│  │  │     ├─ logger.ts
│  │  │     └─ normalize.ts // parser unified diffs fra AI
│  └─ extension/
│     ├─ src/
│     │  ├─ extension.ts
│     │  ├─ commands/
│     │  │  ├─ assignTask.ts         // POST /tasks, vis diff-preview
│     │  │  ├─ createProjectFromPrompt.ts // POST /projects/from-prompt
│     │  │  ├─ deploy.ts             // POST /deploy
│     │  │  └─ toggleFileLock.ts     // POST /locks
│     │  ├─ dashboard/panel.ts       // enkel Webview for AI-status
│     │  ├─ websocket.ts             // Socket.IO klient, oppdater dekorasjoner
│     │  ├─ decorations.ts           // 🔒-dekorasjoner
│     │  └─ utils/
│     │     ├─ api.ts                // kall server
│     │     └─ context.ts            // fang editor-kontekst
│     ├─ package.json
│     └─ tsconfig.json
└─ templates/
   ├─ todo-nextjs/      // minimal Next.js + Tailwind-app
   └─ express-api/      // minimal Express API
```

---

## ✅ Hva du allerede har (rebrukt)
- `src/backend-server.js` → flyttes til `packages/server/src/index.ts` og deles opp i routes/adapters/services.
- `extensions/vscode/src/*` → flyttes til `packages/extension/src/*`.
- `.claude-coordination/` runtime-mappen → behold som **lokal state**, men bruk `LockService` og `TaskService` til å skrive dit.
- `tests/` → kan beholdes, men bør flyttes inn i `packages/server/tests` for å matche strukturen.

---

## 🔧 TODO-kommentarer per fil
- `server/src/adapters/*.ts` → **TODO: bytt ut stub med ekte API-kall** (Anthropic/OpenAI/Google). Returner alltid unified diff.
- `server/src/services/diffService.ts` → **TODO: legg til git 3-veis merge fallback** (child_process `git merge-file`).
- `server/src/services/lockService.ts` → **TODO: legg til TTL og force override-policy**.
- `server/src/services/deployService.ts` → **TODO: parse deployment-URL fra CLI-output** og returner til extension.
- `extension/src/commands/*.ts` → **TODO: legg til “preview & apply patch”-UI** (åpne diff i editor, knapp for apply).
- `extension/src/websocket.ts` → **TODO: bruk Socket.IO-klient i stedet for ren WS** for å matche backend.
- `shared/prompts.ts` → **TODO: tilpass prompts til teamets kodepraksis** (clean code, sikkerhet, UX, osv.).

---

## 🔐 Sikkerhet
- **JWT** mellom extension og server (legg til `Authorization: Bearer <token>`).
- **API-nøkler kun på server** (`.env`).
- **Audit trail** i Postgres: `id, ts, agent, task, files_changed, diff_hash, user_id`.
- **Secret/lisens-skanning** før apply av patch (kan være stub først).

---

## 🚀 Prioritert PR-plan

### PR 1 – Struktur & fellesmoduler
- Opprett `pnpm-workspace.yaml` og `tsconfig.base.json`.
- Flytt VS Code-extension til `packages/extension`.
- Flytt backend til `packages/server`, lag `routes/`, `services/`, `adapters/`.
- Lag `packages/shared` (types + prompts).

### PR 2 – Adaptere & TaskService
- Implementer `claudeAdapter`, `openaiAdapter`, `geminiAdapter`.
- Standardiser retur (`diffText`, `tokens`, `diagnostics`).
- Oppdater `taskService.ts` til å velge agent + apply diff.

### PR 3 – Diff & LockService
- Lag `diffService.ts` med apply + 3-veis merge.
- Lag `lockService.ts` med TTL + broadcast til extension.
- Koble VS Code-dekorasjoner mot `/locks` events.

### PR 4 – Deploy & Templates
- Implementer `deployService.ts` for Vercel/Netlify.
- Legg til `templates/` (Next.js + Express).
- Lag `/projects/from-prompt` route som kopierer template + AI-tilpasning.

### PR 5 – Extension-UI
- Legg til diff-preview & apply.
- Oppdater `websocket.ts` til Socket.IO.
- Forbedre Dashboard-panelet (status, tasks, tokens brukt).

### PR 6 – Sikkerhet & audit
- JWT-auth mellom klient/server.
- Audit-log-tabell i Postgres.
- Secret/lisens-scan stub.

---

## 🧾 TODO-kommentarer (kopier inn i nye/eksisterende filer)

**packages/server/src/adapters/claudeAdapter.ts**
```ts
// TODO: Implement Anthropic Messages API call.
// Input: { system, user, context }; Output: { diffText }
// - Bruk system-prompt for FRONTEND.
// - Sørg for at responsen parses til ren unified diff (normalizeDiff()).
```

**packages/server/src/services/diffService.ts**
```ts
// TODO: MVP: apply unified diff m/ bibliotek.
// TODO (next): 3-veis merge via git; ved konflikt, lag AI-forslag og send tilbake til extension for “preview & resolve”.
```

**packages/extension/src/commands/assignTask.ts**
```ts
// TODO: POST /tasks med { task, context }
// - context: aktiv fil, selection, repo-root.
// - ved svar: åpne diff i ny editor (language: 'diff').
```

**packages/server/src/services/lockService.ts**
```ts
// TODO: setLock(path, lock, agentId) + TTL + broadcast via Socket.IO.
// - Policy: soft locks; server lagrer {path -> agentId, expiresAt}.
```

**packages/server/src/services/deployService.ts**
```ts
// TODO: Kjør 'npx vercel --prod --confirm' eller 'npx netlify deploy --prod'.
// - Parse URL fra stdout og returner til extension.
```

**packages/server/src/routes/projects.ts**
```ts
// TODO: /from-prompt
// - Kopier template til workspace
// - Kjør frontend-agent for ønsket tilpasning (diff)
// - apply diff og returner OK + evt. filer som ble endret
```

---

## 🧭 Notater for migrering fra dagens repo
- Behold **.claude-coordination/** uendret – pek server/extension til denne for runtime-state.
- Dagens `extensions/vscode`-kode kan flyttes nesten 1:1; kun import-paths må oppdateres.
- `src/backend-server.js` inneholder allerede Express/Socket.IO – bruk den som base for `index.ts` og trekk ut logikk til services/routes.

---

## 🧪 Test-strategi (hurtig)
- Unit: `normalizeDiff()` (golden tests: med/uten ```diff fences), `pickAgent()`
- Integration: `/tasks` → genererer diff → apply → repo endres
- E2E (dev): Extension-kommandoer mot lokal server

---

# 🧱 Produksjonsklare byggesteiner

## utils/normalize.ts
```ts
export function extractUnifiedDiff(raw: string): string {
  if (!raw) throw new Error('Empty model response');
  const fence = raw.match(/```diff\n([\s\S]*?)```/i);
  const candidate = fence ? fence[1].trim() : raw.trim();
  const start = candidate.search(/^---\s+a\//m);
  if (start === -1) throw new Error('No unified diff header (--- a/) found');
  const diff = candidate.slice(start);
  if (!/^@@/m.test(diff)) {
    if (!/^\+\+\+\s+b\//m.test(diff)) throw new Error('Invalid diff');
  }
  return diff;
}
```

## utils/retry.ts
```ts
export async function withRetry<T>(fn: () => Promise<T>, { retries = 3, baseMs = 400 } = {}) {
  let lastErr: any;
  for (let i = 0; i <= retries; i++) {
    try { return await fn(); } catch (e: any) {
      lastErr = e;
      if (i === retries) break;
      const ms = baseMs * Math.pow(2, i) + Math.floor(Math.random()*100);
      await new Promise(r => setTimeout(r, ms));
    }
  }
  throw lastErr;
}
```

## adapters/claudeAdapter.ts
```ts
import fetch from 'cross-fetch';
import { extractUnifiedDiff } from '../utils/normalize';
import { withRetry } from '../utils/retry';

type RunArgs = { system: string; user: string; context?: any };
export async function runClaude({ system, user, context }: RunArgs): Promise<string> {
  const body = { model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest', system, max_tokens: 4000, messages: [{ role: 'user', content: [{ type: 'text', text: user }, context ? { type: 'text', text: `Context:\n${JSON.stringify(context)}` } : undefined].filter(Boolean) }] };
  const resp = await withRetry(async () => {
    const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json','x-api-key': process.env.ANTHROPIC_API_KEY!,'anthropic-version': '2023-06-01'}, body: JSON.stringify(body)});
    if (!r.ok) throw new Error(`Anthropic ${r.status}: ${await r.text()}`);
    return r.json();
  });
  const text = resp.content?.map((c: any) => c.text).join('\n') || '';
  return extractUnifiedDiff(text);
}
```

## services/diffService.ts
```ts
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'fs/promises';
import path from 'path';
const pexec = promisify(execFile);

export async function applyUnifiedDiff(diffText: string, repoRoot = process.cwd()) {
  try {
    await pexec('git', ['apply', '--3way', '--whitespace=nowarn'], { cwd: repoRoot, input: diffText, env: process.env });
    return;
  } catch {
    const tmp = path.join(repoRoot, `.ccc-patch-${Date.now()}.patch`);
    await fs.writeFile(tmp, diffText, 'utf8');
    try { await pexec('git', ['apply', '--reject', '--whitespace=nowarn', tmp], { cwd: repoRoot }); }
    finally { await fs.unlink(tmp).catch(() => {}); }
  }
}
```

## services/lockService.ts
```ts
import type { Server } from 'socket.io';
const locks = new Map<string, { by: string; expiresAt: number }>();

export function setLock(io: Server, path: string, lock: boolean, agentId: string, ttlMs = 5*60_000) {
  if (lock) locks.set(path, { by: agentId, expiresAt: Date.now()+ttlMs }); else locks.delete(path);
  io.emit('lock.update', { path, agentId, locked: lock });
}

export function isLocked(path: string) {
  const e = locks.get(path);
  if (!e) return false;
  if (Date.now() > e.expiresAt) { locks.delete(path); return false; }
  return e.by;
}
```

## services/deployService.ts
```ts
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const pexec = promisify(execFile);

export async function deployToTarget(target: 'vercel'|'netlify', cwd = process.cwd()) {
  if (target === 'vercel') {
    const { stdout } = await pexec('npx', ['vercel', '--prod', '--confirm'], { cwd });
    return parseUrl(stdout) || 'https://vercel.com/deployments';
  }
  if (target === 'netlify') {
    const { stdout } = await pexec('npx', ['netlify', 'deploy', '--prod'], { cwd });
    return parseUrl(stdout) || 'https://app.netlify.com/';
  }
}
function parseUrl(s: string): string|undefined {
  const urls = Array.from(s.matchAll(/https?:\/\/\S+/g)).map(m=>m[0]);
  return urls.find(u => /vercel\.app|netlify\.app/.test(u)) || urls[0];
}
```

## utils/auth.ts
```ts
import jwt from 'jsonwebtoken';
const SECRET = process.env.CCC_JWT_SECRET || 'dev-secret';

export function sign(payload: any) { return jwt.sign(payload, SECRET, { expiresIn: '8h' }); }
export function verify(token?: string) { if (!token) throw new Error('No token'); return jwt.verify(token, SECRET); }
```

## extension/src/utils/api.ts
```ts
import * as vscode from 'vscode';
export async function callServer(path: string, body: any) {
  const base = vscode.workspace.getConfiguration('ccc').get('serverUrl') as string;
  const res = await fetch(base+path,{ method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer dev-token'}, body: JSON.stringify(body)});
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}
```

## extension/src/commands/assignTask.ts
```ts
import * as vscode from 'vscode';
import { callServer } from '../utils/api';
import { captureContext } from '../utils/context';

export async function assignTask(){
  const task = await vscode.window.showInputBox({ prompt: 'Task for AI team…'});
  if(!task) return;
  const context = await captureContext();
  const result = await callServer('/tasks',{ task, context });
  const doc = await vscode.workspace.openTextDocument({ content: result.diffText

