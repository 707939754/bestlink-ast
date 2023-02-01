import { BaseInfo, Request, Response, ResponseData } from "./interface";
import {
  pathExistsSync,
  createFileSync,
  outputFileSync,
  mkdirsSync,
} from "fs-extra";
import { CACHE, PRETTIERCONFIG } from "../config/.env";
import * as prettier from "prettier";
import * as vscode from "vscode";
import * as _ from "lodash";
import { getComment, getTemplate, getInterface } from "./template";
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

    return reqInterface + " \n " + resInterface;
  }

  /**
   * 获取请求方法
   */
  getFunction() {
    if (_.isEmpty(this.baseInfo.url.path)) {
      return;
    }
    // 注释
    const commend = getComment(this.baseInfo, this.remarks);
    // 方法名
    const functionName =
      _.toLower(this.baseInfo.url.type) +
      _.upperFirst(_.last(_.split(this.baseInfo.url.path, "/")));
    // 形参名
    this.paramName = this.getParamNameByRequest();
    // 形参接口名
    this.interfaceName =
      _.upperFirst(_.last(_.split(this.baseInfo.url.path, "/"))) + "Request";
    // 返回接口名
    this.responseName =
      _.upperFirst(_.last(_.split(this.baseInfo.url.path, "/"))) + "Response";

    // 方法str
    const functionStr = getTemplate({
      commend,
      functionName,
      paramName: this.paramName,
      interfaceName: this.interfaceName,
      actionName: this.baseInfo.url.type,
      responseName: this.responseName,
      url: this.baseInfo.url.path,
    });

    return functionStr;
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
  prettyCode(str: string): string {
    // 格式化美化文件
    let result = "";
    try {
      result = prettier.format(str, {
        parser: "typescript",
      });
    } catch (error) {
      vscode.window.showErrorMessage("文件格式化失败");
    }
    return result;
  }

  /**
   * 输出文档
   */
  async outFile() {
    try {
      const pathExist = pathExistsSync(CACHE);
      if (!pathExist) {
        mkdirsSync(CACHE);
      }
      const fileName = this.baseInfo.name + ".ts"; // 文件名称
      const filePath = CACHE + fileName; // 文件路径
      const str = this.prettyCode(this.functionStr + "" + this.interfaceStr); // 格式化代码

      createFileSync(filePath); // 创建文件
      outputFileSync(filePath, str); // 输入值
      vscode.window.showInformationMessage("生成代码成功：" + fileName);
    } catch (err) {
      vscode.window.showErrorMessage("生成文档失败");
    }
  }
}
