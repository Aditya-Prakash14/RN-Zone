# React Native Manager — VS Code Extension

A full-featured VS Code extension for managing React Native projects — scaffolding, UI library setup, script running, and component generation.

---

## Features

### ⚡ Project Scaffolding
Create new projects directly from the sidebar:

| Template | Description |
|---|---|
| **Expo Blank** | Managed workflow, blank TypeScript template |
| **Expo Router** | File-based routing with the `tabs` template |
| **RN CLI** | Bare workflow, full native control |
| **RN CLI + TypeScript** | Bare workflow with TS template |

### ⬡ UI Library Setup
One-click install + guided setup for:

| Library | Highlights |
|---|---|
| **React Native Paper** | Material Design 3, theming, dark mode, accessibility |
| **NativeWind** | Tailwind CSS utility classes in React Native |
| **Gluestack UI** | Universal, accessible, RSC-ready for RN + Web |
| **React Native Elements** | Cross-platform components with customizable theming |
| **Tamagui** | Compile-time optimized, universal RN + Web support |

Each library install automatically opens a setup guide in Markdown with all provider wrapping, config files, and babel plugin steps.

### ▶ Script Runner
- Lists all `package.json` scripts in a sidebar panel
- Run any script with one click (respects npm/yarn/bun)
- Quick-run buttons for common Expo/RN CLI commands

### ⊞ Code Generator
**Components** — 4 styles:
- Functional
- Memo (`React.memo`)
- With `StyleSheet`
- With NativeWind class names

**Screens** — 4 templates:
- Basic
- With header `navigation.setOptions()`
- Scrollable (`ScrollView`)
- With `SafeAreaView`

Both are TypeScript-aware (auto-detects `tsconfig.json`).

---

## Usage

### From the Activity Bar
Click the **RN Manager** icon in the left sidebar to open the dashboard panel.

### From the Command Palette (`Cmd/Ctrl+Shift+P`)
- `RN: Create New Project`
- `RN: Install UI Library`
- `RN: Run Script`
- `RN: Generate Component`
- `RN: Generate Screen`
- `RN: Open Dashboard`

### From Explorer Context Menu
Right-click any folder:
- `RN: Generate Component` — creates component in that folder
- `RN: Generate Screen` — creates screen in that folder

---

## Project Detection
The extension auto-detects:
- **Project type**: Expo vs RN CLI (from `package.json` dependencies)
- **Package manager**: npm / yarn / bun (from lockfile presence)
- **Scripts**: All entries from `package.json`

---

## Extension Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode
npm run watch

# Press F5 in VS Code to launch Extension Development Host
```

### Project Structure
```
src/
  extension.ts        ← main activation, command registration
  dashboardPanel.ts   ← webview HTML for sidebar panel
  uiLibraries.ts      ← UI library definitions + setup steps
  projectScaffold.ts  ← project template definitions + creation
  generators.ts       ← component & screen file generators
resources/
  rn-icon.svg         ← activity bar icon
```

---

## Configuration

| Setting | Default | Description |
|---|---|---|
| `rnManager.packageManager` | `npm` | Preferred package manager |
| `rnManager.defaultProjectType` | `expo` | Default project type |

---

## Requirements
- Node.js 18+
- For RN CLI projects: Android Studio / Xcode installed
- For Expo: `expo-cli` or `npx expo` available
