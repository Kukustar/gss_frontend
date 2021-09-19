<template>
  <div class="container" style="margin-top: 140px">
    <div class="row">

      <div class="col"/>

      <div class="col-6 col-xs-auto">
        <div class="login">
          <form :onsubmit="authUser">
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">Логин</label>
              <input v-model="login" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">Пароль</label>
              <input v-model="password" type="password" class="form-control" id="exampleInputPassword1">
            </div>
            <button type="submit" class="btn btn-primary" v-on:click="authUser">Войти</button>
          </form>
        </div>
      </div>

      <div class="col"/>

    </div>

  </div>
</template>
<script>

import { ref } from 'vue'
import { API_HOST } from '../constants'
import { JwtTokenWorker } from '../jwt-guard'
import { useRouter } from 'vue-router'

export default {
  setup () {
    const router = useRouter()

    const login = ref('')
    const password = ref('')

    const authUser = async (event) => {
      event.preventDefault()
      const response = await fetch(`${API_HOST}/api/token/`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: login.value,
          password: password.value
        })
      })

      if (response.status === 200) {
        const { access, refresh } = await response.json()

        const JWTGuard = new JwtTokenWorker()
        JWTGuard.updateAccessTokenContext(access)
        JWTGuard.updateRefreshTokenContext(refresh)
        await router.replace('/impound-lot')
      }
    }

    return {
      login,
      password,
      authUser
    }
  }
}
</script>
