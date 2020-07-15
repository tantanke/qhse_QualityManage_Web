import request from '../utils/request'

export const GetRoleList = (params) => {
  return request('/api/roles', {
    params
  })
}

export const GetRoleDetail = (roleID) => {
  return request(`/api/roles/${roleID}`)
}

export const DeleteRole = (roleID) => { 
  return request(`/api/roles/${roleID}`, {
    method: 'delete'
  })
}

export const CreateRole = (data) => {
  return request('/api/roles', {
    method: 'post', 
    data
  })
}

export const UpdateRole = (roleID, data) => {
  return request(`/api/roles/${roleID}`, {
    method: 'put',
    data
  })
}
export const SelectRoleName = (params) => {
  return request('/api/roles', {
    params
  })
}