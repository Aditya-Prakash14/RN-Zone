# Quick Start

## Running the Extension

### Option 1: Press F5 (Recommended)
1. VS Code is now opening with the extension workspace
2. Press **F5** to launch the Extension Development Host
3. A new VS Code window will open with the extension loaded
4. Open any React Native project in the new window to test

### Option 2: Command Line
```bash
cd /Users/adityaprakash/Downloads/rn-manager-ext
npm run watch          # In terminal 1: watch TypeScript files
# Then in VS Code, press F5
```

## Testing the Extension

Once the Extension Development Host window opens:

1. **Open a React Native Project** (or create a test folder)
2. **Look for the RN Manager icon** in the Activity Bar (left sidebar)
3. **Click it** to open the Dashboard with 4 tabs:
   - ✦ New Project
   - ⬡ UI Libs
   - ▶ Scripts
   - ⊞ Generate

### Test Each Feature:

#### Create Project
- Select a template (Expo, CLI, etc.)
- Pick a package manager
- Click "Create Project"
- Watch terminal output with instructions

#### Install UI Library
- Click on a UI library card to expand
- Click "Install" button
- View setup guide in a markdown file

#### Run Scripts
- If package.json has scripts, they appear here
- Click ▶ to execute any script

#### Generate Component/Screen
- Enter a name (e.g., "Button" or "HomeScreen")
- Choose a template
- Select the folder to create in
- Component/screen opens in editor

## Debugging

- **Breakpoints**: Click line numbers in src/*.ts files
- **Debug Console**: View logs in Debug Console
- **Watch Variables**: Hover over variables to inspect
- **Call Stack**: Step through execution

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Launch Extension | F5 |
| Stop Debugging | Shift+F5 |
| Restart | Ctrl+Shift+F5 |
| Open Console | Ctrl+` |
| Go to Line | Ctrl+G |

## Troubleshooting

### Extension not loading?
- Check Debug Console (Ctrl+Shift+Y) for errors
- Verify `out/` folder exists with compiled .js files
- Run `npm run compile`

### Terminal not showing?
- Right-click in the new window, check "Toggle Integrated Terminal"
- Or press Ctrl+`

### Changes not reflecting?
- Save files and press F5 to reload
- Or run `npm run watch` to auto-compile

## Next: Publishing

When ready to publish to VS Code Marketplace:
```bash
npm install -g vsce
vsce package      # Creates .vsix file
vsce publish      # Publish to marketplace
```

Update repository URL in package.json first!
