export interface HtmlData {
  baseInfo: BaseInfo; // 基本信息
  remarks?: Remarks; // 备注
  request?: Request; // 请求参数
  response?: Response; // 返回数据
}

export interface BaseInfo {
  name: string;
  createBy: string;
  status: string;
  updateTime: string;
  url: string;
}

export interface Remarks {}
export interface Request {}
export interface Response {}
