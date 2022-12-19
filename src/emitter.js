import ErrorStackParser from 'error-stack-parser'
import { request } from './core/request'
import { STATUS_CODE,EVENTTYPES } from './common/constant'
const Emitter = {
  // 处理xhr、fetch
  handleHttp(data, type) {
    // const result = formatHttpCode(data);
    const result = {status:'ok'}
    // 添加用户行为
    // breadcrumb.push({
    //   type,
    //   category: breadcrumb.getCategory(type),
    //   data: Object.assign({}, result),
    //   status: isError ? STATUS_CODE.ERROR : STATUS_CODE.OK,
    //   time: data.time
    // });
    console.log(result,data,'----------------');
    request.send({ ...result, type, status: STATUS_CODE.ERROR });
  },
  // 处理vue代码报错
  vueErrorEmitter(ev) {
    const errJson = ErrorStackParser.parse(ev)[0]
    let { fileName, columnNumber, lineNumber } = errJson;
    let errorData = {
      type: EVENTTYPES.VUE,
      status: STATUS_CODE.ERROR,
      time: Date.now(),
      message: ev.message,
      fileName,
      line: lineNumber,
      column: columnNumber
    };
    request.send(errorData)
    // throw ev
  },
  handleError(ev) {
    console.log('我这里报错了++++++++++++++++',ev);
    try {
      const target = ev.target;
      // Vue.config.errorHandler捕获的报错 or 异步错误
      if (!target || (ev.target && !ev.target.localName)) {
        // errorHandler捕获的报错使用ev解析，异步错误使用ev.error解析
        let stackFrame = ErrorStackParser.parse(!target ? ev : ev.error)[0];
        let { fileName, columnNumber, lineNumber } = stackFrame;
        let errorData = {
          type: EVENTTYPES.ERROR,
          status: STATUS_CODE.ERROR,
          time: getTimestamp(),
          message: ev.message,
          fileName,
          line: lineNumber,
          column: columnNumber
        };

        // breadcrumb.push({
        //   type: EVENTTYPES.ERROR,
        //   category: breadcrumb.getCategory(EVENTTYPES.ERROR),
        //   data: errorData,
        //   time: getTimestamp(),
        //   status: STATUS_CODE.ERROR
        // });
        return request.send(errorData);
      }

      // 资源加载报错
      if (target.localName) {
        // 提取资源加载的信息
        const data = resourceTransform(target);
        breadcrumb.push({
          ...data,
          type: EVENTTYPES.RESOURCE,
          category: breadcrumb.getCategory(EVENTTYPES.RESOURCE),
          status: STATUS_CODE.ERROR,
          time: getTimestamp()
        });
        return request.send({
          ...data,
          type: EVENTTYPES.RESOURCE,
          status: STATUS_CODE.ERROR
        });
      }
    } catch (er) {
      console.error('错误代码解析异常:', er);
    }
  },
}
export { Emitter }