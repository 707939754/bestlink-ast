import axios, { AxiosHeaders } from "axios";
import { BASEURL } from "../config/.env";

interface Config {
  url: string;
  action: string;
  params?: any;
  data?: any;
  cookie?: string;
}

/**
 * axios请求
 */
export function http(config: Config) {
  return new Promise((resolve, rejects) => {
    axios({
      url: config.url,
      method: config.action,
      data: config.data,
      params: config.params,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: { Cookie: config.cookie },
      baseURL: BASEURL,
      timeout: 60 * 1000,
      withCredentials: true,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.error(err);
      });
  });
}
