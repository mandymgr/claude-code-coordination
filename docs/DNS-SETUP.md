# 🌊 DNS Setup for krins.dev

## Quick Setup Guide

### 1. Deploy to Vercel First
```bash
# Run the deployment script
./deploy-krins.sh

# Or manually:
cd src/dev
vercel login  # Choose GitHub authentication
vercel --prod --yes
```

### 2. Add Domain in Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Find your project: `krins-code-koordinering`
3. Go to **Settings** → **Domains**
4. Click **Add** and enter: `krins.dev`
5. Click **Add** and enter: `www.krins.dev` (optional)

### 3. Configure DNS Records

**In your domain provider panel (where you bought krins.dev):**

#### Primary Domain (krins.dev)
```
Type: A
Name: @ (or blank/root)  
Value: 76.76.19.61
TTL: Auto or 300
```

#### WWW Subdomain (optional)
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto or 300
```

### 4. Verification Steps

**After saving DNS records (wait 5-10 minutes):**

1. Check DNS propagation:
   ```bash
   nslookup krins.dev
   # Should return: 76.76.19.61
   ```

2. Test URLs:
   - https://krins.dev ✅
   - https://www.krins.dev ✅ (if configured)

3. Verify SSL certificate:
   - Green padlock should appear in browser
   - Certificate issued by Vercel

### 5. Troubleshooting

#### DNS not propagating?
- Wait up to 24 hours for full global propagation
- Use online DNS checker: https://www.whatsmydns.net
- Clear browser cache: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

#### Vercel says "Invalid Configuration"?
- Double-check A record value: `76.76.19.61`
- Ensure Name field is `@` or blank for root domain
- Remove any conflicting DNS records

#### SSL Certificate issues?
- Wait 10-15 minutes after DNS propagation
- SSL certificates are issued automatically by Vercel
- Force refresh in browser to see updated certificate

### 6. Success Checklist
- [ ] Vercel deployment completed successfully
- [ ] Custom domain added in Vercel dashboard  
- [ ] A record configured: `@` → `76.76.19.61`
- [ ] CNAME record configured: `www` → `cname.vercel-dns.com` (optional)
- [ ] DNS propagation confirmed with nslookup
- [ ] https://krins.dev loads correctly
- [ ] SSL certificate shows as valid
- [ ] All app functionality works in production

## 🎉 All Done!

Your Krins Code-koordinering system is now live at:
- **🌊 https://krins.dev** - Main application
- **📊 https://krins.dev/coordination** - Developer dashboard

### Next Steps After Deployment:
1. Test all functionality in production
2. Share the URL with team members
3. Monitor performance in Vercel analytics
4. Set up error monitoring (optional)
5. Configure custom email forwarding for @krins.dev (optional)