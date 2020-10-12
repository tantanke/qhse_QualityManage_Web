import request from '../../utils/request'

//获取公司树
export const querryYearElement = (data) => {
    return request(`/api/quality_query_elementReviewer?companyCode=${data.companyCode}&year=${data.year}`,{
        data
    })
}

export const query_evidence_attach = (data) => {
    return request(`/api/quality_query_Attach?id=${data.id}`,{
        data
    })
}
export const addAll_evidence_attach = (data) => {
    return request(`/api/quality_input_element`,{
        method: 'post',
        data
    })
}
export const accidentOrEventUploadAddress=()=> {
    return request('/api/Quality_evidence_upload')
}

export const submitInputResult = (data) => {
    return request(`/api/submitInputResult?tableId=${data.tableID}&tag=${data.tag}`,{
        method: 'post',
    })
}
// export const UpdateComSysEleStatus = (data) => {
//     return request(`/api/updateComSysEleStatus`, {
//         method: 'put',
//         data
//     })
// }

