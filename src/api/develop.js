import request from '@/utils/request'

export function basic() {
  return request({
    url: '/develop/basic',
    method: 'get'
  })
}

export function init_appsecret(data) {
  return request({
    url: '/develop/init_appsecret',
    method: 'post',
    data
  })
}

export function editDevelopUrl(data) {
  return request({
    url: '/develop/edit_develop_url',
    method: 'post',
    data
  })
}

export function getArticel() {
  return request({
    url: '/develop/get_develop_article',
    method: 'get'
  })
}
