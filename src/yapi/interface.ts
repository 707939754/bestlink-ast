export interface ResponseData {
  baseInfo: BaseInfo; // 基本信息
  remarks?: string; // 备注
  request: Request; // 请求参数
  response: Response; // 返回数据
}

export interface BaseInfo {
  name: string;
  createBy: string;
  status: string;
  updateTime: string;
  url: { type: string; path: string };
}

export interface Request {
  body: Array<CodeType>;
  params: Array<CodeType>;
  query: Array<CodeType>;
}

export type Response = Array<CodeType>;

export interface CodeType {
  key: string;
  type: string;
  description: string;
  required: boolean;
  children?: CodeType[];
}

// template
export interface Template {
  commend: string;
  functionName: string;
  paramName: string | undefined;
  interfaceName: string;
  actionName: string;
  responseName: string;
  url: string;
}
