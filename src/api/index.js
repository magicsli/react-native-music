import request from '@/api/request';

// 获取电台节目棒
export const getdj = data => request('/personalized/privatecontent/list', data, 'post');

// 获取精品歌单列表
export const getPlayList = data => request('/top/playlist/highquality', data, 'get');

// 搜索
export const getSearch = data => request('/cloudsearch', data, 'get');

// 获取歌曲详情
export const getDetail = data => request('/song/url', data, 'get');
