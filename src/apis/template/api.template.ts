import axiosCustom, { IDataRequest, IDataResponse } from "../axiosCustom";
import {
  ITemplate,
  ITemplateResponse,
  ITemplateSearchParams,
} from "../../interface/template.interface";
import { ITemplateApi } from "./api.template.interface";

class TemplateApi implements ITemplateApi {
  private readonly baseUrl = "/v1/property/templates";

  async getTemplates(
    params?: ITemplateSearchParams
  ): Promise<ITemplateResponse> {
    const request: IDataRequest = {
      method: "GET",
      uri: this.baseUrl,
      params: {
        agentCode: params?.agentCode || "",
        search: params?.search || "",
        sorter: params?.sorter || "",
        current: params?.current || 1,
        pageSize: params?.pageSize || 20,
      },
      data: null,
    };

    const response: IDataResponse<ITemplateResponse> = await axiosCustom(
      request
    );
    return response.value;
  }

  async getTemplateById(id: number): Promise<ITemplate> {
    throw new Error("API does not support getById, use getByCode instead");
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
    const response: IDataResponse<{ data: ITemplate }> = await axiosCustom(
      request
    );
    return response.value.data;
  }

  async updateTemplate(id: number, template: ITemplate): Promise<ITemplate> {
    const request: IDataRequest = {
      method: "PATCH",
      uri: `${this.baseUrl}/${template.templateCode}`,
      params: null,
      data: template,
    };
    const response: IDataResponse<{ data: ITemplate }> = await axiosCustom(
      request
    );
    return response.value.data;
  }

  async deleteTemplate(id: number): Promise<void> {
    throw new Error(
      "API does not support delete by ID, use deleteByCode instead"
    );
  }

  async getTemplateByCode(code: string): Promise<ITemplate> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/${code}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<{ data: ITemplate }> = await axiosCustom(
      request
    );
    return response.value.data;
  }

  async getTemplatesByAgent(agentCode: string): Promise<ITemplate[]> {
    const response = await this.getTemplates({ agentCode, pageSize: 1000 });
    return response.data;
  }

  async initializeTemplates(initializationCode: string): Promise<ITemplate[]> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/initialize`,
      params: { initializationCode },
      data: null,
    };
    const response: IDataResponse<{ data: ITemplate[] }> = await axiosCustom(
      request
    );
    return response.value.data;
  }
}

export default new TemplateApi();
