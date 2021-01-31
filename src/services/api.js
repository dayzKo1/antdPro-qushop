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

export async function batchesCategories(data) {
  return request('/api/admin/batches', {
    method: 'POST',
    data,
  });
}

// 查询顾客
export async function queryCustomers(params) {
  return request('api/admin/customers', {
    method: 'GET',
    params,
  });
}

// 查询国家列表
export async function queryCountries() {
  return request('api/admin/countries');
}
