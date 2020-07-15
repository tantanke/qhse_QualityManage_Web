import request from '../utils/request'

export const SignIn = (data) => {
  return request('/api/login', {
    method: 'post',
    data
  })
}