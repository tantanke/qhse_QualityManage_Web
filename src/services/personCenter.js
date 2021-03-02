import request from '../utils/request'
export const GetTasksList = (params) => {
    return request('/api/tasks/PublishID', {
      params
    })
  }

  // export const GetComplateTasksList = (params) => {
  //   return request('/api/tasks/LeaderID', {
  //     params
  //   })
  // }
//获取我编制的计划
  export const Getmyplans = (params) => {
    return request('/api/current_person_plan', {
      params
    })
  }
  //获取我编制的执行中和完成状态的计划
  export const Getmyplan = (params) => {
    return request('/api/current_plan', {
      params
    })
  }


  export const GetComplateTasksList = (params) => {
    return request('/api/person_task', {
      params
    })
  }
//根据id查询个人任务
  export const GetPersonTaskdetail= (id) => {
    return request(`/api/person_task/${id}`)
  }

//根据id获取单个计划详情
export const GetPersonPlandetail= (id) => {
  return request(`/api/plan_detail/${id}`)
}

  
//根据ID获取一个员工
export const GetStaffDetail = () => {
  return request(`/api/my_employee_management`)
}
//根据ID更新一个员工
export const UpdateStaff = (data) => {
  return request(`/api/my_employee_management`, {
    method: 'put',
    data
  })
}
  

  //个人问题
export const GetPersonalProblemList = (params) => {
  return request('/api/my_problems', {
    params
  })
}
//个人问题详情
export const GetPersonalProblemDetail = (id) => {
  return request(`/api/my_problems/${id}`)
}
//更新问题
export const UpdateRectifyProblem = (id, data) => {
  return request(`/api/rect_problems/${id}`, {
    method: 'put',
    data
  })
}
//更新问题
export const UpdateVerifyProblem = (id, data) => {
  return request(`/api/verify_problems/${id}`, {
    method: 'put',
    data
  })
}