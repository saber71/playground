import { useTokenStore } from "@/stores/useToken.ts";
import { Axios } from "axios";

export const request = new Axios({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  transformRequest: [
    function (data) {
      if (typeof data === "object" && data) return JSON.stringify(data);
      return data;
    },
  ],
  transformResponse: [
    function (data) {
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    },
  ],
});

request.interceptors.request.use((req) => {
  const useToken = useTokenStore();
  if (useToken.token) req.headers["Authorization"] = useToken.token;
  return req;
});

request.interceptors.response.use((res) => {
  if (res.status >= 300) return Promise.reject(res);
  return res;
});
