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


export const QueryFactorHSE = () =>{
    return request(`/api/factorhse_getall`)
}

export const QueryFactorObserver = () =>{
    return request(`/api/factorobserver_getall`)
}

export const QueryFactorSource = () =>{
    return request(`/api/factorsource_getall`)
}

export const QueryFactorDepartment = () =>{
    return request(`/api/factor_department`)
}
