// 全局注册vscode
import * as vscode from "vscode";

/**
 * 插件激活
 * @param context
 */
export function activate(context: vscode.ExtensionContext) {
  console.log("激活");

  vscode.window.createInputBox();

  // 默认命令
  let disposable = vscode.commands.registerCommand(
    "bestlink-ast.createYapi",
    () => {
      vscode.window.showInformationMessage("createYapi!");
    }
  );

  context.subscriptions.push(disposable);
}

/**
 * 插件卸载
 */
export function deactivate() {}
