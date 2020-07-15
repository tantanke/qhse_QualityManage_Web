import request from '@/utils/request'

export const addAccident = ({date, address, emergencyHandler, briefDescription, fileID}) => {
    return request('/api/add_accident', {
        method: 'post',
        data: {
            occurrentTime: date,
            address: address,
            emergencyHandler: emergencyHandler,
            briefDescription: briefDescription,
            fileID: fileID
        }
    })
}

export const addEvent = ({date, address, emergencyHandler, briefDescription, fileID}) => {
    return request('/api/add_event', {
        method: 'post',
        data: {
            occurrentTime: date,
            address: address,
            emergencyHandler: emergencyHandler,
            briefDescription: briefDescription,
            fileID: fileID
        }
    })
}
