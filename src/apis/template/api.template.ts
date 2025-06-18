import { AxiosResponse } from "axios";
import axiosCustom from "../axiosCustom";
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
    const response: AxiosResponse<ITemplateResponse> = await axiosCustom.get(
      this.baseUrl,
      { params }
    );
    return response.data;
  }

  async getTemplateById(id: number): Promise<ITemplate> {
    const response: AxiosResponse<ITemplate> = await axiosCustom.get(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }

  async createTemplate(
    template: Omit<ITemplate, "templateId">
  ): Promise<ITemplate> {
    const response: AxiosResponse<ITemplate> = await axiosCustom.post(
      this.baseUrl,
      template
    );
    return response.data;
  }

  async updateTemplate(id: number, template: ITemplate): Promise<ITemplate> {
    const response: AxiosResponse<ITemplate> = await axiosCustom.put(
      `${this.baseUrl}/${id}`,
      template
    );
    return response.data;
  }

  async deleteTemplate(id: number): Promise<void> {
    await axiosCustom.delete(`${this.baseUrl}/${id}`);
  }

  async getTemplateByCode(code: string): Promise<ITemplate> {
    const response: AxiosResponse<ITemplate> = await axiosCustom.get(
      `${this.baseUrl}/code/${code}`
    );
    return response.data;
  }

  async getTemplatesByAgent(agentCode: string): Promise<ITemplate[]> {
    const response: AxiosResponse<ITemplate[]> = await axiosCustom.get(
      `${this.baseUrl}/agent/${agentCode}`
    );
    return response.data;
  }
}

export default new TemplateApi();
