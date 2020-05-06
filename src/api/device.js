import request from '@/utils/request'

export function edit_device(data) {
  return request({
    url: '/device/edit_device',
    method: 'post',
    data
  })
}

export function get_device(query) {
  return request({
    url: '/device/get_device',
    method: 'get',
    params: query
  })
}

export function get_template(id) {
  return request({
    url: '/device/template_detail',
    method: 'post',
    data: { id }
  })
}

export function edit_template(data) {
  return request({
    url: '/device/edit_template',
    method: 'post',
    data
  })
}

export function get_category(query) {
  return request({
    url: '/device/get_category',
    method: 'get',
    params: query
  })
}

export function get_address(query) {
  return request({
    url: '/device/get_address',
    method: 'get',
    params: query
  })
}

export function get_scene(query) {
  return request({
    url: '/device/get_scene',
    method: 'get',
    params: query
  })
}

export function add_device(data) {
  return request({
    url: '/device/add_device',
    method: 'post',
    data
  })
}

