import { BaseInfo, Request, Response, ResponseData } from "./interface";
import {
  pathExistsSync,
  createFileSync,
  outputFileSync,
  mkdirsSync,
} from "fs-extra";
import { YAPICACHE } from "../config/.env";
import * as prettier from "prettier";
import * as vscode from "vscode";
import * as _ from "lodash";
import {
  getComment,
  getTemplate,
  getInterface,
  getDefaultResult,
  getQueryTemplate,
} from "./template";
import GetYapiDir from "./yapi-dir";

/**
 * 通过数据转换为typescript 字符串
 */
export default class DataToTypescript {
  // 基础信息
  private baseInfo: BaseInfo;
  private remarks: string | undefined;
  private request: Request;
  private response: Response;

  // 产出信息
  private interfaceName: string = "";
  private responseName: string = "";
  private paramName: string = "";
  private functionStr: string;
  private interfaceStr: string;

  // 当前接口传参方式

  constructor(responseData: ResponseData) {
    const { baseInfo, remarks, request, response } = responseData;
    this.baseInfo = baseInfo;
    this.remarks = remarks;
    this.request = request;
    this.response = response;

    this.functionStr = this.getFunction() || "";
    this.interfaceStr = this.getInterface() || "";
  }

  /**
   * 获取接口类型
   */
  getInterface() {
    // 获取请求的接口类型
    let flag = "";
    if (this.paramName === "data") {
      flag = "body";
    } else if (this.paramName === "params") {
      flag = "params";
    } else {
      flag = "query";
    }
    const reqInterface = getInterface(
      "请求的接口类型",
      this.interfaceName,
      _.get(this, "request." + flag)
    );

    // 获取返回的接口类型
    const resInterface = getInterface(
      "返回的接口类型",
      this.responseName,
      this.response
    );

    return getDefaultResult() + " \n " + reqInterface + " \n " + resInterface;
  }

  /**
   * 获取请求方法
   */
  getFunction() {
    if (_.isEmpty(this.baseInfo.url.path)) {
      return;
    }
    // 链接最后单词 用于方法名 & 形参名 & 接口名
    const endWord = _.last(_.split(this.baseInfo.url.path, "/"));

    const detailWord = endWord?.replace("{", "").replace("}", "");
    // 注释
    const commend = getComment(this.baseInfo, this.remarks);
    // 方法名
    const functionName =
      _.toLower(this.baseInfo.url.type) + _.upperFirst(detailWord);
    // 形参名
    this.paramName = this.getParamNameByRequest();
    // 形参接口名
    this.interfaceName = _.upperFirst(detailWord) + "Request";
    // 返回接口名
    this.responseName = _.upperFirst(detailWord) + "Response";

    // 方法str
    if (this.paramName === "data" || this.paramName === "params") {
      return getTemplate({
        commend,
        functionName,
        paramName: this.paramName,
        interfaceName: this.interfaceName,
        actionName: this.baseInfo.url.type,
        responseName: this.responseName,
        url: this.baseInfo.url.path,
      });
    } else {
      return getQueryTemplate({
        commend,
        functionName,
        paramName: this.paramName,
        interfaceName: this.interfaceName,
        actionName: this.baseInfo.url.type,
        responseName: this.responseName,
        url: this.baseInfo.url.path,
        endWord: endWord,
      });
    }
  }

  /**
   * 获取形参名
   */
  getParamNameByRequest() {
    if (
      !_.isEmpty(this.request.body) &&
      _.isEmpty(this.request.params) &&
      _.isEmpty(this.request.query)
    ) {
      return "data";
    } else if (
      _.isEmpty(this.request.body) &&
      !_.isEmpty(this.request.params) &&
      _.isEmpty(this.request.query)
    ) {
      return "params";
    } else {
      return "query";
    }
  }

  /**
   * 格式化字符串代码
   * @param str
   */
  prettyCode(str: string): { result: string; hasErr: boolean } {
    // 格式化美化文件
    let result = "";
    let hasErr = false;
    try {
      result = prettier.format(str, {
        parser: "typescript",
      });
    } catch (error) {
      hasErr = true;
      vscode.window.showErrorMessage("文件格式化失败");
    }
    return { result, hasErr };
  }

  /**
   * 输出文档
   */
  async outFile() {
    const fileName = this.baseInfo.name + ".ts"; // 文件名称
    const filePath = YAPICACHE + fileName; // 文件路径
    const prettierRes = this.prettyCode(
      this.functionStr + "" + this.interfaceStr
    ); // 格式化代码

    try {
      const pathExist = pathExistsSync(YAPICACHE);
      if (!pathExist) {
        mkdirsSync(YAPICACHE);
      }
      // 格式化成功后 再执行创建文件
      if (!prettierRes.hasErr) {
        createFileSync(filePath); // 创建文件
        outputFileSync(filePath, prettierRes.result); // 输入值
        vscode.window.showInformationMessage("生成代码成功：" + fileName);

        // 获取生成代码的文件
        vscode.window.registerTreeDataProvider(
          "toolkit.views.project",
          new GetYapiDir()
        );
        // 主动打开已生成的文件
        vscode.workspace.openTextDocument(filePath).then((document) => {
          vscode.window.showTextDocument(document);
        });
      }
    } catch (err) {
      vscode.window.showErrorMessage("生成文档失败：" + fileName);
    }
  }
}
