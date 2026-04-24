import * as vscode from "vscode";
import type { CourseData } from "./course-types";
import type { CourseProgress } from "./progress-state";
import { webviewStyles } from "./webview-styles";

export function createDashboardHtml(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  courseData: CourseData,
  progress: CourseProgress
): string {
  const nonce = getNonce();
  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "dist", "webview-app.js"));

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
<style nonce="${nonce}">${webviewStyles}</style>
</head>
<body>
<div id="app"></div>
<script nonce="${nonce}" id="course-data" type="application/json">${escapeJsonForHtml(courseData)}</script>
<script nonce="${nonce}" id="progress-data" type="application/json">${escapeJsonForHtml(progress)}</script>
<script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}

function escapeJsonForHtml(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

function getNonce(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let nonce = "";
  for (let i = 0; i < 32; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}
