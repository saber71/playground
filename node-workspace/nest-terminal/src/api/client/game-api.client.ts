import { Injectable } from "@nestjs/common";
import { Axios, AxiosInstance } from "axios";
import { LocalConfigService } from "../../shared/configs/local-config.service";
import { UIService } from "../../ui/ui.service";

@Injectable()
export class GameApiClient {
  private readonly _request: AxiosInstance;

  constructor(
    readonly config: LocalConfigService,
    readonly ui: UIService,
  ) {
    //@ts-ignore
    this._request = new Axios({
      baseURL: config.getBaseBackendUrl(),
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

    this._request.interceptors.request.use((req) => {
      if (config.getToken()) req.headers["Authorization"] = config.getToken();
      req.headers["enable-auth"] = "true";
      return req;
    });
    this._request.interceptors.response.use((res) => {
      if (res.status >= 300) return Promise.reject(res);
      return res;
    });
  }

  async post<T>(url: string, body?: object): Promise<T> {
    return this._request.post(url, body).then((res) => res.data);
  }

  async get<T>(url: string, query?: Record<string, any>): Promise<T> {
    return this._request.get(url, { params: query }).then((res) => res.data);
  }
}
