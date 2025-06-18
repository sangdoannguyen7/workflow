import axiosCustom, { IDataRequest, IDataResponse } from "../axiosCustom";
import {
  ITemplate,
  ITemplateResponse,
  ITemplateSearchParams,
} from "../../interface/template.interface";
import { ITemplateApi } from "./api.template.interface";

class TemplateApi implements ITemplateApi {
  private readonly baseUrl = "/api/templates";

  async getTemplates(
    params?: ITemplateSearchParams
  ): Promise<ITemplateResponse> {
    const request: IDataRequest = {
      method: "GET",
      uri: this.baseUrl,
      params: params || null,
      data: null,
    };
    const response: IDataResponse<ITemplate> = await axiosCustom(request);
    return {
      content: response.data,
      totalElements: response.total,
      totalPages: response.totalPage,
      size: response.pageSize,
      number: response.page,
    };
  }

  async getTemplateById(id: number): Promise<ITemplate> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/${id}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<ITemplate> = await axiosCustom(request);
    return response.value;
  }

  async createTemplate(
    template: Omit<ITemplate, "templateId">
  ): Promise<ITemplate> {
    const request: IDataRequest = {
      method: "POST",
      uri: this.baseUrl,
      params: null,
      data: template,
    };
    const response: IDataResponse<ITemplate> = await axiosCustom(request);
    return response.value;
  }

  async updateTemplate(id: number, template: ITemplate): Promise<ITemplate> {
    const request: IDataRequest = {
      method: "PUT",
      uri: `${this.baseUrl}/${id}`,
      params: null,
      data: template,
    };
    const response: IDataResponse<ITemplate> = await axiosCustom(request);
    return response.value;
  }

  async deleteTemplate(id: number): Promise<void> {
    const request: IDataRequest = {
      method: "DELETE",
      uri: `${this.baseUrl}/${id}`,
      params: null,
      data: null,
    };
    await axiosCustom(request);
  }

  async getTemplateByCode(code: string): Promise<ITemplate> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/code/${code}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<ITemplate> = await axiosCustom(request);
    return response.value;
  }

  async getTemplatesByAgent(agentCode: string): Promise<ITemplate[]> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/agent/${agentCode}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<ITemplate> = await axiosCustom(request);
    return response.data;
  }
}

export default new TemplateApi();
