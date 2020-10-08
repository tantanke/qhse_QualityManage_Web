import request from '@/utils/request'

export const addDangerRecord = (data) => {
    return request('/api/add_quality_dangerrecord', {
        method: 'post',
        data
    })
}

export const QueryCompany = () =>{
    return request('/api/qhse_company/tree')
}


export const QueryFactorObserver = () =>{
    return request(`/api/factorobserver_getall`)
}

export const QueryFactorHSE = () =>{
    return request(`/api/factorhse_getall`)
}
export const QueryFactor = (name) =>{
    return request(`/api/factor?name=${name}`)
}
//查询归属职能部门
export const QueryFactorDepartment = (data) =>{
    return request(`/api/factor_department_bycode/${data}`)
}

// 查询对应体系要素
export const QueryFactorHSECode = (data) =>{
    return request(`/api/factor_hse_bycode/${data}`)
}

// 查询原因
export const QueryFactorReason = (data) =>{
    return request(`/api/factor_source_bycode/${data}`)
}
