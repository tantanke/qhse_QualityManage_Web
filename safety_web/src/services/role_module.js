import request from '../utils/request'

export const GetRoleTree = (params) => {
    return request(`/api/role_module/tree`,{
        params
    })
  }

export const GetModuleTree = () => {
    return request(`/api/module/tree`)
}

export const UpdateRoleTree = (data) => {
    return request(`/api/role_module`, {
        method: 'put',
        data
    })
}

export const GetRoleNodeId = (params) => {
    return request(`/api/role_module/node`, {
        method: 'get',
        params
    })
}