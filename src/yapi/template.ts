import { Template, BaseInfo, CodeType } from "./interface";
import * as _ from "lodash";
import dayjs from "dayjs";
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
 * 根据模板生成链接上的方法
 * @returns
 */
export function getQueryTemplate(template: Template) {
  return `
  ${getResult()}
  ${template.commend} export function ${template.functionName}(data: ${
    template.interfaceName
  }) {
        return http.${_.toLower(template.actionName)}<Result<${
    template.responseName
  }>>({
          url: \`${template.url.replace(template.endWord || "", "${data}")}\`,
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
     * 更新时间：${dayjs(parseInt(commend.updateTime) * 1000).format(
       "YYYY-MM-DD HH:mm:ss"
     )}
     * 备注：${remarks}
     */
    `;
}

/**
 * 获取返回值的接口数据
 * @returns
 */
export function getResult() {
  return `import http from '@/utils/axios';`;
}

/**
 * 默认返回值
 * @returns
 */
export function getDefaultResult() {
  return `
  /**
   * 默认返回值外壳
   */
  export interface Result<T = any> {
    success: boolean
    code: number
    message: string
    data: T
  }`;
}

/**
 * 获取接口数据
 */
export function getInterface(
  commend: string,
  interfaceName: string,
  keyCode: Array<CodeType>
) {
  return `
  /**
   * ${commend}
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
    if (item.children) {
      str += `${item.key} ${item.required ? "" : "?"}: {\n ${getKeyCode(
        item.children
      )} } \n; ${item.description ? `// ${item.description}` : ""}\n`;
    } else {
      str += `${item.key} ${item.required ? "" : "?"}: ${getKeyType(
        item.type
      )}; ${item.description ? `// ${item.description}` : ""}\n`;
    }
  });
  return str;
}

/**
 * 根据后端不同类型做适配
 */
function getKeyType(type: string) {
  switch (type) {
    case "integer":
      return "number";
    case "array":
      return "[]";
    case "null":
      return "any";
    default:
      return type;
  }
}
