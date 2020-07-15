import request from '../utils/request'
//根据用户角色获取导航栏
export const GetNaviByUserRole = () => {
    return request('/api/menu_module', {
      method: 'get'
    })
  }