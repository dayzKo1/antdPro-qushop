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

// 订单详情
export async function ordersDetail(params) {
  const { id } = params;
  return request(`/api/admin/orders/${id}`, {
    method: 'GET',
  });
}

// 订单详情
export async function orderStrack(data, id) {
  return request(`/api/admin/orders/${id}/track`, {
    method: 'POST',
    data,
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

// 批量操作
export async function batch(data) {
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

// 数据分析
// 订单
export async function reportsOrders(params) {
  return request('/api/admin/reports', {
    method: 'GET',
    params,
  });
}

export async function hotProduct(params) {
  return request('/api/admin/reports/hot_products', {
    method: 'GET',
    params,
  });
}

// // mock
// export async function user(params) {
//   return request('/mock/user', {
//     method: 'GET',
//     params,
//   });
// }
// export async function sale(params) {
//   return request('/mock/sale', {
//     method: 'GET',
//     params,
//   });
// }
// export async function hotProduct(params) {
//   return request('/mock/hotProduct', {
//     method: 'GET',
//     params,
//   });
// }
// export async function order(params) {
//   return request('/mock/order', {
//     method: 'GET',
//     params,
//   });
// }
