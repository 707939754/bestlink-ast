// 全局注册vscode
import * as vscode from "vscode";
import { createYapi, deleteYapi } from "./yapi";
import GetYapiDir from "./yapi/yapi-dir";
import { YAPICACHE } from "./config/.env";
import { DataItem } from "./yapi/yapi-dir";
/**
 * 插件激活
 * @param context
 */
export function activate(context: vscode.ExtensionContext) {
  console.log("数字平台研发部开发工具包");

  // 生成代码文件
  let disposable = vscode.commands.registerCommand(
    "bestlink-ast.createApiByYapi",
    () => {
      createYapi();
    }
  );
  context.subscriptions.push(disposable);

  // 删除代码文件
  let deleteYapiCode = vscode.commands.registerCommand(
    "bestlink-ast.deleteYapiCode",
    (file: DataItem) => {
      deleteYapi(file.label);
    }
  );
  context.subscriptions.push(deleteYapiCode);

  // 获取生成代码的文件
  vscode.window.registerTreeDataProvider(
    "toolkit.views.project",
    new GetYapiDir()
  );

  // 代码文件点击命令
  let showFile = vscode.commands.registerCommand(
    "YapiCodeFile.itemClick",
    (name: string) => {
      // 主动打开已生成的文件
      vscode.workspace.openTextDocument(YAPICACHE + name).then((document) => {
        vscode.window.showTextDocument(document);
      });
    }
  );
  context.subscriptions.push(showFile);
}

/**
 * 插件卸载
 */
export function deactivate() {}
