import axios from 'axios';
import { API } from '../apiconfig';
import { jwtDecode } from 'jwt-decode';

const fetchAuthToken = async (access_token: string, refresh_token: string) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token,
      refresh_token,
    }),
  };
  try {
    const response = await fetch(
      API.API_AUTH + 'refresh-token',
      requestOptions
    );
    // const response = await fetch(API.LOCAL_URL + "refresh-token");
    const result = await response.json();
    console.log('this res refresh token result', result);
    const decodedData = jwtDecode(result.data.access_token);
    localStorage.setItem(
      'authObj',
      JSON.stringify({ ...result.data, refresh_token })
    );
    localStorage.setItem('userObj', JSON.stringify(decodedData));
    return result.data.access_token;
  } catch (error) {
    console.log('error in refresh token', error);
  }
};

axios.interceptors.request.use(
  async function (config) {
    // console.log("interceptor start");

    const authObjString = localStorage.getItem('authObj');
    const userObjString = localStorage.getItem('userObj');

    if (authObjString) {
      const authObj = JSON.parse(authObjString);
      // console.log("authObj", authObj);

      if (userObjString) {
        const userObj = JSON.parse(userObjString);
        // console.log("userObj", userObj);

        const timeDiff = userObj?.exp * 1000 - Date.now();
        // console.log("this is timeDiff", timeDiff);

        if (timeDiff < 120000) {
          const token = await fetchAuthToken(
            authObj.access_token,
            authObj.refresh_token
          );
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axios;
