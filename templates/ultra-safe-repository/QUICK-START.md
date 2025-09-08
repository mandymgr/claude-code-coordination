# 🚀 ULTRA-SAFE Repository - Quick Start

> **Transform any repository into an enterprise-grade secure codebase in 30 seconds**

## ⚡ One-Command Setup

```bash
# Download and run setup script
curl -fsSL https://raw.githubusercontent.com/your-org/ultra-safe-template/main/setup-ultra-safe-repository.sh | bash
```

## 📋 Manual Setup (3 steps)

```bash
# 1. Copy security files
cp templates/ultra-safe-repository/.gitignore .
cp templates/ultra-safe-repository/hooks/pre-commit .git/hooks/
cp -r templates/ultra-safe-repository/scripts .

# 2. Make scripts executable  
chmod +x .git/hooks/pre-commit scripts/repository-health-check.sh

# 3. Test setup
./scripts/repository-health-check.sh
```

## 🎯 What You Get

✅ **Blocks 140+ dangerous file types automatically**  
✅ **Detects secrets in file content (API keys, passwords)**  
✅ **Prevents large files (>1MB) from being committed**  
✅ **Real-time repository health monitoring**  
✅ **Zero configuration required - works immediately**

## 🧪 Test It Works

```bash
# Try to commit a dangerous file (will be blocked)
echo "sk-1234567890abcdef" > secret.env
git add secret.env
git commit -m "Test"

# Output:
# 🚨 BLOCKED: Dangerous file detected: secret.env (matches .env)
# 🚨 BLOCKED: Potential secret detected in secret.env
# ❌ COMMIT BLOCKED - Dangerous files or secrets detected!
```

## 📊 Daily Usage

```bash
# Check repository health
./scripts/repository-health-check.sh

# Normal git workflow (security runs automatically)
git add .
git commit -m "Your changes"
git push
```

## 🆘 Need Help?

- **Hook blocking legitimate files?** Add exceptions to `.gitignore`
- **Want to customize patterns?** Edit `.git/hooks/pre-commit`
- **Repository health issues?** Run `./scripts/repository-health-check.sh`

**🔒 Your repository is now ULTRA-SAFE!**