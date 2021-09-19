import { API_HOST } from './constants'

export class JwtTokenWorker {
  constructor () {
    this.accessTokenLocalStorageKey = 'access'
    this.accessTokenExpireDateLocalStorageKey = 'expireDate'
    this.refreshTokenLocalStorageKey = 'refresh'
    this.refreshTokenExpireDateLocalStorageKey = 'expireRefreshTokenExpireDate'

    this.accessToken = this.getAccessToken()
    this.refreshToken = this.getRefreshToken()
    this.accessExipreDate = this.getAccessTokenExpireDate()
    this.refreshExpireDate = this.getRefreshTokenExpireDate()
  }

  /**
   *
   * @returns {string}
   */
  getAccessToken () {
    return localStorage.getItem(this.accessTokenLocalStorageKey)
  }

  /**
   *
   * @returns {string}
   */
  getRefreshToken () {
    return localStorage.getItem(this.refreshTokenLocalStorageKey)
  }

  /**
   *
   * @returns {Date}
   */
  getRefreshTokenExpireDate () {
    const unixExpireDate = localStorage.getItem(this.refreshTokenExpireDateLocalStorageKey)
    if (unixExpireDate === null) {
      return new Date()
    }

    return new Date(parseInt(unixExpireDate))
  }

  /**
   *
   * @returns {Date}
   */
  getAccessTokenExpireDate () {
    const unixExpireDate = localStorage.getItem(this.accessTokenExpireDateLocalStorageKey)
    if (unixExpireDate === null) {
      return new Date()
    }

    return new Date(parseInt(unixExpireDate))
  }

  /**
   *
   * @returns {boolean}
   */
  isAccessTokenValid () {
    if (this.accessToken === null) {
      return false
    }
    const nowDate = new Date()
    const dateDiff = this.getAccessTokenExpireDate() - nowDate

    return dateDiff > 0
  }

  /**
   *
   * @returns {boolean}
   */
  isRefreshTokenValid () {
    if (this.refreshToken === null) {
      return false
    }
    const nowDate = new Date()
    const dateDiff = this.getRefreshTokenExpireDate() - nowDate

    return dateDiff > 0
  }

  /**
   *
   * @param token
   */
  updateAccessTokenContext (token) {
    const nowDate = new Date()
    const expireDate = new Date(nowDate.getTime() + 5 * 60000)
    const unixExpireDate = +new Date(expireDate)
    localStorage.setItem(this.accessTokenLocalStorageKey, token)
    localStorage.setItem(this.accessTokenExpireDateLocalStorageKey, String(unixExpireDate))
  }

  /**
   *
   * @param token
   */
  updateRefreshTokenContext (token) {
    const nowDate = new Date()
    const refreshTokenExpireDate = new Date(nowDate.getTime() + 1440 * 60000)
    const unixRefreshTokenExpireDate = +new Date(refreshTokenExpireDate)
    localStorage.setItem(this.refreshTokenExpireDateLocalStorageKey, String(unixRefreshTokenExpireDate))
    localStorage.setItem(this.refreshTokenLocalStorageKey, token)
  }

  /**
   *
   * @param nextSuccessHook
   * @param nextFailHook
   * @returns {Promise<void>}
   */
  async updateTokens (nextSuccessHook = () => {}, nextFailHook = () => {}) {
    try {
      const result = await fetch(`${API_HOST}/api/token/refresh/`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refresh: this.getRefreshToken()
        })
      })
      const { access, refresh } = await result.json()
      if (typeof access === 'string' && typeof refresh === 'string') {
        this.updateAccessTokenContext(access)
        this.updateRefreshTokenContext(refresh)
        nextSuccessHook()
      } else {
        nextFailHook()
      }
    } catch (e) {
      nextFailHook()
    }
  }

  /**
   *
   */
  clearTokens () {
    localStorage.removeItem(this.accessTokenLocalStorageKey)
    localStorage.removeItem(this.refreshTokenLocalStorageKey)
    localStorage.removeItem(this.accessTokenExpireDateLocalStorageKey)
    localStorage.removeItem(this.refreshTokenExpireDateLocalStorageKey)
  }
}

/**
 *
 * @param to -  path to route
 * @param from - path from route
 * @param next - function call next route
 */
export default function jwtGuard (to, from, next) {
  const JWTGuard = new JwtTokenWorker()
  const isAccessAndRefreshValid = JWTGuard.isAccessTokenValid() && JWTGuard.isRefreshTokenValid()

  const isGoNotToLogin = to.name !== 'Login'
  if (to.path === '/') {
    next()
  } else if (isGoNotToLogin && isAccessAndRefreshValid) {
    JWTGuard.updateTokens(() => next(), () => next({ name: 'Login' }))
  } else next()
}
