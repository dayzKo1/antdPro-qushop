import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}
// 用户信息
export async function queryCurrent(params) {
  return request('/api/admin/me', {
    method: 'GET',
    params,
  });
}
// export async function queryNotice() {
//   return request(`/api/admin/me/notices`, {
//     method: 'GET',
//   });
// }
export async function queryNotices() {
  return request('/api/notices');
}
