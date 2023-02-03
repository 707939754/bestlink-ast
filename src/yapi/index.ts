import * as vscode from "vscode";
import * as _ from "lodash";
import { isUrl } from "../utils";
import { getDataByApi } from "./api-data";
import DataToTypescript from "./data-code";
import { TreeItemLabel } from "vscode";
import { YAPICACHE } from "../config/.env";
import { mkdirsSync, pathExistsSync, unlink } from "fs-extra";
import GetYapiDir from "./yapi-dir";

export async function createYapi() {
  // 显示输入框
  let url = await showInputBox();
  if (!url) {
    return;
  }
  // 接口ID
  const id = _.last(_.split(url, "api/"));
  if (!id) {
    return;
  }
  const data = await getDataByApi(id);
  const dataCode = new DataToTypescript(data); // 执行代码生成
  dataCode.outFile();
}

/**
 * 删除已完成的文件
 */
export function deleteYapi(fileName: string | TreeItemLabel | undefined) {
  if (_.isEmpty(fileName)) {
    vscode.window.showErrorMessage("文件不存在");
    return;
  }
  const filePath = YAPICACHE + fileName;
  const pathExist = pathExistsSync(filePath);
  if (!pathExist) {
    vscode.window.showErrorMessage("文件不存在");
    return;
  }
  unlink(filePath).then((res) => {
    vscode.window.registerTreeDataProvider(
      "toolkit.views.project",
      new GetYapiDir()
    );
  });
}

/**
 * 获取yapi的地址
 */
async function showInputBox() {
  let res = "";
  await vscode.window
    .showInputBox({
      value: "",
      valueSelection: [0, 0],
      placeHolder: "请输入YAPI的接口地址",
      prompt: "需符合链接规范 ",
      validateInput: (str) => {
        return isUrl(str) ? null : "请输入正确的YAPI链接";
      },
    })
    .then((msg) => {
      res = msg || "";
    });

  return res;
}
