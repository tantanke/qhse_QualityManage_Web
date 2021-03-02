import Vue from 'vue'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

// set default config
VueCookies.config('15d')

const USER_KEY = 'store-current-user'
let currentUser = null

export const GetCurrentUser = () => {

  if (currentUser) {
    return currentUser
  }
  //let lsUser = sessionStorage.getItem(USER_KEY)

  let lsUser = VueCookies.get(USER_KEY)
  if (lsUser) {
    //let user = JSON.parse(lsUser)
	let user = lsUser
    currentUser = user
    return user
  }

  return null
}

export const SetCurrentUser = (user) => {
  currentUser = user
  //sessionStorage.setItem(USER_KEY, JSON.stringify(user))
  VueCookies.set(USER_KEY, JSON.stringify(user))
}

export const ClearCurrentUser = () => {
  currentUser = null
  //sessionStorage.removeItem(USER_KEY)
  VueCookies.remove(USER_KEY)
}

export default {
  get: GetCurrentUser,
  set: SetCurrentUser,
  clear: ClearCurrentUser
}

