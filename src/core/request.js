

export class Request{
  constructor(){
    this.url = '';
    this.token="";
    this.systemId='';
    this.systemName='';
    this.useImgUpload = ''
  }
  init(options={}) {
    const {url, token, systemId, systemName, useImgUpload} = options
    this.url = url;
    this.token = token
    this.systemId = systemId
    this.systemName = systemName
    this.useImgUpload = useImgUpload

  }
  async Post(data, url) {
    const requestFun = () => {
      console.log(url);
      fetch(`${url}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        console.log(response);
        response.json()
      });
    };
    requestFun()
  }
  isSelfUrl(targetUrl) {
    let flag = false;
    console.log(targetUrl,this.url);
    if (this.url && targetUrl.indexOf(this.url) !== -1) {
      flag = true;
    }
    return flag;
  }
  send(data){
    let url = this.url;
    this.Post(data,url)
  }
}
const request =  new Request()
export { request };