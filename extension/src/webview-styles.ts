const progressWidthStyles = Array.from({ length: 101 }, (_, pct) => `.pct-${pct} { width: ${pct}%; }`).join("\n");

export const webviewStyles = `
:root {
  --bg: var(--vscode-sideBar-background, var(--vscode-editor-background));
  --fg: var(--vscode-sideBar-foreground, var(--vscode-editor-foreground));
  --muted: var(--vscode-descriptionForeground);
  --border: var(--vscode-sideBarSectionHeader-border, var(--vscode-widget-border, rgba(128,128,128,0.15)));
  --card: var(--vscode-sideBar-background, var(--bg));
  --accent: var(--vscode-textLink-foreground, #007acc);
  --hover: var(--vscode-list-hoverBackground, rgba(128,128,128,0.08));
  --active: var(--vscode-list-activeSelectionBackground, rgba(128,128,128,0.15));
  --badge-bg: var(--vscode-badge-background);
  --badge-fg: var(--vscode-badge-foreground);
  --success: var(--vscode-testing-iconPassed, #22c55e);
  --input-bg: var(--vscode-input-background);
  --input-border: var(--vscode-input-border, var(--border));
  --button-bg: var(--vscode-button-background);
  --button-fg: var(--vscode-button-foreground);
  --button-hover: var(--vscode-button-hoverBackground);
  --section-header: var(--vscode-sideBarSectionHeader-background, transparent);
}
* { margin: 0; padding: 0; box-sizing: border-box; }
html { overflow-y: scroll; }
body { font-family: var(--vscode-font-family); font-size: var(--vscode-font-size, 13px); color: var(--fg); background: var(--bg); line-height: 1.4; }
button { font-family: inherit; font-size: inherit; cursor: pointer; border: none; background: none; color: inherit; }
.header { padding: 12px 20px 10px; background: var(--section-header); border-bottom: 1px solid var(--border); }
.header h1 { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1px; }
.header p { font-size: 11px; color: var(--muted); font-weight: 400; }
.intro { padding: 10px 12px; border-bottom: 1px solid var(--border); }
.intro p { font-size: 12px; color: var(--muted); line-height: 1.5; margin: 0 0 6px 0; }
.intro p:last-child { margin-bottom: 0; }
.intro strong { color: var(--vscode-foreground); font-weight: 500; }
.intro-toggle { background: none; border: none; color: var(--muted); font-size: 11px; cursor: pointer; padding: 4px 0; text-decoration: underline; }
.intro-toggle:hover { color: var(--vscode-foreground); }
.stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; padding: 10px 12px; }
.stat { background: var(--input-bg); border: 1px solid var(--input-border); border-radius: 3px; padding: 6px 8px; }
.stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.3px; color: var(--muted); margin-bottom: 1px; }
.stat-value { font-size: 16px; font-weight: 600; }
.stat-value span { font-size: 11px; font-weight: 400; color: var(--muted); }
.week-list { padding: 4px 0; }
.week-row { border-bottom: 1px solid var(--border); }
.week-row:last-child { border-bottom: none; }
.week-header { display: flex; align-items: stretch; gap: 8px; padding: 8px 12px; cursor: pointer; width: 100%; text-align: left; }
.week-header:hover { background: var(--hover); }
.week-num { width: 24px; height: 24px; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; color: white; flex-shrink: 0; align-self: flex-start; }
.week-info { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: space-between; }
.week-title { font-weight: 400; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1; }
.week-progress { display: flex; align-items: center; gap: 6px; }
.progress-bar { flex: 1; height: 2px; border-radius: 1px; background: var(--border); overflow: hidden; }
.progress-fill { height: 100%; border-radius: 1px; transition: width 0.3s; }
.week-pct { font-size: 10px; color: var(--muted); min-width: 28px; text-align: right; font-variant-numeric: tabular-nums; }
.chevron { color: var(--muted); font-size: 10px; flex-shrink: 0; width: 16px; text-align: center; }
.badge { font-size: 10px; padding: 0px 5px; border-radius: 3px; background: var(--input-bg); color: var(--muted); white-space: nowrap; border: 1px solid var(--input-border); }
.phase-badge.phase-foundations { border-color: #f59e0b; color: #f59e0b; }
.phase-badge.phase-typescript { border-color: #3b82f6; color: #3b82f6; }
.phase-badge.phase-react { border-color: #06b6d4; color: #06b6d4; }
.phase-badge.phase-next { border-color: #7c3aed; color: #7c3aed; }
.phase-badge.phase-tailwind { border-color: #ec4899; color: #ec4899; }
.phase-badge.phase-ai { border-color: #10b981; color: #10b981; }
.phase-badge.phase-portfolio { border-color: #f97316; color: #f97316; }
.phase-badge.phase-default { border-color: #888; color: #888; }
.week-num.phase-foundations, .hour-icon.phase-foundations, .progress-fill.phase-foundations { background: #f59e0b; }
.week-num.phase-typescript, .hour-icon.phase-typescript, .progress-fill.phase-typescript { background: #3b82f6; }
.week-num.phase-react, .hour-icon.phase-react, .progress-fill.phase-react { background: #06b6d4; }
.week-num.phase-next, .hour-icon.phase-next, .progress-fill.phase-next { background: #7c3aed; }
.week-num.phase-tailwind, .hour-icon.phase-tailwind, .progress-fill.phase-tailwind { background: #ec4899; }
.week-num.phase-ai, .hour-icon.phase-ai, .progress-fill.phase-ai { background: #10b981; }
.week-num.phase-portfolio, .hour-icon.phase-portfolio, .progress-fill.phase-portfolio { background: #f97316; }
.week-num.phase-default, .hour-icon.phase-default, .progress-fill.phase-default { background: #888; }
.day-list { padding: 2px 0 4px; }
.day-row { display: flex; align-items: center; gap: 6px; padding: 4px 12px 4px 20px; cursor: pointer; width: 100%; text-align: left; }
.day-row:hover { background: var(--hover); }
.day-indicator { width: 18px; height: 18px; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 600; flex-shrink: 0; }
.day-indicator.done { background: var(--success); color: white; }
.day-indicator.partial { background: var(--accent); color: white; }
.day-indicator.empty { background: var(--input-bg); color: var(--muted); border: 1px solid var(--input-border); }
.day-name { font-size: 12px; color: var(--muted); width: 65px; flex-shrink: 0; }
.day-title { font-size: 12px; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dots { display: flex; gap: 2px; flex-shrink: 0; }
.dot { width: 3px; height: 3px; border-radius: 50%; }
.dot.filled { background: var(--success); }
.dot.empty { background: var(--border); }
.day-detail { padding: 12px; }
.back-btn { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; color: var(--accent); padding: 2px 0; margin-bottom: 10px; }
.back-btn:hover { text-decoration: underline; }
.day-badges { display: flex; gap: 4px; margin-bottom: 6px; flex-wrap: wrap; }
.day-detail h2 { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.day-focus { font-size: 12px; color: var(--muted); margin-bottom: 3px; line-height: 1.4; }
.day-build { font-size: 12px; margin-bottom: 3px; }
.day-build strong { font-weight: 600; }
.lesson-meta { display: grid; grid-template-columns: 84px minmax(0, 1fr); align-items: center; gap: 8px; margin: -2px 0 12px; padding: 4px 0 6px; border-bottom: 1px solid var(--border); }
.meta-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; color: var(--muted); font-weight: 600; }
.work-folder { display: grid; grid-template-columns: 28px 1px minmax(0, 1fr); align-items: center; min-width: 0; background: var(--input-bg); border: 1px solid var(--input-border); border-radius: 3px; font-size: 11px; color: var(--muted); font-family: var(--vscode-editor-font-family); overflow: hidden; }
.folder-divider { width: 1px; height: 100%; background: var(--input-border); }
.folder-path { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.folder-path { padding: 4px 7px; }
.prepare-icon-btn { display: flex; align-items: center; justify-content: center; width: 28px; min-height: 26px; background: transparent; color: var(--fg); border: 0; font-size: 14px; line-height: 1; font-weight: 600; }
.prepare-icon-btn:hover { background: var(--hover); }
.actions { display: grid; grid-template-columns: minmax(0, 2fr) minmax(96px, 1fr); gap: 6px; margin: 12px 0; }
.copy-btn { display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 7px; border-radius: 3px; background: var(--button-bg); color: var(--button-fg); font-weight: 400; font-size: 12px; min-height: 32px; }
.copy-btn:hover { background: var(--button-hover); }
.deep-btn { white-space: nowrap; background: var(--input-bg); color: var(--fg); border: 1px solid var(--border); }
.deep-btn:hover { background: var(--hover); }
.section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; color: var(--muted); margin: 12px 0 6px; font-weight: 600; padding: 4px 0; border-bottom: 1px solid var(--border); }
.hour-card, .session-card { border: 1px solid var(--border); border-radius: 3px; padding: 8px 10px; margin-bottom: 4px; }
.hour-top { display: grid; grid-template-columns: 22px minmax(0, 1fr) 42px; align-items: start; gap: 6px; }
.hour-icon { width: 22px; height: 22px; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; color: white; }
.hour-title, .session-title { font-weight: 600; font-size: 12px; }
.hour-title { min-width: 0; line-height: 1.35; }
.hour-duration { font-size: 10px; color: var(--muted); justify-self: end; line-height: 1.35; text-align: right; }
.session-dur { font-size: 10px; color: var(--muted); margin-left: 4px; }
.hour-topics { margin-top: 4px; padding-left: 28px; }
.hour-topics li { font-size: 11px; color: var(--muted); margin-bottom: 1px; list-style: disc; }
.session-desc { font-size: 11px; color: var(--muted); margin-top: 3px; }
.recap-row { display: flex; gap: 6px; font-size: 11px; margin-bottom: 3px; }
.recap-day { color: var(--muted); width: 65px; flex-shrink: 0; font-weight: 500; }
.recap-text { color: var(--muted); flex: 1; }
.checklist-section { border: 1px solid var(--border); border-radius: 3px; padding: 10px; margin-top: 10px; }
.checklist-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.checklist-title { margin: 0; }
.checklist-header-actions { display: flex; align-items: center; gap: 8px; }
.checklist-count { font-size: 11px; color: var(--muted); font-variant-numeric: tabular-nums; }
.check-item { display: flex; align-items: flex-start; gap: 6px; padding: 3px 0; cursor: pointer; width: 100%; text-align: left; }
.check-item:hover { opacity: 0.85; }
.check-box { width: 14px; height: 14px; border: 1px solid var(--input-border); border-radius: 3px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; margin-top: 1px; font-size: 10px; }
.check-box.checked { background: var(--success); border-color: var(--success); color: white; }
.check-text { font-size: 12px; line-height: 1.4; }
.check-text.done { color: var(--muted); text-decoration: line-through; }
.reset-btn { font-size: 10px; color: var(--muted); padding: 1px 6px; border: 1px solid var(--border); border-radius: 3px; }
.reset-btn:hover { color: var(--fg); border-color: var(--fg); }
.lesson-nav { display: flex; justify-content: space-between; margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border); }
${progressWidthStyles}
`;
