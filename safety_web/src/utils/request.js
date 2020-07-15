import axios from 'axios'
import router from '../router'
import  {GetCurrentUser, ClearCurrentUser} from '../store/CurrentUser'
import {HttpResponseCode} from '../const/resCode'

const CODE_MESSAGE =  {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}

const HandleAuthFailed = () => {
  ClearCurrentUser()
  return router.push({name: 'Login'})
}

export default (url, options={}) => {
  const defaultOptions = {
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8'
    }
  }
  const newOptions = {...defaultOptions, ...options, url}
  let user = GetCurrentUser()
  if (user) {
    newOptions.headers = {...newOptions.headers, Authorization: user.token}
  }
  return new Promise((resolve, reject) => {
    axios(newOptions).then((response) => {
      if (response.data.code === HttpResponseCode.invalid) {
        console.log(JSON.stringify(newOptions))
        console.log(JSON.stringify(response))
        HandleAuthFailed()
      }
      if (response.data.code === HttpResponseCode.success) {
        return resolve(response.data)
      }
      if (!response.data.code) {
        return reject({
          code: 2001,
          message: '服务端返回的数据格式不规范,无法解析'
        })
      }
      return reject({
        code: response.data.code,
        message: response.data.message
      })
    }).catch((error) => {
      const errStatus = error.response.status
      return reject({
        code: errStatus,
        message: CODE_MESSAGE[errStatus]
      })
    })
  })
}