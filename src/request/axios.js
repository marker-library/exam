//第一步我们先引入axios模块
import axios from "axios";

//这里的话有token的需求我们可以获取一下token，方便我们进行请求的时候使用
function getToken() {
  //这里可以根据你项目具体来获取
  const token = window.sessionStorage.getItem("token"); token
  return token || "";
}
//第二步我们创建一个axios实例对象,然后用函数Factory封装一下
function Factory({ baseURL, code, msg, callFail }) {
  const $http = axios.create({
    baseURL,
    timeout: 1000 * 60 * 5, //超时时间
  });
  //请求拦截器,我们可以在请求拦截器中设置token,或者对请求进行一些处理
  $http.interceptors.request.use(
    (config) => {
      //这里我们可以设置token
      const token = getToken();
      if (token) {
        config.headers["AuthoriZation"] = token;
      }
      return {
        headers: {
          //这里我们还可以设置请求头
          "Content-Type": "application/json;charset=UTF-8",
          //......
        },
        ...config,
        validateStatus: (status) => {
          //这里我们设置状态码的判断条件，如果返回的状态码在200到300之间就表示请求成功，否则就是失败
          return (status >= 200 && status < 300) || status === 401;
        },
      };
    },
    (error) => {
      //这里我们处理请求错误
      return Promise.reject(error);
    }
  );
  //响应拦截器,我们可以在响应拦截器中返回的数据或者错误信息进行处理
  $http.interceptors.response.use((response) => {
    //这里我们处理响应数据
    const data = response.data;
    console.log(response)

    if (+data.code === 200 || +data.code === 0) {
      return data;
    } else if (+data.code === 401) {
      console.error("请求报错提示：token失效，请重新登录");
    } else {
      console.error("请求报错提示：", data, msg || "请求失败");
    }
    return Promise.reject(data.msg || "请求失败");
  },
    error => {
      //这里我们处理响应错误
      console.error("请求报错提示：", error, msg || "请求失败");
      return Promise.reject(error);
    });
  return $http;
}
//第三步我们导出axios实例对象
export default Factory;