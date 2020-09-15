import request from '@/utils/request'

export const addRegulationRecord = (data) => {
    return request('/api/add_regulationrecord', {
        method: 'post',
        data
    })
}


export const QuerCompany = () =>{
    return request('/api/qhse_company/tree')
}

export const QueryFactor = (name) =>{
    return request(`/api/factor?name=${name}`)
}


//查询归属职能部门
export const QueryFactorDepartment = (data) =>{
    return request(`/api/factor_department_bycode/${data}`)
}

// 查询对应体系要素
export const QueryFactorHseCode = (data) =>{
    return request(`/api/factor_hse_bycode/${data}`)
}

// 查询原因
export const QueryFactorReason = (data) =>{
    return request(`/api/factor_source_bycode/${data}`)
}
// 查询安全沟通类型
export const QueryfactorObserverCode = (data) =>{
    return request(`/api/factor_observer_bycode/${data}`)
}