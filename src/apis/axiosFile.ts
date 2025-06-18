import axiosCustom, { IDataRequest, IDataResponse } from "./axiosCustom.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function uploadFile(file: any): Promise<IDataResponse<any>> {
  const request: IDataRequest = {
    method: "POST",
    uri: "/v1/medias",
    params: null,
    data: file,
    type: "multipart",
  };
  const data: IDataResponse<any> = await axiosCustom(request);
  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function downloadFile(fileName: string): Promise<any> {
  try {
    const request: IDataRequest = {
      method: "GET",
      uri: `/v1/medias/download/${fileName}`,
      params: null,
      data: null,
      type: "file",
    };
    const data: IDataResponse<any> = await axiosCustom(request);
    return data;
  } catch {
    const request: IDataRequest = {
      method: "GET",
      uri: `/v1/medias/download/${fileName}`,
      params: null,
      data: null,
    };
    const data: IDataResponse<any> = await axiosCustom(request);
    return data;
  }
}
