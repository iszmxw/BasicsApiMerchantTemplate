import request from '@/utils/request'

export function applyWithdraw(data) {
  return request({
    url: '/estimate/apply_withdraw',
    method: 'post',
    data
  })
}

export function getSettleMentInfo(query) {
  return request({
    url: '/estimate/settlement_info',
    method: 'get',
    params: query
  })
}

export function getList(query) {
  return request({
    url: '/estimate/list',
    method: 'get',
    params: query
  })
}

export function getMonthEstimate(query) {
  return request({
    url: '/estimate/month_estimate',
    method: 'get',
    params: query
  })
}
