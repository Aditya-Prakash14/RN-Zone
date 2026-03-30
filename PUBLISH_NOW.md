# 🚀 Publish Your Extension - Quick Guide

Your extension is **ready to publish!** Here's how:

## 📦 Package Already Created

```
✅ File: react-native-manager-0.1.0.vsix
✅ Size: 30.81 KB (perfect!)
✅ Status: Ready to publish
```

---

## 🔑 Step 1: Create Personal Access Token (PAT)

### For Azure DevOps (Microsoft Account):

1. Sign in to https://dev.azure.com/
2. Click your profile icon → **Personal access tokens**
3. Click **New Token**
4. Fill in:
   - **Name:** `vscode-publish`
   - **Organization:** `All accessible organizations`
   - **Scopes:** ✓ `Marketplace (manage)`
5. **Copy the token** (you won't see it again!)

### For GitHub:

1. Go to https://github.com/settings/tokens
2. **Generate new token (classic)**
3. Scopes: `repo`, `user:email`, `write:packages`
4. Copy token

---

## 🎯 Step 2: Publish in 3 Ways

### Option A: Using the Publish Script (Easiest ⭐)

```bash
cd /Users/adityaprakash/Downloads/rn-manager-ext

# Edit publish.sh and paste your PAT on line 11
nano publish.sh

# Run the script
bash publish.sh
```

### Option B: One-Line Command

```bash
cd /Users/adityaprakash/Downloads/rn-manager-ext
vsce publish -p YOUR_PERSONAL_ACCESS_TOKEN_HERE
```

### Option C: Using vsce Login (One-Time Setup)

```bash
# First publish - login once
vsce login aditya-prakash
# Paste PAT when prompted

# Now you can publish without the token
vsce publish

# For future updates, just increment version and:
# vsce publish --patch   (0.1.0 → 0.1.1)
# vsce publish --minor   (0.1.0 → 0.2.0)
# vsce publish --major   (0.1.0 → 1.0.0)
```

---

## ✅ Verify Publishing Success

After publishing, check:

1. **Marketplace Page:**

   ```
   https://marketplace.visualstudio.com/items?itemName=aditya-prakash.react-native-manager
   ```

2. **VS Code Search:**
   - Open VS Code
   - Press `Ctrl+Shift+X` (Extensions)
   - Search: "React Native Manager"
   - Click **Install**

3. **Test the Extension:**
   - Open a React Native project
   - Click **RN Manager** in sidebar
   - Dashboard should load with 4 tabs ✓

---

## 📋 Pre-Publish Checklist

- [x] Extension builds: `npm run compile` ✓
- [x] Package created: `react-native-manager-0.1.0.vsix` ✓
- [x] Size is small: 30.81 KB ✓
- [x] Publisher set: `"aditya-prakash"` ✓
- [x] License included: MIT ✓
- [x] README.md complete ✓
- [x] CHANGELOG.md documented ✓
- [x] No external dependencies ✓

---

## 🔄 For Future Updates

```bash
# 1. Make your changes
# 2. Update version in package.json
# "version": "0.2.0"

# 3. Build and publish
npm run compile
vsce publish --minor   # or --patch / --major

# 4. Tag the release
git tag v0.2.0
git push origin v0.2.0

# 5. Create GitHub Release (optional)
# Go to https://github.com/Aditya-Prakash14/RN-Zone/releases/new
```

---

## 🆘 Troubleshooting

### "Token invalid or expired"

- Token has wrong scopes
- Token timed out (usually 1 year)
- Solution: Create new token with `Marketplace (manage)` scope

### "Publisher name mismatch"

- Publisher in package.json doesn't match account
- Current: `"publisher": "aditya-prakash"`
- Make sure this matches your Azure/GitHub publisher name

### "Extension already exists"

- You're publishing v0.1.0 again
- Solution: Increment version and publish:
  ```bash
  npm version patch    # Auto-increments and commits
  vsce publish         # Publish incremented version
  ```

### "Installation fails with 'corrupt/invalid'"

- Package might be corrupted
- Solution: Delete .vsix and recreate:
  ```bash
  rm react-native-manager-*.vsix
  npm run compile
  vsce package
  ```

---

## ✨ Success Metrics

When published successfully:

- ✅ Available on VS Code Marketplace
- ✅ Searchable by name, keywords
- ✅ Installable from VS Code UI
- ✅ Shown in extension stats
- ✅ Shareable marketplace link
- ✅ Reviews and ratings enabled

Your extension is now available to **2+ million VS Code users worldwide!**

---

## 📢 Marketing Your Extension

Share it on:

- **Twitter/X:** Mention @code (VS Code official)
- **Reddit:** r/vscode, r/reactnative
- **Dev.to:** Write a launch article
- **GitHub:** Add to README.md
- **Marketplace link:**
  ```
  https://marketplace.visualstudio.com/items?itemName=aditya-prakash.react-native-manager
  ```

Happy publishing! 🎉
