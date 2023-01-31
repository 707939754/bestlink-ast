import * as vscode from "vscode";
import { isUrl } from "../utils";
import puppeteer from "puppeteer";
import { HtmlData } from "./interface";

async function createYapi() {
  // 显示输入框
  let url = await showInputBox();
  if (!url) {
    return;
  }
  const data = await getHtmlByUrl(url);
}

/**
 * 获取yapi的地址
 */
async function showInputBox() {
  let res = "";
  await vscode.window
    .showInputBox({
      value: "",
      valueSelection: [0, 0],
      placeHolder: "请输入YAPI的接口地址",
      prompt: "需符合链接规范 ",
      validateInput: (str) => {
        return isUrl(str) ? null : "不符合链接规范";
      },
    })
    .then((msg) => {
      res = msg || "";
    });

  return res;
}

/**
 * 通过链接地址获取html
 * @param url
 */
async function getHtmlByUrl(url: string) {
  let resData: HtmlData = {
    baseInfo: {
      name: "",
      createBy: "",
      status: "",
      updateTime: "",
      url: {
        type: "",
        path: "",
      },
    },
  };
  // 启动浏览器
  const browser = await puppeteer.launch({
    headless: true, // 默认是无头模式，这里为了示范所以使用正常模式
    defaultViewport: { width: 1920, height: 1080 },
  });

  // 控制浏览器打开新标签页面
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(true);
  // 在新标签中打开要爬取的网页
  await page.goto("http://192.168.0.68:3000/");
  await page.click(".btn-login");
  await page.type("#email", "707939754@qq.com");
  await page.type("#password", "mima5683");
  await page.click(".login-form-button");
  await page.goto(url);

  // 等待右侧容器
  await page.waitForSelector("div.right-content", {
    visible: true,
  });

  // 等待信息容器
  await page.waitForSelector("div.caseContainer", {
    visible: true,
  });

  // 信息容器返回值
  const container = await page.$(".caseContainer");

  // 基本信息
  const baseInfo = await container?.$$(".panel-view .ant-row");

  // 遍历基本信息baseInfo 获取行信息
  baseInfo?.forEach(async (base, index) => {
    try {
      // 第一行
      if (index === 0) {
        // 接口名称
        resData.baseInfo.name = await base?.$eval(
          ".colName",
          (ele) => ele.innerText
        );

        // 创建人
        resData.baseInfo.createBy = await base?.$eval(
          ".colValue .user-name ",
          (ele) => ele.innerText
        );
      }

      // 第二行
      if (index === 1) {
        // 状态
        resData.baseInfo.status = await base?.$eval(
          ".tag-status",
          (ele) => ele.innerText
        );

        // 更新时间
        let secondList = await base?.$$eval(".ant-col-8", (ele) =>
          ele.map((node) => node.innerText)
        );
        resData.baseInfo.updateTime =
          secondList && secondList.length === 2 ? secondList[1] : "";
      }

      if (index === 2) {
        // 接口请求类型
        resData.baseInfo.url.type = await base?.$eval(
          ".colValue .tag-method",
          (ele) => ele.innerText
        );
        // 接口请求路径
        let thirdList = await base?.$$eval(".colValue .colValue", (ele) =>
          ele.map((node) => node.innerText)
        );

        resData.baseInfo.url.path =
          thirdList && thirdList.length === 2 ? thirdList[1] : "";
      }
    } catch (error) {
      console.error("基本信息：未捕获到信息");
    }
  });

  // 备注
  resData.remarks = await container?.$eval(
    ".tui-editor-contents p",
    (ele) => ele.innerText
  );

  // 请求参数
  const requestParams = "";

  console.log(resData, "返回值");
}

export default createYapi;
