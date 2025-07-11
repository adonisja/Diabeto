# 🛡️ SAFE GIT WORKFLOW INSTRUCTIONS
# =====================================
# PRIVATE FILE - Contains internal development guidelines
# This file is ignored by .gitignore for security and organizational purposes

## � Overview
This document provides secure Git workflow procedures and security guidelines for the Diabeto development process. It establishes protocols for safe code management and prevents accidental exposure of sensitive information.

**📄 Document Purpose**: Git workflow security, version control best practices, and sensitive file management guidelines.

**✅ What belongs in this document:**
- Git workflow procedures and commands
- Security protocols for version control
- File exclusion guidelines and .gitignore management
- Branching strategies and commit best practices
- Repository security measures
- Deployment and release procedures
- Sensitive information handling protocols

**❌ What does NOT belong here:**
- Bug fixes and technical troubleshooting (→ BUGS_AND_FIXES.md)
- Feature implementation details (→ DOCUMENTATION_INDEX.md)
- Code architecture explanations (→ ARCHITECTURE.md, PROJECT_STRUCTURE.md)
- General development documentation

---

## �🚨 CRITICAL SECURITY RULES

### **NEVER COMMIT THESE FILES:**
- `BUGS_AND_FIXES.md` - Contains security vulnerabilities and admin access patterns
- `PROJECT_STRUCTURE.md` - Contains internal architecture and sensitive file paths  
- `REFACTORING_SUMMARY.md` - Personal learning tool and internal development notes
- `firebase/firebaseConfig.ts` - Contains API keys and Firebase credentials
- `firestore.rules` - Contains security model and database rules
- `temp_admin_setup.js` - Contains admin setup scripts
- Any `.env` files - Contains environment variables and secrets
- Any `.keystore` files - Contains signing keys

## 🔒 SAFE GIT WORKFLOW

### **Step 1: ALWAYS Check Status First**
```bash
git status
```
**Look for:**
- Files in red (untracked) that might be sensitive
- Files in green (staged) that shouldn't be public
- Any files with "config", "secret", "key", or sensitive data

### **Step 2: Add Files Selectively (NEVER use git add .)**
```bash
# ✅ SAFE - Add specific files
git add src/components/MyComponent.tsx
git add assets/styles/myStyles.ts
git add app/screens/MyScreen.tsx

# ❌ DANGEROUS - Adds EVERYTHING including sensitive files
git add .
git add -A
git add *
```

### **Step 3: Double-Check Before Committing**
```bash
# Check what's about to be committed
git status

# Review the actual changes
git diff --cached

# Only then commit
git commit -m "your descriptive message"
```

### **Step 4: Verify .gitignore is Working**
```bash
# Check that sensitive files are ignored
git status | grep -E "(BUGS_AND_FIXES|PROJECT_STRUCTURE|REFACTORING_SUMMARY|firebaseConfig|firestore\.rules)"

# Should show nothing if properly ignored
```

## 🚫 COMMANDS TO AVOID

### **Never Use These:**
```bash
git add .           # Adds ALL files (including sensitive ones)
git add -A          # Adds ALL files (including sensitive ones)
git add *           # Adds ALL files (including sensitive ones)
git add --all       # Adds ALL files (including sensitive ones)
```

### **Emergency Commands if You Accidentally Add Sensitive Files:**
```bash
# Remove from staging area (before commit)
git reset HEAD filename.ext

# Remove from git tracking entirely (after already committed)
git rm --cached filename.ext
git commit -m "Remove sensitive file from tracking"
```

## 📋 PRE-COMMIT CHECKLIST

Before every commit, verify:
- [ ] `git status` shows only intended files
- [ ] No sensitive files in the staging area
- [ ] No API keys, passwords, or secrets in the changes
- [ ] All sensitive files remain "untracked" (red in git status)

## 🔍 REGULAR SECURITY AUDITS

### **Weekly Check:**
```bash
# Ensure sensitive files are not tracked
git ls-files | grep -E "(firebaseConfig|firestore\.rules|BUGS_AND_FIXES|PROJECT_STRUCTURE|REFACTORING_SUMMARY|\.env|\.key)"

# Should return empty if everything is properly ignored
```

### **Before Pushing to Remote:**
```bash
# Final safety check
git log --oneline -5
git show HEAD --name-only
```

## 🆘 EMERGENCY RECOVERY

### **If Sensitive Files Were Committed:**
1. **Immediate action:**
   ```bash
   git rm --cached SENSITIVE_FILE.ext
   git commit -m "security: Remove sensitive file from tracking"
   ```

2. **For remote repositories:**
   ```bash
   git push origin main
   ```

3. **Consider the file permanently compromised:**
   - Change any API keys or secrets contained in the file
   - Rotate any credentials that were exposed
   - Update Firebase security rules if applicable

## 📁 SAFE FILE ORGANIZATION

### **Always Safe to Commit:**
- `src/` directory (application source code)
- `assets/styles/` directory (style files)
- `components/` directory (React components)
- `app/` directory (screens and navigation)
- `package.json` and `package-lock.json`
- `README.md` (public documentation)
- `ARCHITECTURE.md` (high-level public architecture)

### **Never Commit:**
- `BUGS_AND_FIXES.md`
- `PROJECT_STRUCTURE.md`
- `REFACTORING_SUMMARY.md`
- `firebase/firebaseConfig.ts`
- `firestore.rules`
- `temp_admin_setup.js`
- `.env*` files
- `*.keystore` files
- Internal documentation with sensitive details

## 💡 BEST PRACTICES

1. **Create .gitignore FIRST** - Before adding any files to the repository
2. **Use descriptive commit messages** - Explain what you changed and why
3. **Commit frequently** - Small, focused commits are easier to review and revert
4. **Review changes before committing** - Use `git diff` to see what you're committing
5. **Keep learning notes private** - Personal development notes should not be public

## 🎯 REMEMBER

**The goal is to keep sensitive information private while maintaining a clean, professional public repository that showcases your development skills without exposing internal details or security vulnerabilities.**

---
*This file is automatically ignored by .gitignore and should never be committed to the repository.*
