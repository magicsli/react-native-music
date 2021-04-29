import {resolve} from 'node_modules/uri-js/dist/es5/uri.all';

/**
 *
 * @param {function} func 需要防抖处理的函数
 * @param {number} delay 延迟时间
 * @returns 返回一个函数执行结果的 Promise 默认resolve
 */
export function debounce(func, delay = 1000) {
  var timeout; // 防抖时间点 （利用闭包保存了一个绝对的防抖私有变量）
  return function (...arg) {
    clearTimeout(timeout);
    return new Promise((resolve, reject) => {
      timeout = setTimeout(() => {
        clearTimeout(timeout);
        timeout = null;
        resolve(func.apply(this, arg));
      }, delay);
    });
  };
}

const loveList = ['鹿乃', 'tk from 凛冽时雨', '泽野弘之', 'aimer'];
/**
 * 随机获取我喜欢的歌手
 * @returns {string} 歌手明
 */
export function getRandomLove() {
  const randomIndex = Math.floor(Math.random() * loveList.length);
  return loveList[randomIndex] || '';
}
