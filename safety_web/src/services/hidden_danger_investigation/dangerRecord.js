import request from '@/utils/request'

export const addDangerRecord = (data) => {
    return request('/api/add_dangerrecord', {
        method: 'post',
        data
    })
}

export const QueryCompany = () =>{
    return request('/api/qhse_company/tree')
}



export const QueryFactor = (name) =>{
    return request(`/api/factor?name=${name}`)
}

export const QueryFactorDepartment = () =>{
    return request(`/api/factor_department`)
}

export const QueryFactorHSE = () =>{
    return request(`/api/factorhse_getall`)
}

export const QueryFactorObserver = () =>{
    return request(`/api/factorobserver_getall`)
}