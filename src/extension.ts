// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

/**
 * 当插件被激活时触发
 * @param context
 */
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "bestlink-ast" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  // 调用vscode注册命令API，注册了一个名（命令唯一标识）为TypeScript.helloWorld的命令
  let disposable = vscode.commands.registerCommand(
    "bestlink-ast.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      // 执行命令，会在右下角展示提示信息
      vscode.window.showInformationMessage("Hello World from bestlink-ast!");
    }
  );

  context.subscriptions.push(disposable);
}

/**
 * 当插件停用时触发
 */
export function deactivate() {}
