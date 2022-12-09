import { request } from './request'
export class Options {
  constructor() {
    this.throttleDelayTime = 0; // click事件的节流时长
    this.overTime = 10; // 接口超时时长
    this.silentRecordScreen = false; // 是否开启录屏
    this.recordScreentime = 10; // 录屏时长
    // this.recordScreenTypeList = [EVENTTYPES.ERROR, EVENTTYPES.UNHANDLEDREJECTION, EVENTTYPES.RESOURCE, EVENTTYPES.FETCH, EVENTTYPES.XHR]; // 录屏事件集合
  }
  // bindOptions(options = {}) {
  //   const { filterXhrUrlRegExp, throttleDelayTime, silentRecordScreen, overTime, recordScreenTypeList, recordScreentime } = options;
  //   validateOption(throttleDelayTime, 'throttleDelayTime', 'number') && (this.throttleDelayTime = throttleDelayTime);
  //   validateOption(overTime, 'overTime', 'number') && (this.overTime = overTime);
  //   validateOption(recordScreentime, 'recordScreentime', 'number') && (this.recordScreentime = recordScreentime);
  //   validateOption(silentRecordScreen, 'silentRecordScreen', 'boolean') && (this.silentRecordScreen = silentRecordScreen);
  //   validateOption(recordScreenTypeList, 'recordScreenTypeList', 'array') && (this.recordScreenTypeList = recordScreenTypeList);
  //   validateOption(filterXhrUrlRegExp, 'filterXhrUrlRegExp', 'regexp') && (this.filterXhrUrlRegExp = filterXhrUrlRegExp);
  // }
}
const options = new Options();

export function initOptions(Options = {}) {
  // // 设置用户行为的配置项
  // breadcrumb.bindOptions(paramOptions);
  // transportData 配置上报的信息
  request.init(Options);
  // 绑定其他配置项
  // options.bindOptions(paramOptions);
}
export { options };