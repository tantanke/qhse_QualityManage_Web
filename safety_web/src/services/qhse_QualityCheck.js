import request from '../utils/request'

//获取公司树
export const querryYearElement = () => {
    return request(`/api/querryYearElement`)
}

export const element_evidence = (data) => {
    return request(`/api/element_evidence?code=${data.code}`,{
        data
    })
}
export const employees = () => {
    return request(`/api/emplopyees`)
}
// export const UpdateComSysEleStatus = (data) => {
//     return request(`/api/updateComSysEleStatus`, {
//         method: 'put',
//         data
//     })
// }

