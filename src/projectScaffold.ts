import * as vscode from "vscode";
import * as path from "path";
import { execSync, spawn } from "child_process";

export type ProjectType = "expo" | "expo-router" | "cli" | "cli-typescript";
export type PackageManager = "npm" | "yarn" | "bun";

export interface CreateProjectOptions {
  type: ProjectType;
  name: string;
  targetDir: string;
  packageManager: PackageManager;
}

export interface ProjectTemplate {
  id: ProjectType;
  label: string;
  description: string;
  icon: string;
  command: (opts: CreateProjectOptions) => string;
  postSteps: string[];
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: "expo",
    label: "Expo (Blank)",
    description: "Managed workflow. Best for most apps. Easy OTA updates.",
    icon: "⚡",
    command: (o) =>
      `npx create-expo-app@latest ${o.name} --template blank-typescript`,
    postSteps: [
      "cd into your project folder",
      "Run: npx expo start",
      "Scan QR with Expo Go or press 'a' for Android / 'i' for iOS simulator",
    ],
  },
  {
    id: "expo-router",
    label: "Expo Router (File-based Navigation)",
    description: "Expo with file-system routing. Best for new projects.",
    icon: "🗂️",
    command: (o) =>
      `npx create-expo-app@latest ${o.name} --template tabs`,
    postSteps: [
      "cd into your project folder",
      "Run: npx expo start",
      "App routing is file-based in the /app directory",
    ],
  },
  {
    id: "cli",
    label: "React Native CLI",
    description: "Bare workflow. Full native control. Requires Xcode/Android Studio.",
    icon: "🛠️",
    command: (o) =>
      `npx @react-native-community/cli@latest init ${o.name} --skip-install`,
    postSteps: [
      "cd into your project folder",
      "Run: npm install",
      "iOS: cd ios && pod install && cd ..",
      "Android: npx react-native run-android",
      "iOS: npx react-native run-ios",
    ],
  },
  {
    id: "cli-typescript",
    label: "React Native CLI + TypeScript",
    description: "Bare workflow with TypeScript template.",
    icon: "🔷",
    command: (o) =>
      `npx @react-native-community/cli@latest init ${o.name} --template react-native-template-typescript --skip-install`,
    postSteps: [
      "cd into your project folder",
      "Run: npm install",
      "iOS: cd ios && pod install && cd ..",
      "Run: npx react-native run-android OR run-ios",
    ],
  },
];

export async function createProject(
  opts: CreateProjectOptions,
  terminal: vscode.Terminal
): Promise<void> {
  const template = PROJECT_TEMPLATES.find((t) => t.id === opts.type);
  if (!template) {
    throw new Error(`Unknown project type: ${opts.type}`);
  }

  // Validate project name
  if (!opts.name || !/^[a-zA-Z0-9_-]+$/.test(opts.name)) {
    throw new Error("Project name must contain only letters, numbers, hyphens, and underscores");
  }

  const cmd = template.command(opts);
  terminal.show();
  terminal.sendText(`cd "${opts.targetDir}"`);
  terminal.sendText(cmd);
  terminal.sendText(`echo ""`);
  terminal.sendText(`echo "✅ Project ${opts.name} created!"`);
  terminal.sendText(`echo ""`);
  for (const step of template.postSteps) {
    terminal.sendText(`echo "  → ${step}"`);
  }
  terminal.sendText(`echo ""`);
  terminal.sendText(`echo "📦 Next steps:"`);
  terminal.sendText(`echo "  1. cd ${opts.name}"`);
  terminal.sendText(`echo "  2. Choose a UI library (RN Manager > Libs tab)"`);
  terminal.sendText(`echo "  3. npm start / expo start"`);
}

export function detectProjectType(workspaceRoot: string): "expo" | "cli" | "unknown" {
  try {
    const pkgPath = path.join(workspaceRoot, "package.json");
    const fs = require("fs");
    if (!fs.existsSync(pkgPath)) return "unknown";
    
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    
    if (deps["expo"]) return "expo";
    if (deps["react-native"]) return "cli";
  } catch (err) {
    console.error("Error detecting project type:", err);
  }
  return "unknown";
}

export function getPackageManager(workspaceRoot: string): PackageManager {
  try {
    const fs = require("fs");
    const bunLock = require("path").join(workspaceRoot, "bun.lockb");
    const yarnLock = require("path").join(workspaceRoot, "yarn.lock");
    const npmLock = require("path").join(workspaceRoot, "package-lock.json");
    
    if (fs.existsSync(bunLock)) return "bun";
    if (fs.existsSync(yarnLock)) return "yarn";
    if (fs.existsSync(npmLock)) return "npm";
    
    // Check for pnpm
    const pnpmLock = require("path").join(workspaceRoot, "pnpm-lock.yaml");
    if (fs.existsSync(pnpmLock)) return "npm"; // Treat pnpm as npm-compatible for now
  } catch {}
  
  return "npm"; // Default to npm
}

export function getScripts(workspaceRoot: string): Record<string, string> {
  try {
    const pkgPath = path.join(workspaceRoot, "package.json");
    const fs = require("fs");
    if (!fs.existsSync(pkgPath)) return {};
    
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    return pkg.scripts || {};
  } catch (err) {
    console.error("Error reading scripts from package.json:", err);
    return {};
  }
}
