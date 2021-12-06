<template>
  <div class="login">
    <form @submit.prevent="onSubmit">
      <div>
        <label for="user">Username</label>
        <input
          v-model="user"
          name="user"
        >
      </div>
      <div>
        <label for="password">Password</label>
        <input
          v-model="password"
          type="password"
          name="password"
        >
      </div>
      <div>
        <button class="oui-button oui-button_ghost">
          Login
        </button>
      </div>
    </form>
    <div>
      {{ error }}
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import router from '../router'
import utils from '../services/utils.js'

export default {
  name: 'Login',
  data () {
    return {
      user: '',
      password: '',
      error: '',
      loginLocation: process.env.VUE_APP_LOGIN_LOCATION
    }
  },
  methods:
  {
    onSubmit () {
      const data = new FormData()
      data.append('user', this.user)
      data.append('password', this.password)

      const inOneHour = 1 / 24

      axios.post(this.loginLocation, data).then(response => {
        const token = response.data
        utils.setTokenInCookie(token, inOneHour)
        router.go()
      }).catch(error => {
        this.error = error
      })
    }
  }

}
</script>
