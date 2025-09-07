# 📋 GitHub Repository Rename Guide

**Complete guide for renaming GitHub repositories to new KRINS names**

---

## 🎯 **Repository Renaming Overview**

### **Required Changes**
1. **claude-code-coordination** → **KRINS-Universe-Builder**
2. **Krins-Dev-Memory-OS** → **KRINS-Chronicle-Keeper**

### **Benefits of Renaming**
- ✅ **Clear Brand Identity** - KRINS naming consistency
- ✅ **Professional Naming** - Enterprise-grade repository names
- ✅ **Better Discoverability** - Searchable, descriptive names
- ✅ **Unified Ecosystem** - Both repositories clearly part of KRINS suite

---

## 🔄 **Step-by-Step Rename Process**

### **Phase 1: Prepare Local Repositories**

#### **Universe-Builder (Already Done ✅)**
```bash
# Local directory already renamed
cd /Users/mandymarigjervikrygg/Desktop/code/KRINS-Universe-Builder

# Package.json updated with:
# - name: "krins-universe-builder"  
# - description: "KRINS-Universe-Builder - The Ultimate AI Development Universe"
# - repository URL: "git+https://github.com/mandymgr/KRINS-Universe-Builder.git"
# - homepage: "https://krins-universe-builder.vercel.app"
```

#### **Chronicle-Keeper (Already Done ✅)**
```bash
# Local directory already renamed
cd /Users/mandymarigjervikrygg/Desktop/code/KRINS-Chronicle-Keeper

# All documentation updated with new name references
```

---

### **Phase 2: GitHub Repository Renaming**

#### **Universe-Builder Repository**
1. **Go to GitHub Repository**
   - Navigate to: https://github.com/mandymgr/claude-code-coordination

2. **Repository Settings**
   - Click on "Settings" tab
   - Scroll down to "Repository name" section

3. **Rename Repository**
   - Change name from: `claude-code-coordination`
   - To: `KRINS-Universe-Builder`
   - Click "Rename"

4. **Confirm Rename**
   - GitHub will ask for confirmation
   - Type the new name to confirm
   - Repository is instantly renamed

#### **Chronicle-Keeper Repository**
1. **Go to GitHub Repository**
   - Navigate to: https://github.com/mandymgr/Krins-Dev-Memory-OS

2. **Repository Settings**
   - Click on "Settings" tab
   - Scroll down to "Repository name" section

3. **Rename Repository**
   - Change name from: `Krins-Dev-Memory-OS`
   - To: `KRINS-Chronicle-Keeper`
   - Click "Rename"

4. **Confirm Rename**
   - GitHub will ask for confirmation
   - Type the new name to confirm

---

### **Phase 3: Update Remote Origins**

#### **Update Local Git Remote URLs**

**Universe-Builder:**
```bash
cd /Users/mandymarigjervikrygg/Desktop/code/KRINS-Universe-Builder

# Update remote origin URL
git remote set-url origin https://github.com/mandymgr/KRINS-Universe-Builder.git

# Verify the change
git remote -v
# Should show: origin https://github.com/mandymgr/KRINS-Universe-Builder.git
```

**Chronicle-Keeper:**
```bash
cd /Users/mandymarigjervikrygg/Desktop/code/KRINS-Chronicle-Keeper

# Update remote origin URL  
git remote set-url origin https://github.com/mandymgr/KRINS-Chronicle-Keeper.git

# Verify the change
git remote -v
# Should show: origin https://github.com/mandymgr/KRINS-Chronicle-Keeper.git
```

#### **Test Connectivity**
```bash
# Test push/pull still works
git pull origin main
git push origin main
```

---

### **Phase 4: Update Repository Descriptions**

#### **Universe-Builder Description**
```
🌌 The Ultimate AI Development Universe

The ultimate AI universe builder with quantum computing, blockchain, and autonomous system creation. Transform any codebase into an intelligent, self-optimizing development environment with AI-powered assistance, automatic deployment, and team coordination.
```

**Topics to Add:**
```
ai, universe-builder, krins, quantum-computing, blockchain, automation, 
enterprise-development, multi-ai-coordination, code-generation, 
zero-config-deployment, quality-gates, real-time-collaboration
```

#### **Chronicle-Keeper Description**
```  
📚 Organizational Intelligence System

AI-integrated organizational memory system that preserves team decisions, patterns, and knowledge. Provides architectural context to KRINS-Universe-Builder for intelligent, decision-aware code generation.
```

**Topics to Add:**
```
organizational-intelligence, adr, architectural-decisions, krins, 
knowledge-management, ai-integration, decision-tracking, 
patterns-library, team-collaboration, institutional-memory
```

---

### **Phase 5: Update Dependencies & Integrations**

#### **Deployment URLs**
- **Vercel Projects:** Update deployment URLs
  - Old: `claude-coordination.vercel.app`
  - New: `krins-universe-builder.vercel.app`

#### **NPM Package Names**
```bash
# If publishing to NPM, update package names
# Universe-Builder: krins-universe-builder
# Chronicle-Keeper: krins-chronicle-keeper
```

#### **Documentation Links**
Update any external documentation that references the old repository names.

---

## 🔒 **What GitHub Automatically Handles**

### **✅ Automatic Redirects**
- Old URLs automatically redirect to new URLs
- `github.com/mandymgr/claude-code-coordination` → `github.com/mandymgr/KRINS-Universe-Builder`
- Existing bookmarks and links continue to work

### **✅ Preserved Elements**
- **Git History** - Complete commit history preserved
- **Issues & PRs** - All issues and pull requests remain
- **Releases** - All releases and tags preserved  
- **Wiki & Projects** - Wiki pages and project boards unchanged
- **Stars & Forks** - All stars, forks, and watchers retained

### **✅ Clone URLs**
- Old clone URLs continue to work temporarily
- New clone URLs immediately available

---

## ⚠️ **Important Considerations**

### **External References**
Update these manually after renaming:

1. **README Badges**
   - Update any shields.io badges with new repository names
   - Update CI/CD status badges

2. **External Documentation**
   - Update any external docs that link to repositories
   - Update integration documentation

3. **Clone Instructions**
   - Update any documentation with clone instructions
   - Update setup guides

### **CI/CD Services**
Check these services may need URL updates:
- **Vercel/Netlify** - Deployment configurations
- **GitHub Actions** - Should work automatically
- **External CI/CD** - May need manual URL updates

---

## 🚀 **Post-Rename Verification**

### **Verification Checklist**

#### **Universe-Builder**
- [ ] Repository accessible at new URL
- [ ] Git remote origin updated locally  
- [ ] Can push/pull successfully
- [ ] Package.json has correct repository URL
- [ ] README badges updated
- [ ] Documentation links work

#### **Chronicle-Keeper**  
- [ ] Repository accessible at new URL
- [ ] Git remote origin updated locally
- [ ] Can push/pull successfully
- [ ] All documentation references updated
- [ ] Integration guides reference new names

### **Integration Testing**
```bash
# Test cross-system integration still works
cd KRINS-Universe-Builder
# Test import from Chronicle-Keeper using new paths
```

---

## 📊 **Rename Timeline**

### **Immediate (5 minutes)**
1. Rename repositories on GitHub
2. Update local remote URLs
3. Test git connectivity

### **Short-term (1 hour)**
1. Update repository descriptions
2. Add repository topics
3. Update any deployment URLs

### **Medium-term (1 day)**
1. Update external documentation
2. Update any CI/CD configurations
3. Notify team members of new URLs

---

## 🎯 **Success Metrics**

### **Technical Success**
- ✅ All git operations work with new URLs
- ✅ CI/CD pipelines continue functioning  
- ✅ Cross-system integration maintained
- ✅ No broken links in documentation

### **Brand Success**
- ✅ Consistent KRINS naming across ecosystem
- ✅ Professional repository names
- ✅ Clear system purpose from names
- ✅ Better search discoverability

---

## 🆘 **Rollback Plan**

If issues arise, repositories can be renamed back:

1. **GitHub Settings** → **Repository name**
2. **Rename back** to original names
3. **Update local remotes** to old URLs
4. **Revert package.json** changes

**Note:** GitHub keeps old redirect for 1 hour, so rollback is seamless if done quickly.

---

## 🌟 **Final Result**

After successful renaming:

- **🌌 KRINS-Universe-Builder** - The Ultimate AI Development Universe
- **📚 KRINS-Chronicle-Keeper** - Organizational Intelligence System

Both repositories will have:
- ✅ Professional, descriptive names
- ✅ Consistent KRINS branding  
- ✅ Clear system purpose
- ✅ Better discoverability
- ✅ Maintained functionality

**Ready to execute the rename! 🚀**