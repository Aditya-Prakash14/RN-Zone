#!/bin/bash
#
# VS Code Marketplace Publishing Script
# Run this after creating a Personal Access Token
#

EXTENSION_DIR="/Users/adityaprakash/Downloads/rn-manager-ext"
PUBLISHER="aditya-prakash"
PAT=""  # <-- PASTE YOUR TOKEN HERE

if [ -z "$PAT" ]; then
    echo "❌ No PAT provided!"
    echo ""
    echo "Steps:"
    echo "1. Go to https://dev.azure.com/ and sign in"
    echo "2. Create Personal Access Token with 'Marketplace (manage)' scope"
    echo "3. Copy token and paste it in this script (line 11)"
    echo "4. Run: bash publish.sh"
    exit 1
fi

cd "$EXTENSION_DIR"

echo "📦 Step 1: Building TypeScript..."
npm run compile

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "📦 Step 2: Packaging extension..."
vsce package

echo ""
echo "🚀 Step 3: Publishing to marketplace..."
vsce publish -p "$PAT"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Extension published!"
    echo ""
    echo "View it here:"
    echo "https://marketplace.visualstudio.com/items?itemName=${PUBLISHER}.react-native-manager"
else
    echo "❌ Publishing failed!"
    exit 1
fi
