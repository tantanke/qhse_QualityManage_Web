import request from '@/utils/request'

export const problemVerification = (id,data) =>{
    return request(`/api/quality_problemverification/${id}`,{
        method: 'put',
        data
    })
}

export const updateDangerrecord = (id,data) =>{
    return request(`/api/update_quality_dangerrecord/${id}`,{
        method: 'put',
        data
    })
}


export const updateProblemDescription = (id,data) =>{
    return request(`/api/update_quality_problemDescription/${id}`,{
        method: 'put',
        data
    })
}