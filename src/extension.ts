// 全局注册vscode
import * as vscode from "vscode";
import createYapi from "./yapi";
import GetYapiDir from "./yapi/yapi-dir";

/**
 * 插件激活
 * @param context
 */
export function activate(context: vscode.ExtensionContext) {
  console.log("数字平台研发部开发工具包");

  // 默认命令
  let disposable = vscode.commands.registerCommand(
    "bestlink-ast.createApiByYapi",
    () => {
      createYapi();
    }
  );
  context.subscriptions.push(disposable);

  // 获取生成代码的文件
  vscode.window.registerTreeDataProvider(
    "toolkit.views.project",
    new GetYapiDir()
  );
}

/**
 * 插件卸载
 */
export function deactivate() {}
