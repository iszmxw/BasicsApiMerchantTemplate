import request from '@/utils/request'

export function basicInfo() {
  return request({
    url: '/merchant/info',
    method: 'get'
  })
}

export function bankInfo() {
  return request({
    url: '/merchant/bank_info',
    method: 'get'
  })
}

export function setBankInfo(data) {
  return request({
    url: '/merchant/set_bank_info',
    method: 'post',
    data
  })
}

export function getOldSmsCode() {
  return request({
    url: '/sms/get_code',
    method: 'get'
  })
}

export function getNewSmsCode(query) {
  return request({
    url: '/sms/get_mobile_code',
    method: 'get',
    params: query
  })
}

export function editMobile(data) {
  return request({
    url: '/merchant/edit_mobile',
    method: 'post',
    data
  })
}

export function rePassword(data) {
  return request({
    url: '/merchant/re_password',
    method: 'post',
    data
  })
}
