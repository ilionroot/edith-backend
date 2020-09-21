import axios from "axios";

const api = axios.create({
  baseURL: `https://edithdafelicidade-backend.herokuapp.com/`,
});

export default api;
