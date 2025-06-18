import axios from "axios";
import { IAxiosCustom, IDataResponse } from "./axiosCustom";
import {constants} from "../common/common.constants.ts";

async function axiosFile(config: IAxiosCustom): Promise<IDataResponse> {
  let response: IDataResponse = await axios({
    method: config.method,
    url: constants.BACKEND_HOST+config.uri,
    headers: {
      "Content-type": "multipart/form-data",
    },
    params: config.params,
    data: config.data
  })
  .then(res => {
    response = {
      status: true,
      data: res.data
    }
    return response;
  })
  .catch(() => {
    const response: IDataResponse = {
      status: false,
      data: {msg: "Hình ảnh không được quá 5MB"}
    }
    return response;
  })
  return response as IDataResponse;
}

export default axiosFile;