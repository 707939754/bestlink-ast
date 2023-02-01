import { Template, BaseInfo } from "./interface";
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
