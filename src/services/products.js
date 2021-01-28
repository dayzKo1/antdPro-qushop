import request from '@/utils/request';

export async function productList(params) {
  return request('/api/admin/products', {
    method: 'GET',
    params,
  });
}

// 商品上架下架
export async function productBatch(data) {
  return request('/api/admin/batches', {
    method: 'POST',
    data,
  });
}
