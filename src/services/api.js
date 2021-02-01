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
  return request('/api/admin/reports/orders', {
    method: 'GET',
    params,
  });
}

// 商品销售数
export async function reportsHotProducts(params) {
  return request('/api/admin/reports/hot_products', {
    method: 'GET',
    params,
  });
}

// 总销售额
export async function reportsSales(params) {
  return request('/api/admin/reports/sales', {
    method: 'GET',
    params,
  });
}

// 访客
export async function reportsVisits(params) {
  return request('/api/admin/reports/visits', {
    method: 'GET',
    params,
  });
}
