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

export async function addProduct(data) {
  return request('/api/admin/products', {
    method: 'POST',
    data,
  });
}

export async function updateProduct(data, id, method) {
  return request(`/api/admin/products/${id}`, {
    method,
    data,
  });
}
