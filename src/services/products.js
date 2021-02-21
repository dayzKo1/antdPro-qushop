import request from '@/utils/request';

export async function productList(params) {
  return request('/api/admin/products', {
    method: 'GET',
    params,
  });
}

// 商品详情
export async function productDetail(params) {
  const { id } = params;
  return request(`/api/admin/products/${id}`, {
    method: 'GET',
  });
}
