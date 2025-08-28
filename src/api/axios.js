import axios from 'axios'
import qs from 'qs'

const baseURL = switchDevBaseUrl(import.meta.env.VITE_EXCUTION_MODE)

function switchDevBaseUrl(devMode) {
  switch (devMode) {
    case 'DEV':
      return null

    case 'PROD':
      return import.meta.env.VITE_PROD_URL
  }
}

const axiosRequest = axios.create({
  baseURL, // dev 不使用, prod 使用
  headers: {
    // 改為 json 可以不用再指定 content-type 就可以傳送檔案 new FormData
    'Content-Type': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded'
  },
  withCredentials: true,
  timeout: 60 * 1000
})

axiosRequest.all = axios.all
axiosRequest.spread = axios.spread

axiosRequest.interceptors.request.use(
  (config) => {
    // if (sessionStorage['']) {
    //   config.headers.Authorization = 'Bearer ' + sessionStorage['']
    // }

    const ContentType = config.headers['Content-Type']
    // ------------解决方法--------------------------------------------------
    switch (ContentType) {
      case 'application/x-www-form-urlencoded':
        switch (config.method) {
          case 'get':
            config.params = {
              ...config.params
            }
            break

          // case 'put':
          //   config.params = {
          //     ...config.params
          //   }
          //   break

          default:
            // {delete、patch、post}

            config.data = qs.stringify({
              ...config.data
            })

            config.data = qs.stringify({
              // AccessToken: router.currentRoute.query.token,
              // TOKEN: window.localStorage['TOKEN'],
              // 解除五層後陣列轉出問題 2021-01-27 { depth: Number.MAX_SAFE_INTEGER,parameterLimit:Number.MAX_SAFE_INTEGER }
              ...qs.parse(config.data, {
                depth: Number.MAX_SAFE_INTEGER,
                parameterLimit: Number.MAX_SAFE_INTEGER
                // arrayLimit: Number.MAX_SAFE_INTEGER,
              })
            })
            break
        }
        break

      case 'multipart/form-data':
        if (!(config.data instanceof FormData)) {
          // if (!config.data) {
          break
        }

        // config.data.append('TOKEN', window.localStorage['TOKEN'])
        break

      default:
        break
    }

    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

axiosRequest.interceptors.response.use(
  (response) => {
    // console.log(response)
    // if (response.data.code === '52') {
    //   alert('token失效，請重新登入')
    // } else if (response.data.code === 100) {
    //   alert('請求資料失敗，請重新整理頁面')
    // }
    return response
  },
  (error) => {
    try {
      if (error.response.status === 500 || error.response.status === 404) {
        // 若遇到error 500 就跳出提醒
        alert('請求資料失敗，請重新整理頁面')
        // alert('伺服器發生錯誤，請聯繫相關單位進行處理！')
        // 權限
      } else if (error.response.status == 401) {
        // if (router.currentRoute.name !== 'signIn') {
        //   console.log(123)
        //   localStorage.clear()
        //   router.push('/')
        // }
      } else {
        console.log(error.response)
      }
    } catch (e) {
      console.log(e)
    }
    return Promise.reject(error)
  }
)

export default axiosRequest
