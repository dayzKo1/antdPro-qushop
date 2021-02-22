import request from '@/utils/request';

export async function tagList(params) {
  return request('/api/admin/tags', {
    method: 'GET',
    params,
  });
}

export async function addProTags(data) {
  return request('/api/admin/tags', {
    method: 'POST',
    data,
  });
}
