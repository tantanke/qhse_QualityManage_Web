import request from '../utils/request'

//获取员工信息列表
export const GetStaffList = (params) => {
  return request('/api/employee_management', {
    params
  })
}

//新增员工
export const CreateStaff = (data) => {
  return request('/api/employee_management', {
    method: 'post', 
    data
  })
}

//根据ID删除员工
export const DeleteStaff = (id) => { 
    return request(`/api/employee_management/${id}`, {
      method: 'delete'
    })
  }

//根据ID更新一个员工
export const UpdateStaff = (id, data) => {
  return request(`/api/employee_management/${id}`, {
    method: 'put',
    data
  })
}

//根据ID获取一个员工
export const GetStaffDetail = (id) => {
  return request(`/api/employee_management/${id}`)
  
}
//注册员工
export const RegisterStaff = (id,data) => {
  return request(`/api/register/${id}`, {
    method: 'post', 
    data
  })
}

//获取角色

export const GetRoleDetail = (id) => {
  return request(`/api/employee_management/role_code/${id}`,{
    method: 'get', 
  })  
}

//角色更新
export const UpdateRoleDetail = (id,data) => {
  return request(`/api/employee_management/role_code/${id}`,{
    method: 'put', 
    data
  })  
}
//重置密码
export const reset = (data) => {
  return request('/api/reset_pwd',{
    method: 'put', 
    data
  })  
}