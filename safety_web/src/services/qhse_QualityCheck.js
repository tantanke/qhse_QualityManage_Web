import request from '../utils/request'

//获取公司树
export const querryYearElement = (data) => {
    return request(`/api/querryYearElement?companyCode=${data.companyCode}&year=${data.year}`,{
        data
    })
}

export const element_evidence = (data) => {
    return request(`/api/element_evidence?code=${data.code}`,{
        data
    })
}
export const evidence = (data) => {
    return request(`/api/element_evidence`,{
        method: 'post',
        data
    })
}
export const element_evidence_attach = (data) => {
    return request(`/api/element_evidence_attach`,{
        method: 'post',
        data
    })
}
export const employees = () => {
    return request(`/api/employees`)
}
// export const UpdateComSysEleStatus = (data) => {
//     return request(`/api/updateComSysEleStatus`, {
//         method: 'put',
//         data
//     })
// }

