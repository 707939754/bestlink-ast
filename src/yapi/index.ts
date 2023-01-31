import * as vscode from "vscode";
import { isUrl } from "../utils";
import { ResponseData } from "./interface";
import { getDataByApi } from "./api-data";

async function createYapi() {
  // 显示输入框
  let url = await showInputBox();
  if (!url) {
    return;
  }
  const id = url.split("api/")[1];
  const data = getDataByApi(id);
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
export default createYapi;
