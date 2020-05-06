import request from '@/utils/request'

export function getStatistics(query) {
  return request({
    url: '/statistics/dashboard',
    method: 'get',
    params: query
  })
}

export function getFansRecord(query) {
  return request({
    url: '/statistics/fans_record',
    method: 'get',
    params: query
  })
}

export function getFansDayChart(query) {
  return request({
    url: '/statistics/fans_day',
    method: 'get',
    params: query
  })
}

export function getFansMonthChart(query) {
  return request({
    url: '/statistics/fans_month',
    method: 'get',
    params: query
  })
}
