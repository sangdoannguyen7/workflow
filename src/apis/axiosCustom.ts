import axios, { AxiosRequestConfig } from "axios";
import { constants } from "../common/common.constants.ts";
import ApiFallbackService from "./fallback.service";

const api = axios.create({
  baseURL: constants.BACKEND_HOST,
});

export interface IDataRequest {
  method: string;
  uri: string;
  params: object | string | null;
  data: object | null;
  type?: string | undefined;
}

export interface IDataResponse<T> {
  value: T;
  data: T[];
  total: number;
  totalPage: number;
  page: number;
  pageSize: number;
}

async function refreshToken(): Promise<string | null> {
  // const res = await axios({
  //   method: 'POST',
  //   url: constants.BACKEND_HOST+'/v1/pub/refresh',
  //   data: {
  //     "refreshToken": localStorage.getItem('refreshToken')
  //   }
  // })
  // if(res.status === 200) {
  //   localStorage.removeItem('accessToken');
  //   localStorage.removeItem('refreshToken');
  //   localStorage.setItem('accessToken', res.data.accessToken);
  //   localStorage.setItem('refreshToken', res.data.refreshToken);
  //   return res.data.accessToken
  // }
  // return null;
  return "accessTOken";
}

export async function axiosCustom<IDataResponse>(
  options: IDataRequest
): Promise<IDataResponse> {
  const responseType = options.type === undefined ? "" : "blob";
  let dataRequest: AxiosRequestConfig = {
    url: options.uri,
    method: options.method,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    params: options.params,
    data: options.data,
    responseType: responseType === "" ? undefined : "blob",
  };

  return ApiFallbackService.executeFallback(
    async () => {
      try {
        const response = await api.request<IDataResponse>({
          url: dataRequest.url,
          ...dataRequest,
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const response = error.response;
          if (response && response.status === 401) {
            const refreshedToken = await refreshToken();
            if (refreshedToken) {
              dataRequest = {
                ...dataRequest,
                headers: {
                  Authorization: `Bearer ${refreshedToken}`,
                },
              };
              const retryResponse = await api.request<IDataResponse>({
                url: dataRequest.url,
                ...dataRequest,
              });
              return retryResponse.data;
            }
          }
        }
        throw error;
      }
    },
    () => {
      // Fallback to mock data
      return ApiFallbackService.handleWorkflowRequests(
        options
      ) as IDataResponse;
    }
  );
}

export default axiosCustom;
