import request from '@/utils/request'

export const querryQhseElement = (obj) => {
    return request(`/api/querryQhseElements/${obj.queryStatus}`)
}