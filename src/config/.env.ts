export const BASEURL = "http://192.168.0.68:3000";
export const LOGIN = "http://192.168.0.68:3000/api/user/login";
export const API = "http://192.168.0.68:3000/api/interface/get";
export const GROUP = "http://192.168.0.68:3000/api/project/get";
// 全局储存文件夹的路径
export const CACHE = "D:/bestlink-cache/";
// 格式化代码的配置项
export const PRETTIERCONFIG = {
  singleQuote: true,
  trailingComma: "all",
  printWidth: 120,
  tabWidth: 2,
  proseWrap: "always",
  endOfLine: "lf",
  bracketSpacing: false,
  arrowFunctionParentheses: "avoid",
  overrides: [
    {
      files: ".prettierrc",
      options: {
        parser: "json",
      },
    },
    {
      files: "document.ejs",
      options: {
        parser: "html",
      },
    },
  ],
};
