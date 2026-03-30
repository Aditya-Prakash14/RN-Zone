# 📦 Publishing to VS Code Marketplace

## Step 1: Create a Publisher Account

### Option A: Microsoft Account (Recommended)

1. Go to https://marketplace.visualstudio.com/vscode
2. Click **Publish** (top right)
3. Sign in with Microsoft account or create one
4. Create a Publisher Name (e.g., `aditya-prakash`)
5. Accept terms and create

### Option B: GitHub Account

1. Go to https://marketplace.visualstudio.com/vscode
2. Click **Publish**
3. Sign in with GitHub
4. Create Publisher Name
5. Done!

---

## Step 2: Create Personal Access Token (PAT)

### For Microsoft/Azure DevOps:

1. Go to https://dev.azure.com/
2. Sign in with your Microsoft account
3. Click **User Settings** (top right, person icon)
4. Click **Personal access tokens**
5. Click **New Token**
6. Fill in:
   - **Name:** `vscode-publisher`
   - **Organization:** `All accessible organizations`
   - **Scopes:** Check `Marketplace (manage)`
7. Copy the token and **save it safely!**

### For GitHub:

1. Go to https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. Scopes needed: `repo`, `user:email`, `write:packages`
4. Copy token

---

## Step 3: Package the Extension

Run this in the extension directory:

```bash
cd /Users/adityaprakash/Downloads/rn-manager-ext

# Verify build is up to date
npm run compile

# Package the extension
vsce package

# Output: react-native-manager-0.1.0.vsix
```

---

## Step 4: Publish to Marketplace

### Option 1: Using PAT (Easiest)

```bash
vsce publish -p <your-personal-access-token>
```

Example:

```bash
vsce publish -p xyz1234...abcd
```

### Option 2: Using vsce login

```bash
# First time setup
vsce login aditya-prakash

# Enter PAT when prompted
# Then publish
vsce publish
```

### Option 3: Update version and publish

```bash
# Increment version in package.json
# "version": "0.1.1"

npm run compile
vsce publish

# Will automatically increment patch version
vsce publish --patch
```

---

## Step 5: Verify Publishing

1. Go to https://marketplace.visualstudio.com/items?itemName=aditya-prakash.react-native-manager
2. Or search "React Native Manager" in VS Code Marketplace
3. Install and test!

---

## Publishing Commands Reference

```bash
# Package only (creates .vsix file)
vsce package

# Login to publisher account
vsce login <publisher-name>

# Publish with token
vsce publish -p <token>

# Publish and auto-increment version
vsce publish --patch    # 0.1.0 → 0.1.1
vsce publish --minor    # 0.1.0 → 0.2.0
vsce publish --major    # 0.1.0 → 1.0.0

# Logout
vsce logout

# Check package contents
vsce ls
```

---

## Important Before Publishing

- ✅ Build compiles: `npm run compile`
- ✅ Version in package.json matches release
- ✅ README.md is complete and accurate
- ✅ CHANGELOG.md documents changes
- ✅ LICENSE file included
- ✅ Icon looks good (rn-icon.svg)
- ✅ No large dependencies (0 external deps ✓)
- ✅ Git history clean

---

## After Publishing

1. **Update version** for next release
2. **Tag git commit:** `git tag v0.1.0`
3. **Push tags:** `git push origin v0.1.0`
4. **Create GitHub Release** with changelog

```bash
git tag v0.1.0
git push origin v0.1.0
```

---

## Troubleshooting

### "Publisher name doesn't match"

- Update `publisher` in package.json to match your account
- Example: `"publisher": "aditya-prakash"`

### "Extension already exists"

- You own this version - use `vsce publish --patch` to increment version
- Or use different `name` and `publisher` combo

### "Invalid PAT"

- Token expired or has wrong scopes
- Create new token with `Marketplace (manage)` scope

### "Icon not found"

- Verify `icon` path in package.json: `"icon": "resources/rn-icon.svg"`
- Check file exists: `ls resources/rn-icon.svg`

### "Large file warning"

- Check `.vscodeignore` to exclude unnecessary files
- Remove `node_modules/` from package

---

## Done! 🎉

Your extension is now available to **2M+ VS Code users**!

Share the marketplace link:

```
https://marketplace.visualstudio.com/items?itemName=aditya-prakash.react-native-manager
```
