import { Emitter } from "./emitter";
import { initOptions } from './core/setting'
import { motifyFn } from './core/loadmotify'
// options:{
//   interrupt:false  是否发生错误时中断运行  默认为否
//   url:'' 数据上传地址 必填
// }
const install = function (Vue, options = {}) {
  Vue.config.errorHandler = function (err, vm, info) {
    console.log(err, vm, info);
    // 单独处理vue的报错并上传
    Emitter.vueErrorEmitter(err)
  };
  init(options)
};
function init(options = {}) {
  console.log(options);
  initOptions(options);
  motifyFn()
}



export default {
  install,
};