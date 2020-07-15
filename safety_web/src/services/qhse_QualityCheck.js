import request from '../utils/request'

export const getCompanyStatus = (params) => {
    return request(`/api/querryComSysEleStatus`, {
        params
    })
}
export const UpdateComSysEleStatus = (data) => {
    return request(`/api/updateComSysEleStatus`, {
        method: 'put',
        data
    })
}