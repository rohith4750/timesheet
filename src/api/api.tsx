import axios from 'axios'

const baseURL = process.env.REACT_APP_API_ENDPOINT
// const mircoBaseURL = process.env.REACT_APP_API_MICRO_ENDPOINT

// Create an Axios instance
const instance = axios.create({
  baseURL, // Default base URL
  headers: {
    'Content-Type': 'application/json',
  },
})

// Set up interceptors to add Authorization header
instance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken')
    if (token) {
        if (!config.headers) {
          config.headers = {};
        }
        config.headers.Authorization = `Bearer ${token}`;
      }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
//set up WithCredentials
//instance.defaults.withCredentials = true
// Utility function to determine base URL
const getBaseUrl = (url:string, urlType:string) =>
  urlType === '0' ? `${baseURL}${url}` : `${baseURL}${url}`

/*instance.defaults.headers.common['Content-Type'] = 'application/json'

const fetchCreds = () => {
  // Set the AUTH token for any request
  instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token')
    console.info(token)
    config.headers.Authorization = token ? `Bearer ${token}` : ''
    return config
  })
  instance.defaults.withCredentials = true
}*/

export const getRequest = async ({ url, params, urlType }: any) => {
  //fetchCreds()
  let bUrl = getBaseUrl(url, urlType)
  const { data } = await instance.get(`${bUrl}`, { params: params })
  return data
}

export const postRequest = async ({ url, payload, urlType }: any) => {
  //fetchCreds()
  let bUrl = getBaseUrl(url, urlType)
  const { data } = await instance.post(`${bUrl}`, { ...payload })
  return data
}

export const putRequestUploadFile = async ({ url, payload }: any) => {
  //fetchCreds()
  const { data } = await instance.put(`${baseURL}${url}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export const postRequestUploadFile = async ({ url, payload, urlType }: any) => {
  //fetchCreds()
  let bUrl = getBaseUrl(url, urlType)
  const { data } = await instance.post(`${bUrl}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export const patchRequest = async ({ url, payload, urlType }: any) => {
  //fetchCreds()
  let bUrl = getBaseUrl(url, urlType)
  const { data } = await instance.patch(`${bUrl}`, { ...payload })
  return data
}

export const putRequest = async ({ url, payload, urlType }: any) => {
  //fetchCreds()
  let bUrl = getBaseUrl(url, urlType)
  const { data } = await instance.put(`${bUrl}`, { ...payload })
  return data
}

export const deleteRequest = async ({ url, payload, urlType }: any) => {
  //fetchCreds()
  let bUrl = getBaseUrl(url, urlType)
  const { data } = await instance.delete(`${bUrl}`, { ...payload })
  return data
}
