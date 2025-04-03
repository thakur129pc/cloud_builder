export enum API {
  LOCAL_URL = 'http://localhost:8000/',
  LIVE_URL = import.meta.env.VITE_API_URL,
  STG_URL = 'http://35.169.229.171:5002/api/v1/',
  API_AUTH = import.meta.env.VITE_API_URL_AUTH,
  API_CB = import.meta.env.VITE_API_URL_CB,
}
