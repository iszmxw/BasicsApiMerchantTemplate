import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/login_log',
    method: 'get',
    params: query
  })
}

export function operationLog(query) {
  return request({
    url: '/user/operation_log',
    method: 'get',
    params: query
  })
}
