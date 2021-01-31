import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

// 订单列表
export async function ordersList(params) {
  return request('/api/admin/orders', {
    method: 'GET',
    params,
  });
}

// 商品分类
export async function categoriesList(params) {
  return request('/api/admin/categories', {
    method: 'GET',
    params,
  });
}

// 批量操作
export async function batch(data) {
  return request('/api/admin/batches', {
    method: 'POST',
    data,
  });
}
// 批量操作
export async function obatch(data) {
  return request('/api/admin/batches/orders-status', {
    method: 'POST',
    data,
  });
}
