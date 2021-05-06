import request from '@/api/request';

// 获取电台节目棒
export const getdj = data => request('/personalized/privatecontent/list', data, 'post');

// 获取精品歌单列表
export const getPlayList = data => request('/top/playlist/highquality', data, 'get');

// 获取歌单详情
export const getPlaylistDetail = data => request('/playlist/detail', data, 'get');

// 搜索
export const getSearch = data => request('/cloudsearch', data, 'get');

// 获取歌曲地址
export const getMusicUrl = data => request('/song/url', data, 'get');

// 获取歌曲详情
export const getMusicUrlDetail = data => request('/song/detail', data, 'get');

