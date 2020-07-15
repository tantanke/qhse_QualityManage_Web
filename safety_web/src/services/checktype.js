import request from '../utils/request'

//获取所有信息
export const GetCheckTypeList = (params) => {
    return request('/api/checkType', {
      params
    })
  }


//根据checkTypeName进行模糊查询及查询所有
export const GetCheckType =(id,data)=>{
    return request('/api/checkType',{
        method: 'get',
        data
    })
}

//增加一条检查类型记录
export const InsertCheckType =(data)=>{
    return request('/api/checkType',{
        method: 'post',
        data
    })
}


//获取一条ID的信息
export const GetCheckTypeDetail = (id) => {
    return request(`/api/checkType/${id}`,{
        method: 'get'
    })
  }



//更新一条检查类型记录
// export const UpdateCheckType =(id , data)=>{
//     return request('/api/checkType',{
//         method: 'put',
//         data
//     })
// }
//更新一条检查类型记录
export const UpdateCheckType =(id,data)=>{
    return request(`/api/checkType/${id}`,{
        method: 'put',
        data
    })
}


//删除一条检查类型记录
  export const DeleteCheckType = (id) => { 
    return request(`/api/checkType/${id}`, {
      method: 'delete'
    })
  }

  //task中的删除方法
//   export const DeleteTask = (id) => { 
//     return request(`/api/tasks/${id}`, {
//       method: 'delete'
//     })
//   }

//  /api/tasks/id
//  http://154.8.193.93:8080/wlhse/api/v1/checkType