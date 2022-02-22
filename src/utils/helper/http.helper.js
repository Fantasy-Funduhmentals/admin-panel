// First we need to import axios.js
import axios from "axios";
import { store } from "../../index";
// Next we make an 'instance' of it
const instance = axios.create({
  timeout: 20000, // request timeout
  baseURL: "https://main.blockmerchants.app/",
});

// request interceptor

instance.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("accessToken");
    // Do something before request is sent

    config.headers["Authorization"] = "bearer " + authToken;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Where you would set stuff like your 'Authorization' header, etc ...
// instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';

// Also add/ configure interceptors && all the other cool stuff

export default instance;
