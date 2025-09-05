# 🌊 Krins.dev Deployment Guide

## 🚀 Deploy to krins.dev

### Prerequisites
- Vercel account with access to krins.dev domain
- Vercel CLI installed: `npm install -g vercel`

### Deployment Steps

#### 1. Build for Production
```bash
cd src/dev
npm run build
```

#### 2. Login to Vercel
```bash
vercel login
```
Choose "Continue with GitHub" and follow the browser authentication flow.

#### 3. Deploy to Production
```bash
vercel --prod --yes
```
This will:
- Deploy to Vercel's production environment  
- Provide a deployment URL (e.g., `krins-code-koordinering-xyz.vercel.app`)
- Generate SSL certificate automatically

#### 4. Set Custom Domain in Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Find your deployed project
3. Go to **Settings** → **Domains**
4. Add domain: `krins.dev`
5. Add domain: `www.krins.dev` (optional)

#### 5. Configure DNS Records
In your domain provider (where you bought krins.dev):

**For apex domain (krins.dev):**
- Type: `A`
- Name: `@` 
- Value: `76.76.19.61` (Vercel's A record)

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

**Verification:**
After DNS propagation (5-10 minutes), visit:
- https://krins.dev ✅
- https://www.krins.dev ✅

### 📁 Project Structure for Deployment
```
src/dev/
├── dist/           # Built assets
├── index.html      # Entry point
├── assets/         # CSS, JS assets
└── vercel.json     # Vercel configuration
```

### 🔧 Vercel Configuration
The `vercel.json` is configured for:
- Static asset serving
- SPA routing (all routes → index.html)
- CORS headers for API calls
- Custom domain: krins.dev

### 🌍 Live URLs
- **Production**: https://krins.dev
- **Dashboard**: https://krins.dev/coordination
- **API Docs**: https://krins.dev/docs (when implemented)

### 🔄 Continuous Deployment
Connect GitHub repo to Vercel for automatic deployments:
1. Import GitHub repo in Vercel
2. Set build command: `cd src/dev && npm run build`
3. Set output directory: `src/dev/dist`
4. Enable auto-deployment on push to `main`

## 🎯 Next Steps
After deployment:
1. Test all routes work on krins.dev
2. Verify responsive design
3. Check performance metrics
4. Set up analytics
5. Configure error monitoring