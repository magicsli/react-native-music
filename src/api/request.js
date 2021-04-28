import  seeting  from '@/setting'
function request(url, data, method = 'get') {
  method = method.toLocaleUpperCase()


  const options = {
    method,
    headers: {
      'content-type': 'application/json',
    },
  };


  if (method === 'GET') {
    let queryStr = '?';
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const element = data[key];
        queryStr += `${key}=${element}&`;
      }
    }
    url += queryStr;
  }else {
    options.body = JSON.stringify(data)
  }


  return fetch(seeting.APP_BASE_URL + url, options).then(response =>
    response.json(),
  ); // parses response to JSON
}

export default request;
