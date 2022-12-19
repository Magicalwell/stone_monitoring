// 切片重写对象的方法，把原函数当作参数传入，内部再return一个函数，并且apply调用原来的函数
import { xhrMethods, HTTPTYPE, EVENTTYPES } from '../common/index'
import { request } from './request'
import { Emitter } from '../emitter'
const handler = {}
export function replaceMethods(source, name, replacement, isForced = false) {
  if (source === undefined) return;
  if (name in source || isForced) {
    const original = source[name];
    const wrapped = replacement(original);
    if (typeof wrapped === 'function') {
      source[name] = wrapped;
    }
  }
}
export function on(target, eventName, handler, opitons = false) {
  target.addEventListener(eventName, handler, opitons);
}
// 判断接口是否在黑名单中，黑名单中的接口不上报，这块后续和权限系统打通。
function isBlackUrl(url) {
  // return options.filterXhrUrlRegExp && options.filterXhrUrlRegExp.test(url);
  return true
}
function motifyXHR() {
  const originalXhr = XMLHttpRequest.prototype;
  replaceMethods(originalXhr, 'open', (originalOpen) => {
    return function (...args) {
      this.xhrData = {
        method: args[0],
        url: args[1],
        sTime: Date.now(),
        type: HTTPTYPE.XHR
      };
      originalOpen.apply(this, args);
    };
  });
  replaceMethods(originalXhr, 'send', (originalSend) => {
    return function (...args) {
      const { method, url } = this.xhrData;
      // 监听loadend事件，拿到执行结果判断是否进行上报
      on(this, 'loadend', function () {
        if ((method === xhrMethods.Post && request.isSelfUrl(url)) || isBlackUrl(url)) return;
        const { responseType, response, status } = this;
        this.xhrData.reqData = args[0];
        const eTime = Date.now();
        // 设置该接口的time，用于排序和显示事件
        this.xhrData.time = this.xhrData.sTime;
        this.xhrData.status = status;
        if (['', 'json', 'text'].indexOf(responseType) !== -1) {
          this.xhrData.responseText = typeof response === 'object' ? JSON.stringify(response) : response;
        }
        // 接口的执行时长
        this.xhrData.duringTime = eTime - this.xhrData.sTime;
        // 执行之前注册的xhr回调函数
        // triggerHandlers(EVENTTYPES.XHR, this.xhrData);
        handler[EVENTTYPES.XHR](this.xhrData)
      });
      originalSend.apply(this, args);
    };
  });
}
function motifyFetch() {

  replaceMethods(window, 'fetch', (originalSend) => {
    return function (url, config = {}) {
      const sTime = Date.now();
      const method = (config && config.method) || 'GET';
      let fetchData = {
        type: HTTPTYPE.FETCH,
        method,
        reqData: config && config.body,
        url
      };
      // 先不设置头部，等后台系统完善再补充
      // const headers = new Headers(config.headers || {});
      // Object.assign(headers, {
      //   setRequestHeader: headers.set
      // });
      // config = Object.assign(Object.assign({}, config), { headers });
      // fetch需要then链式调用，这里还是要返回原来的方法
      return originalSend.apply(window, [url, config]).then((res)=>{
        console.log('接口调用成功，但是由后台返回的数据我们一般不做上报，因为可能含有校验');
        return res
      },(error)=>{
        console.log(error,'坏了！这下出问题了');
        const eTime = Date.now();
        console.log(method, xhrMethods.Post, isBlackUrl(url));
        if ((method === xhrMethods.Post && request.isSelfUrl(url)) || isBlackUrl(url)) return;
        fetchData = Object.assign(Object.assign({}, fetchData), {
          duringTime: eTime - sTime,
          status: 0,
          time: sTime
        });
        handler[EVENTTYPES.FETCH](fetchData)
        throw error;
      });
    }
  })
}
function motifyListenError() {
  on(
    window,
    'error',
    function (e) {
      handler[EVENTTYPES.ERROR] (e);
    },
    true
  );
}
export function motifyFn() {
  handler[EVENTTYPES.XHR] = (data) => 
    Emitter.handleHttp(data, EVENTTYPES.XHR)
  
  handler[EVENTTYPES.FETCH] = (data) => 
    Emitter.handleHttp(data, EVENTTYPES.FETCH)
  
  handler[EVENTTYPES.ERROR] = (data) => 
    Emitter.handleError(data, EVENTTYPES.ERROR)
  
  motifyXHR()
  motifyFetch()
  motifyListenError()
}