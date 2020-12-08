import request from '../utils/request'

//获取公司树
export const querryYearElement = (data) => {
    return request(`/api/querryYearElement?companyCode=${data.companyCode}&year=${data.year}`,{
        data
    })
}

export const query_evidence_attach = (data) => {
    return request(`/api/query_evidence_attach?id=${data.id}`,{
        data
    })
}
export const evidence = (data) => {
    return request(`/api/element_evidence`,{
        method: 'post',
        data
    })
}
export const addAll_evidence_attach = (data) => {
    return request(`/api/addAll_evidence_attach`,{
        method: 'post',
        data
    })
}
export const employees = () => {
    return request(`/api/employees`)
}
export const accidentOrEventUploadAddress=()=> {
    return request('/api/evidence_upload')
}

export const submitInputResult = (data) => {
    return request(`/api/submitInputResult?tableId=${data.tableID}&tag=${data.tag}`,{
        method: 'post',
    })
}
//一件批准
export const passAll = (data) => {
    return request(`/api/passAll?tableId=${data.tableID}&sourceId=${data.sourceID}`,{
        method: 'post',
    })
}
// export const UpdateComSysEleStatus = (data) => {
//     return request(`/api/updateComSysEleStatus`, {
//         method: 'put',
//         data
//     })
// }
//录入审核推送选择领导
export const sendMessage = (data) => {
    return request(`/api/sendMessage/${data.tag}?receiverId=${data.receiverId}`,{
        method: 'get',
        data
    })
}
//打回
export const callBack = (data) => {
    return request(`/api/callBack?tableId=${data.tableId}?sourceId=${data.sourceId}`,{
        method: 'get',
        data
    })
}
//选择领导
export const getReceiver = (data) => {
    return request(`/api/getReceiver?companyCode=${data.companyCode}&moduleCode=${data.moduleCode} `,{
        method: 'get',
        data
    })
}
//不涉及录入
export const notInvolve = (data) => {
    return request(`/api/notInvolve?elementId=${data.id}`,{
        method: 'get',
        data
    })
}