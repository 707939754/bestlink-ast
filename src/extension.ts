// 全局注册vscode
import * as vscode from "vscode";
import createYapi from "./yapi";

/**
 * 插件激活
 * @param context
 */
export function activate(context: vscode.ExtensionContext) {
  console.log("数字平台研发部开发工具包");
  // TODO 获取已生成的代码的树数据

  // 默认命令
  let disposable = vscode.commands.registerCommand(
    "bestlink-ast.createApiByYapi",
    () => {
      createYapi();
    }
  );
  context.subscriptions.push(disposable);
}

/**
 * 插件卸载
 */
export function deactivate() {}
