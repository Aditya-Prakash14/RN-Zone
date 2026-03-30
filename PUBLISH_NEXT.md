## ✅ Publisher ID Fixed!

Changed from: `aditya-prakash` → `AdityaDevExtensions`

### Next: Authenticate & Publish

You get a **401 error** because vsce needs authentication. Use one of these methods:

---

## **Option 1: Provide PAT Directly (Quickest)**

```bash
cd /Users/adityaprakash/Downloads/rn-manager-ext

vsce publish -p YOUR_PERSONAL_ACCESS_TOKEN
```

Example:

```bash
vsce publish -p "abcd1234efgh5678ijkl9012mnop3456..."
```

---

## **Option 2: Login Once (Recommended)**

```bash
# First time
vsce login AdityaDevExtensions

# Paste your PAT when prompted
# Enter PAT: [paste your token]

# Now publish
vsce publish
```

---

## **Option 3: Using Environment Variable**

```bash
export VSCE_PAT="your_token_here"
vsce publish
```

---

## 🔑 Get Your Personal Access Token

1. **Sign in to:** https://dev.azure.com/
2. Click your **profile icon** (top right)
3. Select **Personal access tokens**
4. Click **New Token**
5. Fill in:
   - **Name:** `vscode-publish`
   - **Organization:** `All accessible organizations`
   - **Scopes:** Check `Marketplace (manage)` ✓
6. Click **Create**
7. **Copy the token immediately** (shown only once!)

---

## Ready to Publish?

Once you have your token, run:

```bash
vsce publish -p "YOUR_TOKEN_HERE"
```

Or ask me to do it and paste your token securely.
