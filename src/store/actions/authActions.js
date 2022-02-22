import axios from "axios";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  VERIFY_REQUEST,
  VERIFY_SUCCESS,
} from "./actionTypes";
import panelConfig from "../../panel.config";

const API_URL = panelConfig.API_URL;

const requestLogin = () => {
  return {
    type: LOGIN_REQUEST,
  };
};

const receiveLogin = (user) => {
  return {
    type: LOGIN_SUCCESS,
    user,
  };
};

const loginError = () => {
  return {
    type: LOGIN_FAILURE,
  };
};

const requestLogout = () => {
  return {
    type: LOGOUT_REQUEST,
  };
};

const receiveLogout = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
};

const verifyRequest = () => {
  return {
    type: VERIFY_REQUEST,
  };
};

const verifySuccess = () => {
  return {
    type: VERIFY_SUCCESS,
  };
};

export const userLogIn = (email, password) => (dispatch) => {
  // User Log In Logic
  console.log("email/ password", email, password);
  dispatch(requestLogin());
  axios({
    method: "post",
    url: `${API_URL}/admin-auth/login`,
    data: {
      email: email,
      password: password,
    },
  })
    .then((response) => {
      console.log(response);
      localStorage.setItem("accessToken", response.data.accessToken);
      dispatch(receiveLogin(response.data.accessToken));
    })
    .catch((error) => {
      console.log("Login Error: ", error);
      dispatch(loginError());
    });
};

export const userLogout = () => async (dispatch) => {
  // User Log Out Logic
  await dispatch(requestLogout());
  await localStorage.clear();
  await dispatch(receiveLogout());
};

export const verifyAuth = () => (dispatch) => {
  // Verify User on Reload Logic
  dispatch(verifyRequest());
  if (localStorage.getItem("accessToken")) {
    dispatch(receiveLogin());
  }
  dispatch(verifySuccess());
};
