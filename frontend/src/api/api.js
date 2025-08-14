import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV_API
    : process.env.REACT_APP_PROD_API;

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
