import request from '../utils/request'
//根据用户角色获取导航栏
export const getModule = (data) => {
    return request('/api//selectModule/'+data.type, {
      method: 'get'
    })
  }
export const logout=()=>{
  return request('/api/logout',{method:'post'})
} 

export const GetNaviByUserRole = () => {
  return request('/api/menu_module', {
    method: 'get'
  })
}