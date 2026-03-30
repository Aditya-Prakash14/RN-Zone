# Changelog

All notable changes to the React Native Manager extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-03-30

### Added
- **Project Scaffolding**: Create new RN projects with Expo or bare CLI workflow
  - Expo (Blank)
  - Expo Router (File-based navigation)
  - React Native CLI
  - React Native CLI + TypeScript
- **UI Library Setup**: One-click installation with guided setup for:
  - React Native Paper (Material Design 3)
  - NativeWind (Tailwind CSS)
  - Gluestack UI (Universal)
  - React Native Elements
  - Tamagui (Compile-time optimized)
- **Script Runner**: Execute package.json scripts from sidebar
  - Support for npm, yarn, and bun
  - Quick-run buttons for common Expo/RN CLI commands
- **Code Generator**: Generate components and screens with multiple templates
  - **Components**: Functional, Memo, with StyleSheet, with NativeWind
  - **Screens**: Basic, with header config, scrollable, with safe area
- **Dashboard UI**: Full-featured webview sidebar with 4 tabs
  - Modern dark UI with VSCode theme integration
  - Interactive library cards with setup guides
  - Expandable installation steps

### Features
- Auto-detects project type (Expo vs CLI)
- Detects package manager (npm, yarn, bun)
- TypeScript support with automatic detection
- Context menu integration for quick component/screen generation
- Setup guides in Markdown with code examples
- Full error handling and user feedback

### Technical
- Built with TypeScript
- VS Code 1.85+ compatible
- Compiled JavaScript with source maps
- Zero external dependencies
