import axiosCustom, { IDataRequest, IDataResponse } from "../axiosCustom";
import {
  ITemplate,
  ITemplateResponse,
  ITemplateSearchParams,
  ITemplateRequest,
  ITemplateValueResponse,
} from "../../interface/template.interface";

class TemplateApi {
  private readonly baseUrl = "/v1/property/templates";

  async getTemplates(
    params?: ITemplateSearchParams
  ): Promise<ITemplateResponse> {
    const request: IDataRequest = {
      method: "GET",
      uri: this.baseUrl,
      params: params || {},
      data: null,
    };

    const response: IDataResponse<ITemplateResponse> = await axiosCustom(
      request
    );
    return response.value;
  }

  async getTemplateById(id: number): Promise<ITemplate> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/${id}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<ITemplateValueResponse> = await axiosCustom(
      request
    );
    return response.value.data;
  }

  async getTemplateByCode(code: string): Promise<ITemplate> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/${code}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<ITemplateValueResponse> = await axiosCustom(
      request
    );
    return response.value.data;
  }

  async createTemplate(templateRequest: ITemplateRequest): Promise<ITemplate> {
    const request: IDataRequest = {
      method: "POST",
      uri: this.baseUrl,
      params: null,
      data: templateRequest,
    };
    const response: IDataResponse<ITemplateValueResponse> = await axiosCustom(
      request
    );
    return response.value.data;
  }

  async updateTemplate(
    templateCode: string,
    templateRequest: ITemplateRequest
  ): Promise<ITemplate> {
    const request: IDataRequest = {
      method: "PUT",
      uri: `${this.baseUrl}/${templateCode}`,
      params: null,
      data: templateRequest,
    };
    const response: IDataResponse<ITemplateValueResponse> = await axiosCustom(
      request
    );
    return response.value.data;
  }

  async deleteTemplate(templateCode: string): Promise<void> {
    const request: IDataRequest = {
      method: "DELETE",
      uri: `${this.baseUrl}/${templateCode}`,
      params: null,
      data: null,
    };
    await axiosCustom(request);
  }

  async getTemplatesByAgent(agentCode: string): Promise<ITemplate[]> {
    const request: IDataRequest = {
      method: "GET",
      uri: this.baseUrl,
      params: { agentCode, size: 1000 },
      data: null,
    };
    const response: IDataResponse<ITemplateResponse> = await axiosCustom(
      request
    );
    return response.value.content;
  }
}

const templateApi = new TemplateApi();
export default templateApi;
