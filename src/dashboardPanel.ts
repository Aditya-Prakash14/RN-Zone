import * as vscode from "vscode";
import * as path from "path";
import { UI_LIBRARIES } from "./uiLibraries";
import { PROJECT_TEMPLATES } from "./projectScaffold";

export function getDashboardHtml(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  workspaceInfo: {
    projectType: string;
    packageManager: string;
    scripts: Record<string, string>;
    hasRN: boolean;
  }
): string {
  const libsJson = JSON.stringify(
    UI_LIBRARIES.map((l) => ({
      id: l.id,
      name: l.name,
      description: l.description,
      tags: l.tags,
      expoCompatible: l.expoCompatible,
      cliCompatible: l.cliCompatible,
      docsUrl: l.docsUrl,
    }))
  );

  const templatesJson = JSON.stringify(
    PROJECT_TEMPLATES.map((t) => ({
      id: t.id,
      label: t.label,
      description: t.description,
      icon: t.icon,
    }))
  );

  const scriptsJson = JSON.stringify(workspaceInfo.scripts);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
<title>RN Manager</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@400;600;800&display=swap');

  :root {
    --bg:        var(--vscode-sideBar-background, #0f0f13);
    --surface:   var(--vscode-editor-background, #16161e);
    --surface2:  var(--vscode-editorWidget-background, #1e1e2a);
    --border:    var(--vscode-panel-border, #2a2a3a);
    --accent:    #7c5cfc;
    --accent2:   #00d2b4;
    --accent3:   #ff6b6b;
    --text:      var(--vscode-foreground, #e0e0f0);
    --muted:     var(--vscode-descriptionForeground, #888aaa);
    --success:   #4ecca3;
    --warn:      #ffd166;
    --r:         8px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Syne', sans-serif;
    background: var(--bg);
    color: var(--text);
    font-size: 13px;
    line-height: 1.5;
    min-height: 100vh;
  }

  .mono { font-family: 'JetBrains Mono', monospace; }

  /* ── Tabs ── */
  .tabs {
    display: flex;
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 50;
    background: var(--bg);
    padding: 0 12px;
    gap: 2px;
  }
  .tab {
    padding: 10px 14px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--muted);
    transition: all 0.15s;
    display: flex; align-items: center; gap: 6px;
  }
  .tab:hover { color: var(--text); }
  .tab.active { color: var(--accent); border-bottom-color: var(--accent); }

  /* ── Panels ── */
  .panel { display: none; padding: 16px 12px; }
  .panel.active { display: block; }

  /* ── Status Bar ── */
  .status-bar {
    display: flex; gap: 8px; flex-wrap: wrap;
    margin-bottom: 16px;
  }
  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.03em;
    background: var(--surface2);
    border: 1px solid var(--border);
  }
  .badge.expo   { border-color: #6ab7ff; color: #6ab7ff; }
  .badge.cli    { border-color: #61dafb; color: #61dafb; }
  .badge.npm    { color: #cb3837; border-color: #cb3837; }
  .badge.yarn   { color: #2c8ebb; border-color: #2c8ebb; }
  .badge.bun    { color: #fbf0df; border-color: #fbf0df; }
  .badge.none   { color: var(--muted); }

  /* ── Cards ── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r);
    margin-bottom: 10px;
    overflow: hidden;
    transition: border-color 0.15s;
  }
  .card:hover { border-color: var(--accent); }

  .card-header {
    padding: 12px 14px;
    display: flex; align-items: flex-start; gap: 10px;
    cursor: pointer;
    user-select: none;
  }
  .card-icon {
    font-size: 22px;
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    background: var(--surface2);
    border-radius: 6px;
    flex-shrink: 0;
  }
  .card-meta { flex: 1; min-width: 0; }
  .card-name { font-size: 13px; font-weight: 700; margin-bottom: 3px; }
  .card-desc { font-size: 11px; color: var(--muted); line-height: 1.4; }

  .tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
  .tag {
    font-size: 10px; font-weight: 600;
    padding: 2px 7px; border-radius: 3px;
    background: var(--surface2);
    color: var(--muted);
    letter-spacing: 0.04em;
  }
  .tag.trending { background: rgba(255,107,107,0.15); color: var(--accent3); }
  .tag.popular  { background: rgba(124,92,252,0.15); color: var(--accent); }

  .compat-row {
    display: flex; gap: 6px; margin-top: 8px;
  }
  .compat {
    font-size: 10px; font-weight: 600;
    padding: 2px 8px; border-radius: 3px;
  }
  .compat.yes  { background: rgba(78,204,163,0.15); color: var(--success); }
  .compat.no   { background: rgba(255,107,107,0.1); color: var(--muted); text-decoration: line-through; }

  .chevron { color: var(--muted); font-size: 10px; transition: transform 0.2s; margin-top: 4px; }
  .card.expanded .chevron { transform: rotate(180deg); }

  .card-body {
    display: none;
    border-top: 1px solid var(--border);
    padding: 12px 14px;
  }
  .card.expanded .card-body { display: block; }

  /* ── Steps ── */
  .steps { display: flex; flex-direction: column; gap: 10px; }
  .step { }
  .step-label {
    font-size: 11px; font-weight: 700; color: var(--muted);
    letter-spacing: 0.06em; text-transform: uppercase;
    margin-bottom: 5px;
  }
  .step pre {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 10px 12px;
    font-size: 11px; font-family: 'JetBrains Mono', monospace;
    overflow-x: auto;
    color: #c8d3f5;
    white-space: pre;
  }
  .step-info {
    background: rgba(0,210,180,0.08);
    border: 1px solid rgba(0,210,180,0.2);
    border-radius: 5px;
    padding: 8px 12px;
    font-size: 11px; color: var(--accent2);
  }
  .step-install {
    display: flex; gap: 6px; align-items: center;
  }
  .step-install code {
    flex: 1;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 7px 10px;
    font-size: 11px; font-family: 'JetBrains Mono', monospace;
    color: var(--accent2);
  }

  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px;
    border-radius: 6px; border: none;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.05em; text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s;
    font-family: 'Syne', sans-serif;
  }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: #6a4de8; }
  .btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
  .btn-success { background: rgba(78,204,163,0.15); color: var(--success); border: 1px solid rgba(78,204,163,0.3); }
  .btn-success:hover { background: rgba(78,204,163,0.25); }
  .btn-sm { padding: 5px 10px; font-size: 10px; }

  /* ── Template Grid ── */
  .template-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 14px;
  }
  .template-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r);
    padding: 12px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .template-card:hover { border-color: var(--accent); background: var(--surface2); }
  .template-card.selected { border-color: var(--accent); background: rgba(124,92,252,0.1); }
  .template-card-icon { font-size: 20px; margin-bottom: 6px; }
  .template-card-label { font-size: 12px; font-weight: 700; margin-bottom: 3px; }
  .template-card-desc { font-size: 10px; color: var(--muted); line-height: 1.4; }

  /* ── Input ── */
  .input-row { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
  .input-label { font-size: 11px; font-weight: 700; color: var(--muted); letter-spacing: 0.05em; text-transform: uppercase; }
  input[type=text], select {
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    padding: 8px 10px;
    border-radius: 6px;
    outline: none;
    width: 100%;
    transition: border-color 0.15s;
  }
  input[type=text]:focus, select:focus { border-color: var(--accent); }

  /* ── Script Runner ── */
  .script-grid { display: flex; flex-direction: column; gap: 6px; }
  .script-row {
    display: flex; align-items: center; gap: 8px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r);
    padding: 8px 12px;
  }
  .script-name {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    flex: 1;
    min-width: 0;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .script-cmd {
    font-size: 10px; color: var(--muted);
    font-family: 'JetBrains Mono', monospace;
    flex: 2;
    min-width: 0;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  /* ── Empty state ── */
  .empty {
    text-align: center;
    padding: 32px 16px;
    color: var(--muted);
    font-size: 12px;
  }
  .empty-icon { font-size: 32px; margin-bottom: 8px; }

  /* ── Divider ── */
  .divider { border: none; border-top: 1px solid var(--border); margin: 14px 0; }

  /* ── Section title ── */
  .section-title {
    font-size: 10px; font-weight: 800;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 10px;
    display: flex; align-items: center; gap: 6px;
  }
  .section-title::after {
    content: ''; flex: 1;
    border-top: 1px solid var(--border);
  }
</style>
</head>
<body>

<div class="tabs">
  <div class="tab active" onclick="showTab('create')" id="tab-create">✦ New Project</div>
  <div class="tab" onclick="showTab('libs')"   id="tab-libs">⬡ UI Libs</div>
  <div class="tab" onclick="showTab('scripts')" id="tab-scripts">▶ Scripts</div>
  <div class="tab" onclick="showTab('gen')"    id="tab-gen">⊞ Generate</div>
</div>

<!-- ╔══ TAB: CREATE ══╗ -->
<div class="panel active" id="panel-create">

  <div class="status-bar">
    <span class="badge ${workspaceInfo.projectType !== "unknown" ? workspaceInfo.projectType : "none"}">
      ${workspaceInfo.projectType !== "unknown" ? (workspaceInfo.projectType === "expo" ? "⚡ Expo" : "🛠 RN CLI") : "◌ No RN project"}
    </span>
    <span class="badge ${workspaceInfo.packageManager}">
      📦 ${workspaceInfo.packageManager}
    </span>
  </div>

  <div class="section-title">Choose Template</div>
  <div class="template-grid" id="templateGrid"></div>

  <div class="input-row">
    <label class="input-label">Project Name</label>
    <input type="text" id="projectName" placeholder="MyAwesomeApp" value="MyApp">
  </div>

  <div class="input-row">
    <label class="input-label">Package Manager</label>
    <select id="pkgManager">
      <option value="npm" ${workspaceInfo.packageManager === "npm" ? "selected" : ""}>npm</option>
      <option value="yarn" ${workspaceInfo.packageManager === "yarn" ? "selected" : ""}>yarn</option>
      <option value="bun" ${workspaceInfo.packageManager === "bun" ? "selected" : ""}>bun</option>
    </select>
  </div>

  <button class="btn btn-primary" onclick="createProject()" style="width:100%; justify-content:center;">
    ✦ Create Project
  </button>
</div>

<!-- ╔══ TAB: UI LIBS ══╗ -->
<div class="panel" id="panel-libs">

  <div class="section-title">UI Libraries</div>
  <div id="libList"></div>

</div>

<!-- ╔══ TAB: SCRIPTS ══╗ -->
<div class="panel" id="panel-scripts">

  <div class="section-title">Package Scripts</div>
  <div id="scriptList"></div>

  <hr class="divider">

  <div class="section-title">Quick Run</div>
  <div style="display:flex;gap:8px;flex-wrap:wrap;">
    <button class="btn btn-secondary btn-sm" onclick="runCmd('npx expo start')">⚡ expo start</button>
    <button class="btn btn-secondary btn-sm" onclick="runCmd('npx expo start --android')">🤖 Android</button>
    <button class="btn btn-secondary btn-sm" onclick="runCmd('npx expo start --ios')">🍎 iOS</button>
    <button class="btn btn-secondary btn-sm" onclick="runCmd('npx react-native run-android')">▶ rn android</button>
    <button class="btn btn-secondary btn-sm" onclick="runCmd('npx react-native run-ios')">▶ rn ios</button>
    <button class="btn btn-secondary btn-sm" onclick="runCmd('npx expo install --check')">🔍 check deps</button>
  </div>
</div>

<!-- ╔══ TAB: GENERATE ══╗ -->
<div class="panel" id="panel-gen">

  <div class="section-title">Generate Component</div>

  <div class="input-row">
    <label class="input-label">Name</label>
    <input type="text" id="genName" placeholder="MyButton">
  </div>

  <div class="input-row">
    <label class="input-label">Style</label>
    <select id="genStyle">
      <option value="functional">Functional</option>
      <option value="memo">Memo</option>
      <option value="with-styles">With StyleSheet</option>
      <option value="with-nativewind">With NativeWind</option>
    </select>
  </div>

  <div style="display:flex;gap:8px;margin-bottom:16px;">
    <button class="btn btn-primary btn-sm" onclick="generateComponent()">⊞ Component</button>
    <button class="btn btn-secondary btn-sm" onclick="generateScreen()">⊟ Screen</button>
  </div>

  <div class="section-title">Screen Template</div>
  <div class="input-row">
    <label class="input-label">Screen Style</label>
    <select id="screenStyle">
      <option value="basic">Basic</option>
      <option value="with-header">With Header Config</option>
      <option value="scrollable">Scrollable</option>
      <option value="with-safe-area">Safe Area</option>
    </select>
  </div>

</div>

<script>
  const vscode = acquireVsCodeApi();
  const LIBS = ${libsJson};
  const TEMPLATES = ${templatesJson};
  const SCRIPTS = ${scriptsJson};

  let selectedTemplate = 'expo';

  // ── Tabs ──
  function showTab(id) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tab-' + id).classList.add('active');
    document.getElementById('panel-' + id).classList.add('active');
  }

  // ── Template Cards ──
  function renderTemplates() {
    const g = document.getElementById('templateGrid');
    g.innerHTML = TEMPLATES.map(t => \`
      <div class="template-card \${t.id === selectedTemplate ? 'selected' : ''}"
           id="tmpl-\${t.id}" onclick="selectTemplate('\${t.id}')">
        <div class="template-card-icon">\${t.icon}</div>
        <div class="template-card-label">\${t.label}</div>
        <div class="template-card-desc">\${t.description}</div>
      </div>
    \`).join('');
  }

  function selectTemplate(id) {
    selectedTemplate = id;
    document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
    const el = document.getElementById('tmpl-' + id);
    if (el) el.classList.add('selected');
  }

  // ── UI Libraries ──
  function renderLibs() {
    const el = document.getElementById('libList');
    el.innerHTML = LIBS.map(lib => \`
      <div class="card" id="lib-card-\${lib.id}">
        <div class="card-header" onclick="toggleCard('lib-card-\${lib.id}')">
          <div class="card-icon">📦</div>
          <div class="card-meta">
            <div class="card-name">\${lib.name}</div>
            <div class="card-desc">\${lib.description}</div>
            <div class="tags">
              \${lib.tags.map(t => \`<span class="tag \${t.toLowerCase()}">\${t}</span>\`).join('')}
            </div>
            <div class="compat-row">
              <span class="compat \${lib.expoCompatible ? 'yes' : 'no'}">⚡ Expo</span>
              <span class="compat \${lib.cliCompatible ? 'yes' : 'no'}">🛠 CLI</span>
            </div>
          </div>
          <div class="chevron">▼</div>
        </div>
        <div class="card-body">
          <div style="display:flex;gap:8px;margin-bottom:12px;">
            <button class="btn btn-primary btn-sm" onclick="installLib('\${lib.id}')">
              ⬇ Install
            </button>
            <a href="\${lib.docsUrl}" style="text-decoration:none;">
              <button class="btn btn-secondary btn-sm">📖 Docs</button>
            </a>
          </div>
        </div>
      </div>
    \`).join('');
  }

  function toggleCard(id) {
    const c = document.getElementById(id);
    c.classList.toggle('expanded');
  }

  // ── Scripts ──
  function renderScripts() {
    const el = document.getElementById('scriptList');
    const entries = Object.entries(SCRIPTS);
    if (!entries.length) {
      el.innerHTML = '<div class="empty"><div class="empty-icon">📭</div>No package.json scripts found.<br>Open a React Native project first.</div>';
      return;
    }
    el.innerHTML = '<div class="script-grid">' + entries.map(([name, cmd]) => \`
      <div class="script-row">
        <span class="script-name">\${name}</span>
        <span class="script-cmd mono">\${cmd}</span>
        <button class="btn btn-success btn-sm" onclick="runScript('\${name}')">▶</button>
      </div>
    \`).join('') + '</div>';
  }

  // ── Actions → extension ──
  function createProject() {
    const name = document.getElementById('projectName').value.trim();
    if (!name) { alert('Enter a project name'); return; }
    vscode.postMessage({ command: 'createProject', type: selectedTemplate, name, packageManager: document.getElementById('pkgManager').value });
  }

  function installLib(libId) {
    vscode.postMessage({ command: 'installLib', libId });
  }

  function runScript(name) {
    vscode.postMessage({ command: 'runScript', scriptName: name });
  }

  function runCmd(cmd) {
    vscode.postMessage({ command: 'runCmd', cmd });
  }

  function generateComponent() {
    const name = document.getElementById('genName').value.trim();
    const style = document.getElementById('genStyle').value;
    if (!name) { alert('Enter a component name'); return; }
    vscode.postMessage({ command: 'generateComponent', name, style });
  }

  function generateScreen() {
    const name = document.getElementById('genName').value.trim();
    const style = document.getElementById('screenStyle').value;
    if (!name) { alert('Enter a screen name'); return; }
    vscode.postMessage({ command: 'generateScreen', name, style });
  }

  // ── Init ──
  renderTemplates();
  renderLibs();
  renderScripts();
</script>
</body>
</html>`;
}
