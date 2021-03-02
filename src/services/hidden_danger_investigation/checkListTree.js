import request from '@/utils/request'

export const GetCheckListTree = () => {
    return request('/api/check_list_tree')
  }