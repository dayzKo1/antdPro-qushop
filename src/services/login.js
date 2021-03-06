import request from '@/utils/request';

export async function login(params) {
  return request('/api/admin/oauth/token', {
    method: 'POST',
    data: params,
  });
}

export async function logout() {
  return request('/api/admin/oauth/token/revoke', {
    method: 'POST',
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

// 修改密码

export async function changePassword(data) {
  return request(`/api/admin/me/update-password`, {
    method: 'POST',
    data,
  });
}
