import request from '@/utils/request';

export async function productList(params) {
  return request('/api/admin/products', {
    method: 'GET',
    params,
  });
}
