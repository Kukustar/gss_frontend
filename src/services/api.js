import { JwtTokenWorker } from '../jwt-guard'

/**
 *
 * @param apiRequest
 * @param logout
 * @returns {Promise<*>}
 * @constructor
 */
async function JWTGuardDecorator (apiRequest, logout) {
  const JWTGuard = new JwtTokenWorker()
  try {
    if (!JWTGuard.isRefreshTokenValid()) {
      logout()
    }
    if (!JWTGuard.isAccessTokenValid() && JWTGuard.isRefreshTokenValid()) {
      await JWTGuard.updateTokens()
    }
    return await apiRequest(() => JWTGuard.getAccessToken(), () => JWTGuard.clearTokens())
  } catch (e) {
    console.info(e)
  }
}

const ApiService = {
  /**
   *
   * @param url
   * @param query
   * @param router
   * @returns {Promise<void>}
   */
  async get (url, query, router) {
    return await JWTGuardDecorator(async function (getAccessToken, clearTokens) {
      const res = await fetch(`${url}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      })
      const { status, statusText } = res
      if (status === 401 && statusText === 'Unauthorized') {
        clearTokens()
        router.push('/login')
      }
      return await res.json()
    }, () => router.push('/login'))
  },
  async post (url, data, router) {
    return await JWTGuardDecorator(async function (getAccessToken, clearTokens) {
      const res = await fetch(`${url}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const { status, statusText } = res
      if (status === 401 && statusText === 'Unauthorized') {
        clearTokens()
        router.push('/login')
      }
      return await res.json()
    }, () => router.push('/login'))
  },
  async delete (url, id, router) {
    return JWTGuardDecorator(async function (getAccessToken, clearTokens) {
      const res = await fetch(`${url}${id}/`, {
        method: 'delete',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json'
        }
      })
      const { status, statusText } = res
      if (status === 401 && statusText === 'Unauthorized') {
        clearTokens()
        router.push('/login')
      }
      return await res.json()
    }, () => router.push('/login'))
  }
}

export default ApiService
