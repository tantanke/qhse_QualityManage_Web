<template lang="pug">
  session-layout
    .login-base
      .title
        //- img.logo(:src='imgs.Logo')
        font QHSE管理系统
      br
      el-form(:model='formData', @submit.native.prevent="handleSignIn")
        el-form-item(prop='userName', :rules="{required: true, message: '必填', trigger: 'blur'}")
          el-input(v-model='formData.userName', placeholder='账号', size='large')
            template(slot="prefix")
              .prefix-content
                img(:src='imgs.IconUser')
        el-form-item(prop='psw', :rules="{required: true, message: '必填', trigger: 'blur'}")
          el-input(v-model='formData.psw', type='password', placeholder='密码', size='large')
            template(slot="prefix")
              .prefix-content
                img.input-img(:src='imgs.IconPassword')
        el-form-item 
          el-button(type='primary', size='large', native-type="submit", :loading='submiting', plain, style="width: 100%;" ) 登&nbsp;&nbsp;录
</template>

<script>
import SessionLayout from '../components/SessionLayout.vue'
import CurrentUser from '../store/CurrentUser'
import {SignIn} from '../services/session'
import IconUser from '../assets/icons/user.svg'
import IconPassword from '../assets/icons/password.svg'
import Logo from '../assets/resources/logo.jpg'

export default {
  components: {
    SessionLayout
  },
  data () {
    return {
      submiting: false,
      formData: {
        userName: '',
        psw: ''
      },
      imgs: {
        Logo,
        IconUser,
        IconPassword
      }
    }
  },
  mounted() {
       localStorage.removeItem('dangerSource')
       localStorage.removeItem('regulationSource')
       localStorage.removeItem('checkType')
       localStorage.removeItem('sourcedata')
       
    },
  methods: {
    handleSignIn () {
      // CurrentUser.set({userName: 'amanager'})
      // this.$router.push({name: 'Home'})
      console.log(JSON.stringify(this.formData))
      SignIn(this.formData).then((res) => {
        CurrentUser.set(res.data)
        localStorage.removeItem('sysCate')
        this.$router.push({name: 'mainPath'})
        console.log('进入页面')
      }).catch((err) => {
        this.$message.error(err.message)
        
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.login-base {
  background: #FFFFFF;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 10px 40px 0 rgba(0, 13, 97, 0.2);
  width: 100%;
  max-width: 400px;

  .title {
    padding: 15px 0px;
    font-size: 24px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}

.prefix-content {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px 3px;

  img {
    height: 16px;
  }
}

img.logo {
  height: 30px;
  margin-right: 10px;
}
</style>
