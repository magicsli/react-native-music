import seeting from '@/setting';
import store from '@/Mobox/appStore';
function request(url, data, method = 'get') {
  method = method.toLocaleUpperCase();

  const options = {
    method,

    headers: {
      'content-type': 'application/json',
    },
    ...(data?._fetch || {}), // fetch特殊配置内容
  };

  // 删除特殊的参数配置，保证不会污染请求参数
  data?._fetch && delete data._fetch;

  if (method === 'GET') {
    let queryStr = '?';
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const element = data[key];
        queryStr += `${key}=${element}&`;
      }
    }
    url += queryStr;
  } else {
    url += `?timestamp=${+new Date()}`;
    options.body = JSON.stringify(data);
  }

  return fetch(seeting.APP_BASE_URL + url, options)
    .then(response => {
      if (response.ok !== true) {
        // 如果返回结果不为 200 系列状态， 则反馈请求错误
        return Promise.reject({message: `NETWORK ERROR: status=${response.status};`, options, response});
      } else {
        return response.json();
      }
    }) // parses response to JSON
    .catch(err => {
      console.error(err);
      store?.toast(err?.message || '请求发生错误');
      return Promise.reject(err);
    });
}

export default request;
