import * as vscode from "vscode";
import { loadCourseData } from "./course-data";
import type { CourseData } from "./course-types";
import { CourseProgressStore } from "./progress-store";
import { createDashboardHtml } from "./webview-html";
import { WorkspaceService } from "./workspace-service";

type WebviewMessage =
  | { type: "saveProgress"; key?: unknown; value?: unknown }
  | { type: "copyToClipboard"; text?: unknown }
  | { type: "prepareWorkspace"; workFolder?: unknown };

let courseData: CourseData;
let dashboardProvider: CourseDashboardProvider | undefined;

export function activate(context: vscode.ExtensionContext) {
  courseData = loadCourseData(context.extensionPath);

  const provider = new CourseDashboardProvider(context);
  dashboardProvider = provider;
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("frontendCourse.dashboard", provider),
    vscode.commands.registerCommand("frontendCourse.openLesson", () => {
      vscode.commands.executeCommand("frontendCourse.dashboard.focus");
    })
  );
}

class CourseDashboardProvider implements vscode.WebviewViewProvider {
  private readonly progressStore: CourseProgressStore;
  private readonly workspaceService: WorkspaceService;

  constructor(private readonly context: vscode.ExtensionContext) {
    this.progressStore = new CourseProgressStore(context, courseData);
    this.workspaceService = new WorkspaceService(courseData);
  }

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, "dist")],
    };

    webviewView.webview.html = createDashboardHtml(
      webviewView.webview,
      this.context.extensionUri,
      courseData,
      this.progressStore.load()
    );

    webviewView.webview.onDidReceiveMessage((msg: WebviewMessage) => {
      switch (msg.type) {
        case "saveProgress":
          this.progressStore.queueSave(msg.key, msg.value);
          break;
        case "copyToClipboard":
          if (typeof msg.text === "string") {
            void vscode.env.clipboard.writeText(msg.text);
            vscode.window.showInformationMessage("Prompt copied to clipboard!");
          }
          break;
        case "prepareWorkspace":
          void this.workspaceService.prepareWorkspace(msg.workFolder);
          break;
      }
    });
  }

  flushProgressSaves(): Promise<void> {
    return this.progressStore.flush();
  }
}

export function deactivate(): Promise<void> | undefined {
  return dashboardProvider?.flushProgressSaves();
}
