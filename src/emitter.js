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
    console.log(result,data);
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
  }
}
export { Emitter }