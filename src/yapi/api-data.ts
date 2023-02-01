import * as _ from "lodash";
import { http } from "../utils/axios";
import { API, LOGIN, GROUP } from "../config/.env";
import { ResponseData, CodeType } from "./interface";

let cookie = "";

/**
 * 通过链接地址获取数据
 * @param url
 */
export async function getDataByApi(id: string) {
  cookie = await getCookie();
  const apiData = await getData(id);
  //TODO 处理为对象方便生成代码
  const response = await getResponseData(apiData);
  return response;
}

/**
 * 登录获取cookie
 * @returns
 */
async function getCookie() {
  let cookie = "";
  await http({
    url: LOGIN,
    action: "POST",
    data: {
      email: "707939754@qq.com",
      password: "mima5683",
    },
  }).then((res) => {
    const setCookie = _.get(res, "headers.set-cookie", [] as Array<string>);
    if (setCookie && setCookie.length >= 2) {
      cookie = setCookie[0].split(";")[0] + ";" + setCookie[1].split(";")[0];
    }
  });
  return cookie;
}

/**
 * 获取接口数据
 */
async function getData(id: string) {
  let response = "";
  await http({
    url: API,
    action: "GET",
    params: {
      id: id,
    },
    cookie: cookie,
  }).then((res) => {
    response = _.get(res, "data.data", "");
  });
  return response;
}

/**
 * 将接口数据处理为可执行对象
 * @param data
 * @returns
 */
async function getResponseData(data: any): Promise<ResponseData> {
  const basepath = await getBasePath(data.project_id);
  // 基本信息
  const baseInfo = {
    name: data.title,
    createBy: data.username,
    status: data.status,
    updateTime: data.up_time,
    url: {
      type: data.method,
      path: basepath + data.path,
    },
  };
  // 备注
  const remarks = data.markdown;
  // 请求参数
  const body = getReqBody(data.req_body_other); // 用于以请求体
  const params = getParams(data.req_query); // 用于以?拼接
  const query = getQuery(data.req_params); // 用于路径上的数据
  const request = { body, params, query };
  // 返回数据
  const response = getReqBody(data.res_body); // 用于以请求体

  return { baseInfo, remarks, request, response } as ResponseData;
}

/**
 * 获取基础链接
 * @param projectId
 */
async function getBasePath(projectId: string) {
  let response = "";
  await http({
    url: GROUP,
    action: "GET",
    params: {
      id: projectId,
    },
    cookie: cookie,
  }).then((res) => {
    response = _.get(res, "data.data.basepath", "");
  });
  return response;
}

/**
 * 根据string获取请求体
 * @param data
 */
function getReqBody(data: string) {
  if (_.isEmpty(data)) {
    return [];
  }
  let response: CodeType[] = [];

  const obj = JSON.parse(data);
  const properties = obj.properties;
  const propertiesKey = Object.keys(properties);
  const codeKey = obj.required || [];
  response = getTreeBody(propertiesKey, properties, codeKey);
  return response;
}

/**
 * 递归获取树结构返回值
 * @param propertiesKey
 * @param obj
 * @param codeKey
 * @returns
 */
function getTreeBody(
  propertiesKey: Array<any>,
  obj: any,
  codeKey: Array<string>
) {
  let response: CodeType[] = [];
  propertiesKey?.forEach((item: string) => {
    if (_.isEmpty(_.get(obj, item + ".properties", []))) {
      response.push({
        key: item,
        type: _.get(obj, item + ".type", ""),
        description: _.get(obj, item + ".description", ""),
        required: codeKey.includes(item),
      });
    } else {
      const copyCodeKey = _.get(obj, item + ".required", []);
      const copyObj = _.get(obj, item + ".properties", []);
      const copyPropertiesKey = Object.keys(copyObj);
      response.push({
        key: item,
        type: _.get(obj, item + ".type", ""),
        description: _.get(obj, item + ".description", ""),
        required: codeKey.includes(item),
        children: getTreeBody(copyPropertiesKey, copyObj, copyCodeKey),
      });
    }
  });

  return response;
}

/**
 * 根据string获取params
 * @param data
 */
function getParams(data: Array<any>) {
  if (_.isEmpty(data)) {
    return [];
  }
  let response: CodeType[] = [];
  data?.forEach((item) => {
    response.push({
      key: item.name,
      type: "string",
      description: item.desc,
      required: item.required === "1",
    });
  });

  return response;
}

/**
 * 通过数组获取query
 * @param data
 */
function getQuery(data: Array<any>) {
  if (_.isEmpty(data)) {
    return [];
  }
  let response: CodeType[] = [];

  data?.forEach((item) => {
    response.push({
      key: item.name,
      type: "string",
      description: item.desc,
      required: true,
    });
  });
  return response;
}
