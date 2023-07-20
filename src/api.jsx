import axios from "axios";

const instance = axios.create({
  //   baseURL: `${process.env.REACT_APP_MIDDLEWARE_DEV_BASE_URL}`,
  baseURL: `http://localhost:8080/`,
});
export default instance;
