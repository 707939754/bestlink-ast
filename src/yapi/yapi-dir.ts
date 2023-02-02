import {
  TreeDataProvider,
  Event,
  TreeItem,
  TreeItemCollapsibleState,
  ProviderResult,
} from "vscode";
import { YAPICACHE } from "../config/.env";
import { readdir } from "fs-extra";
import * as _ from "lodash";

export default class GetYapiDir implements TreeDataProvider<DataItem> {
  onDidChangeTreeData?: Event<DataItem | null | undefined> | undefined;
  public data: DataItem[] = [];

  constructor() {
    this.getDirData();
  }

  /**
   * 根据存储的路径获取已生成的代码数据
   * @returns
   */
  async getDirData() {
    let list = await readdir(YAPICACHE);
    if (_.isEmpty(list)) {
      return [] as DataItem[];
    } else {
      list?.forEach((item) => {
        this.data.push(new DataItem(item));
      });
    }
  }

  getTreeItem(element: DataItem): TreeItem | Thenable<TreeItem> {
    return element;
  }

  getChildren(element?: DataItem | undefined): ProviderResult<DataItem[]> {
    if (element === undefined) {
      return this.data;
    }
    return element.children;
  }
}

class DataItem extends TreeItem {
  public children: DataItem[] | undefined;
  constructor(label: string, children?: DataItem[] | undefined) {
    super(
      label,
      children === undefined
        ? TreeItemCollapsibleState.None
        : TreeItemCollapsibleState.Collapsed
    );
    this.children = children;
  }

  //为每项添加点击事件的命令
  command = {
    title: "codeFile",
    command: "YapiCodeFile.itemClick",
    arguments: [
      //传递两个参数
      this.label,
    ],
  };
}
