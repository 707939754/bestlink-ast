import * as vscode from "vscode";
import { isUrl } from "../utils";

async function createYapi() {
  // 显示输入框
  let url = await showInputBox();
  if (!url) {
    vscode.window.showInformationMessage("链接地址为空, 不执行任何操作");
    return;
  }
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
        return isUrl(str) ? null : "不符合链接规范";
      },
    })
    .then((msg) => {
      res = msg || "";
    });

  return res;
}

export default createYapi;
