import request from '@/utils/request'

export const problemVerification = (id,data) =>{
    return request(`/api/problemverification/${id}`,{
        method: 'put',
        data
    })
}

export const updateDangerrecord = (id,data) =>{
    return request(`/api/update_dangerrecord/${id}`,{
        method: 'put',
        data
    })
}


export const updateProblemDescription = (id,data) =>{
    return request(`/api/update_problemDescription/${id}`,{
        method: 'put',
        data
    })
}