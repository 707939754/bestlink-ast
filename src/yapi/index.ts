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
      url: "",
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
  let container = await page.$(".caseContainer");

  // 基本信息
  let baseInfo = await container?.$$(".panel-view .ant-row");

  // 遍历基本信息baseInfo 获取行信息
  baseInfo?.forEach(async (base) => {
    try {
      let text = await base?.$eval(".colName", (ele) => ele.innerText);
      console.log(text, "name");
    } catch (error) {
      console.error("基本信息：未捕获到信息");
    }
  });
  // console.log(baseInfo);

  //   await page
  // .$eval("div.caseContainer", (ele) => ele.innerHTML)
  // .then(async (res) => {
  //   let baseInfo = await page.$$(".panel-view .ant-row");
  //   console.log(baseInfo);
  // 各类信息的数组
  //   let infoArr = await page.$$(".panel-view");
  //   infoArr?.forEach(async (item) => {
  //     let target = await item.$(".colName");
  //     console.log(target);
  //   });
  //   console.log(a);
  //   console.log(res);
  //   let arr = document.querySelectorAll(".interface-title");
  //   console.log(arr);
  // });

  //   console.log("content", text);
  // 等待title节点出现
  //   await page.waitForSelector(".ant-table-wrapper");
  //   const titleDomText1 = await page.$eval(
  //     "interface-title",
  //     (el) => el.innerText
  //   );
  //   console.log("sss", titleDomText1);
  //   await browser.close();
}

export default createYapi;
