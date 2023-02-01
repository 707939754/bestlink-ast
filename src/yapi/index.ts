import * as vscode from "vscode";
import * as _ from "lodash";
import { isUrl } from "../utils";
import { ResponseData } from "./interface";
import { getDataByApi } from "./api-data";
import DataToTypescript from "./data-code";

async function createYapi() {
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
  console.log(data);
  const dataCode = new DataToTypescript(data); // 执行代码生成
  dataCode.outFile();
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
