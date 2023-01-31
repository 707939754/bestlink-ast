import * as _ from "lodash";
import { http } from "../utils/axios";
import { API, LOGIN } from "../config/.env";

/**
 * 通过链接地址获取数据
 * 第二条方向：通过接口获取数据
 * @param url
 */
export async function getDataByApi(id: string) {
  const cookie = await getCookie();
  const apiData = await getData(id, cookie);

  //TODO 处理为对象方便生成代码

  return apiData;
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
    const setCookie = _.get(res, "headers.set-cookie", "");
    cookie = setCookie[0].split(";")[0] + ";" + setCookie[1].split(";")[0];
  });
  return cookie;
}

/**
 * 获取接口数据
 */
async function getData(id: string, cookie: string) {
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
