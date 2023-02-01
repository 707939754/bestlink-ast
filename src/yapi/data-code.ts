import { BaseInfo, Request, Response, ResponseData } from "./interface";
import {
  pathExistsSync,
  createFileSync,
  outputFileSync,
  mkdirsSync,
} from "fs-extra";
import { CACHE } from "../config/.env";
/**
 * 通过数据转换为typescript 字符串
 */
export default class DataToTypescript {
  public baseInfo: BaseInfo;
  public remarks: string | undefined;
  public request: Request;
  public response: Response;

  constructor(responseData: ResponseData) {
    const { baseInfo, remarks, request, response } = responseData;
    this.baseInfo = baseInfo;
    this.remarks = remarks;
    this.request = request;
    this.response = response;
  }

  /**
   * 获取接口数据
   */
  getInterface() {}

  /**
   * 获取枚举数据
   */
  getEnum() {}

  /**
   * 获取请求方法
   */
  getFunction() {}

  /**
   * 格式化字符串代码
   * @param str
   */
  prettyCode(str: string) {
    return str;
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
      let fileName = this.baseInfo.name + ".ts"; // 文件名称
      let filePath = CACHE + fileName; // 文件路径
      let str = this.prettyCode("pppppp"); // 格式化代码

      createFileSync(filePath); // 创建文件
      outputFileSync(filePath, str); // 输入值
    } catch (err) {
      console.error(err);
    }
  }
}
