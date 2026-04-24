import * as vscode from "vscode";
import type { CourseData } from "./course-types";

export class WorkspaceService {
  constructor(private readonly course: CourseData) {}

  async prepareWorkspace(workFolder: unknown) {
    if (typeof workFolder !== "string" || !this.isKnownWorkFolder(workFolder)) return;

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) return;

    const root = workspaceFolders[0].uri;
    const folderUri = vscode.Uri.joinPath(root, workFolder);

    try {
      await vscode.workspace.fs.stat(folderUri);
    } catch {
      await vscode.workspace.fs.createDirectory(folderUri);
    }
  }

  private isKnownWorkFolder(workFolder: string): boolean {
    return this.course.weeks.some((week) => week.days.some((day) => day.workFolder === workFolder));
  }
}
