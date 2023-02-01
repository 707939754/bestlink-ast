import { Template, BaseInfo, CodeType } from "./interface";
import * as _ from "lodash";
/**
 * 根据模板获取对应的字符串
 * @param commend 注释
 * @param functionName 方法名
 * @param paramName 形参名
 * @param interfaceName 接口名
 * @param actionName 请求类型名
 * @param responseName 返回接口名
 * @param url 请求路径
 * @returns
 */
export function getTemplate(template: Template) {
  return `
  ${getResult()}
  ${template.commend} export function ${template.functionName}(data: ${
    template.interfaceName
  }) {
        return http.${_.toLower(template.actionName)}<Result<${
    template.responseName
  }>>({
          url: '${template.url}',
          ${template.paramName}: data
        })
      }
    `;
}

/**
 * 生成注释
 * @param commend
 * @returns
 */
export function getComment(commend: BaseInfo, remarks?: string) {
  return `
    /**
     * ${commend.name}
     * 后端负责人：${commend.createBy}
     * 接口状态：${commend.status === "done" ? "已完成" : "未完成"}
     * 更新时间：${commend.updateTime}
     * 备注：${remarks}
     * @returns
     */
    `;
}

/**
 * 获取返回值的接口数据
 * @returns
 */
export function getResult() {
  return `import http from '@/utils/axios';import { Result } from '@/utils/axios/types';`;
}

/**
 * 获取接口数据
 */
export function getInterface(interfaceName: string, keyCode: Array<CodeType>) {
  return `
  /**
   * 请求数据的接口类型
   */
  export interface ${interfaceName} {
    ${getKeyCode(keyCode)}
  }`;
}

/**
 * 获取接口
 * @param keyCode
 */
function getKeyCode(keyCode: Array<CodeType>) {
  let str = "";
  keyCode.forEach((item) => {
    str += `${item.key} ${item.required ? "" : "?"}: ${item.type}; // ${
      item.description
    }\n`;
  });
  return str;
}
