import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { getDashboardHtml } from "./dashboardPanel";
import { UI_LIBRARIES, getLibraryForId, getInstallCommand, SetupStep } from "./uiLibraries";
import {
  createProject,
  detectProjectType,
  getPackageManager,
  getScripts,
  PackageManager,
  ProjectType,
} from "./projectScaffold";
import { generateComponent, generateScreen } from "./generators";

let dashboardPanel: vscode.WebviewPanel | undefined;
let terminal: vscode.Terminal | undefined;

function getOrCreateTerminal(): vscode.Terminal {
  if (!terminal || terminal.exitStatus !== undefined) {
    terminal = vscode.window.createTerminal("RN Manager");
  }
  return terminal;
}

function getWorkspaceRoot(): string | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

function getWorkspaceInfo() {
  const root = getWorkspaceRoot();
  if (!root) {
    return { projectType: "unknown", packageManager: "npm", scripts: {}, hasRN: false };
  }
  return {
    projectType: detectProjectType(root),
    packageManager: getPackageManager(root),
    scripts: getScripts(root),
    hasRN: detectProjectType(root) !== "unknown",
  };
}

function openOrRevealDashboard(context: vscode.ExtensionContext) {
  if (dashboardPanel) {
    dashboardPanel.reveal();
    return;
  }

  dashboardPanel = vscode.window.createWebviewPanel(
    "rnManager.dashboard",
    "RN Manager",
    vscode.ViewColumn.One,
    { enableScripts: true, retainContextWhenHidden: true }
  );

  const info = getWorkspaceInfo();
  dashboardPanel.webview.html = getDashboardHtml(
    dashboardPanel.webview,
    context.extensionUri,
    info
  );

  dashboardPanel.webview.onDidReceiveMessage(
    async (message) => {
      const term = getOrCreateTerminal();
      const root = getWorkspaceRoot();

      switch (message.command) {
        case "createProject": {
          const folder = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            canSelectFiles: false,
            openLabel: "Select Project Parent Folder",
          });
          if (!folder?.[0]) return;
          await createProject(
            {
              type: message.type as ProjectType,
              name: message.name,
              targetDir: folder[0].fsPath,
              packageManager: message.packageManager as PackageManager,
            },
            term
          );
          vscode.window.showInformationMessage(
            `✅ Creating ${message.name} with template: ${message.type}`
          );
          break;
        }

        case "installLib": {
          if (!root) {
            vscode.window.showErrorMessage("❌ Open a React Native project first.");
            return;
          }
          const lib = getLibraryForId(message.libId);
          if (!lib) {
            vscode.window.showErrorMessage("❌ Library not found.");
            return;
          }

          const pm = getPackageManager(root) as PackageManager;
          const installCmd = getInstallCommand(pm, lib.npmPackages);

          term.show();
          term.sendText(`cd "${root}"`);
          term.sendText(installCmd);

          // Show setup steps in notification
          const steps = lib.setupSteps.map((s: SetupStep, i: number) => `${i + 1}. ${s.label}`).join("\n");
          const action = await vscode.window.showInformationMessage(
            `📦 ${lib.name}\n\nRunning install command...\n\nSetup steps:\n${steps}`,
            "View Full Setup",
            "Dismiss"
          );
          if (action === "View Full Setup") {
            showSetupDoc(lib);
          }
          break;
        }

        case "runScript": {
          if (!root) {
            vscode.window.showErrorMessage("❌ Open a React Native project first.");
            return;
          }
          const pm = getPackageManager(root) as PackageManager;
          let scriptCmd = "";
          if (pm === "yarn") {
            scriptCmd = `yarn ${message.scriptName}`;
          } else if (pm === "bun") {
            scriptCmd = `bun run ${message.scriptName}`;
          } else {
            scriptCmd = `npm run ${message.scriptName}`;
          }
          
          term.show();
          term.sendText(`cd "${root}"`);
          term.sendText(scriptCmd);
          break;
        }

        case "runCmd": {
          if (root) term.sendText(`cd "${root}"`);
          term.show();
          term.sendText(message.cmd);
          break;
        }

        case "generateComponent": {
          if (!root) {
            vscode.window.showErrorMessage("❌ Open a React Native project first.");
            return;
          }
          const folder = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            canSelectFiles: false,
            openLabel: "Select Target Folder",
            defaultUri: vscode.Uri.file(root),
          });
          if (!folder?.[0]) return;

          try {
            const filepath = generateComponent({
              name: message.name,
              targetDir: folder[0].fsPath,
              style: message.style,
              typescript: fs.existsSync(path.join(root, "tsconfig.json")),
            });

            const doc = await vscode.workspace.openTextDocument(filepath);
            vscode.window.showTextDocument(doc);
            vscode.window.showInformationMessage(`✅ Component created: ${path.basename(filepath)}`);
          } catch (err) {
            vscode.window.showErrorMessage(`❌ Failed to create component: ${err}`);
          }
          break;
        }

        case "generateScreen": {
          if (!root) {
            vscode.window.showErrorMessage("❌ Open a React Native project first.");
            return;
          }
          const folder = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            canSelectFiles: false,
            openLabel: "Select Target Folder",
            defaultUri: vscode.Uri.file(root),
          });
          if (!folder?.[0]) return;

          try {
            const filepath = generateScreen({
              name: message.name,
              targetDir: folder[0].fsPath,
              style: message.style,
              typescript: fs.existsSync(path.join(root, "tsconfig.json")),
            });

            const doc = await vscode.workspace.openTextDocument(filepath);
            vscode.window.showTextDocument(doc);
            vscode.window.showInformationMessage(`✅ Screen created: ${path.basename(filepath)}`);
          } catch (err) {
            vscode.window.showErrorMessage(`❌ Failed to create screen: ${err}`);
          }
          break;
        }
      }
    },
    undefined,
    context.subscriptions
  );

  dashboardPanel.onDidDispose(() => {
    dashboardPanel = undefined;
  });
}

function showSetupDoc(lib: (typeof UI_LIBRARIES)[0]) {
  const content = lib.setupSteps
    .map((step, i) => {
      let block = `## Step ${i + 1}: ${step.label}\n\n`;
      if (step.type === "install") {
        block += `\`\`\`bash\nnpm install ${step.content}\n\`\`\`\n`;
      } else if (step.type === "code") {
        block += `**File:** \`${step.filename || "unknown"}\`\n\n\`\`\`tsx\n${step.content}\n\`\`\`\n`;
      } else if (step.type === "info") {
        block += `> ℹ️ ${step.content}\n`;
      } else {
        block += `${step.content}\n`;
      }
      return block;
    })
    .join("\n---\n\n");

  const fullDoc = `# ${lib.name} Setup Guide\n\n> ${lib.description}\n\n📖 Docs: ${lib.docsUrl}\n\n---\n\n${content}`;

  vscode.workspace
    .openTextDocument({ language: "markdown", content: fullDoc })
    .then((doc) => vscode.window.showTextDocument(doc));
}

// ── Context menu command: Generate Component ──
async function cmdGenerateComponent(uri?: vscode.Uri) {
  const root = getWorkspaceRoot();
  if (!root) {
    vscode.window.showErrorMessage("❌ Open a React Native project first.");
    return;
  }

  const name = await vscode.window.showInputBox({ prompt: "Component name", placeHolder: "MyButton", validateInput: (v) => !v.trim() ? "Name required" : "" });
  if (!name) return;

  const styleChoice = await vscode.window.showQuickPick(
    [
      { label: "Functional", value: "functional" },
      { label: "Memo", value: "memo" },
      { label: "With StyleSheet", value: "with-styles" },
      { label: "With NativeWind", value: "with-nativewind" },
    ],
    { placeHolder: "Component style" }
  );
  if (!styleChoice) return;

  const targetDir = uri?.fsPath || root;
  try {
    const filepath = generateComponent({
      name, targetDir, style: styleChoice.value as any,
      typescript: fs.existsSync(path.join(root, "tsconfig.json")),
    });

    const doc = await vscode.workspace.openTextDocument(filepath);
    vscode.window.showTextDocument(doc);
    vscode.window.showInformationMessage(`✅ ${path.basename(filepath)} created`);
  } catch (err) {
    vscode.window.showErrorMessage(`❌ Failed to create component: ${err}`);
  }
}

// ── Context menu command: Generate Screen ──
async function cmdGenerateScreen(uri?: vscode.Uri) {
  const root = getWorkspaceRoot();
  if (!root) {
    vscode.window.showErrorMessage("❌ Open a React Native project first.");
    return;
  }

  const name = await vscode.window.showInputBox({ prompt: "Screen name", placeHolder: "HomeScreen", validateInput: (v) => !v.trim() ? "Name required" : "" });
  if (!name) return;

  const styleChoice = await vscode.window.showQuickPick(
    [
      { label: "Basic", value: "basic" },
      { label: "With Header Config", value: "with-header" },
      { label: "Scrollable", value: "scrollable" },
      { label: "With Safe Area", value: "with-safe-area" },
    ],
    { placeHolder: "Screen template" }
  );
  if (!styleChoice) return;

  const targetDir = uri?.fsPath || root;
  try {
    const filepath = generateScreen({
      name, targetDir, style: styleChoice.value as any,
      typescript: fs.existsSync(path.join(root, "tsconfig.json")),
    });

    const doc = await vscode.workspace.openTextDocument(filepath);
    vscode.window.showTextDocument(doc);
    vscode.window.showInformationMessage(`✅ ${path.basename(filepath)} created`);
  } catch (err) {
    vscode.window.showErrorMessage(`❌ Failed to create screen: ${err}`);
  }
}

// ── Activate ──
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("rnManager.openDashboard", () =>
      openOrRevealDashboard(context)
    ),
    vscode.commands.registerCommand("rnManager.createProject", async () => {
      openOrRevealDashboard(context);
    }),
    vscode.commands.registerCommand("rnManager.installUILibrary", async () => {
      const root = getWorkspaceRoot();
      if (!root) {
        vscode.window.showErrorMessage("❌ Open a React Native project first.");
        return;
      }
      const pick = await vscode.window.showQuickPick(
        UI_LIBRARIES.map((l) => ({ label: l.name, description: l.description, id: l.id })),
        { placeHolder: "Select UI Library to install" }
      );
      if (!pick) return;
      const lib = getLibraryForId((pick as any).id);
      if (!lib) return;
      
      const term = getOrCreateTerminal();
      const pm = getPackageManager(root) as PackageManager;
      const cmd = getInstallCommand(pm, lib.npmPackages);
      term.show();
      term.sendText(`cd "${root}"`);
      term.sendText(cmd);
      
      const action = await vscode.window.showInformationMessage(
        `📦 Installing ${lib.name}...`,
        "View Setup Guide",
        "Dismiss"
      );
      if (action === "View Setup Guide") {
        showSetupDoc(lib);
      }
    }),
    vscode.commands.registerCommand("rnManager.runScript", async () => {
      const root = getWorkspaceRoot();
      if (!root) {
        vscode.window.showErrorMessage("❌ Open a React Native project first.");
        return;
      }
      const scripts = getScripts(root);
      const entries = Object.entries(scripts);
      if (!entries.length) {
        vscode.window.showErrorMessage("❌ No scripts found in package.json");
        return;
      }
      const pick = await vscode.window.showQuickPick(
        entries.map(([name, cmd]) => ({ label: name, description: cmd as string })),
        { placeHolder: "Select script to run" }
      );
      if (!pick) return;
      const term = getOrCreateTerminal();
      const pm = getPackageManager(root) as PackageManager;
      let runCmd = "";
      if (pm === "yarn") {
        runCmd = `yarn ${pick.label}`;
      } else if (pm === "bun") {
        runCmd = `bun run ${pick.label}`;
      } else {
        runCmd = `npm run ${pick.label}`;
      }
      term.show();
      term.sendText(`cd "${root}"`);
      term.sendText(runCmd);
    }),
    vscode.commands.registerCommand("rnManager.generateComponent", cmdGenerateComponent),
    vscode.commands.registerCommand("rnManager.generateScreen", cmdGenerateScreen)
  );

  // Register the sidebar webview
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("rnManager.dashboard", {
      resolveWebviewView(webviewView) {
        webviewView.webview.options = { enableScripts: true };
        const info = getWorkspaceInfo();
        webviewView.webview.html = getDashboardHtml(
          webviewView.webview,
          context.extensionUri,
          info
        );

        webviewView.webview.onDidReceiveMessage(async (msg) => {
          const term = getOrCreateTerminal();
          const root = getWorkspaceRoot();
          
          if (msg.command === "runCmd") {
            if (root) term.sendText(`cd "${root}"`);
            term.show();
            term.sendText(msg.cmd);
          }
          
          if (msg.command === "runScript" && root) {
            const pm = getPackageManager(root) as PackageManager;
            let scriptCmd = "";
            if (pm === "yarn") {
              scriptCmd = `yarn ${msg.scriptName}`;
            } else if (pm === "bun") {
              scriptCmd = `bun run ${msg.scriptName}`;
            } else {
              scriptCmd = `npm run ${msg.scriptName}`;
            }
            term.show();
            term.sendText(`cd "${root}"`);
            term.sendText(scriptCmd);
          }
          
          if (msg.command === "installLib" && root) {
            const lib = getLibraryForId(msg.libId);
            if (!lib) {
              vscode.window.showErrorMessage("❌ Library not found.");
              return;
            }
            const pm = getPackageManager(root) as PackageManager;
            const cmd = getInstallCommand(pm, lib.npmPackages);
            term.show();
            term.sendText(`cd "${root}"`);
            term.sendText(cmd);
            showSetupDoc(lib);
          }
        });
      },
    })
  );
}

export function deactivate() {
  terminal?.dispose();
}
