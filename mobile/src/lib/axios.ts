// cliente http

import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.80.10:3333",
});
