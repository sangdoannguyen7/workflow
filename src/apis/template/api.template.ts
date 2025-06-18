import axiosCustom, { IDataRequest, IDataResponse } from "../axiosCustom";
import {
  ITemplate,
  ITemplateResponse,
  ITemplateSearchParams,
  ITemplateRequest,
  ITemplateValueResponse,
} from "../../interface/template.interface";
import {
  getMockTemplates,
  createMockTemplate,
  updateMockTemplate,
  deleteMockTemplate,
  getMockTemplateByCode,
} from "../../mock/template.mock";

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

    try {
      const response: IDataResponse<ITemplateResponse> = await axiosCustom(
        request
      );
      return response.value;
    } catch (error) {
      // Fallback to mock data
      console.log("Using mock data for templates");
      return getMockTemplates(params);
    }
  }

  async getTemplateById(id: number): Promise<ITemplate> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/${id}`,
      params: null,
      data: null,
    };

    try {
      const response: IDataResponse<ITemplateValueResponse> = await axiosCustom(
        request
      );
      return response.value.data;
    } catch (error) {
      // Fallback to mock data
      const templates = getMockTemplates();
      const template = templates.content.find((t) => t.templateId === id);
      if (!template) throw new Error("Template not found");
      return template;
    }
  }

  async getTemplateByCode(code: string): Promise<ITemplate> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/${code}`,
      params: null,
      data: null,
    };

    try {
      const response: IDataResponse<ITemplateValueResponse> = await axiosCustom(
        request
      );
      return response.value.data;
    } catch (error) {
      // Fallback to mock data
      const template = getMockTemplateByCode(code);
      if (!template) throw new Error("Template not found");
      return template;
    }
  }

  async createTemplate(templateRequest: ITemplateRequest): Promise<ITemplate> {
    const request: IDataRequest = {
      method: "POST",
      uri: this.baseUrl,
      params: null,
      data: templateRequest,
    };

    try {
      const response: IDataResponse<ITemplateValueResponse> = await axiosCustom(
        request
      );
      return response.value.data;
    } catch (error) {
      // Fallback to mock data
      console.log("Creating template with mock data");
      return createMockTemplate(templateRequest);
    }
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

    try {
      const response: IDataResponse<ITemplateValueResponse> = await axiosCustom(
        request
      );
      return response.value.data;
    } catch (error) {
      // Fallback to mock data
      console.log("Updating template with mock data");
      const template = getMockTemplateByCode(templateCode);
      if (!template) throw new Error("Template not found");
      const updated = updateMockTemplate(template.templateId!, templateRequest);
      if (!updated) throw new Error("Failed to update template");
      return updated;
    }
  }

  async deleteTemplate(templateCode: string): Promise<void> {
    const request: IDataRequest = {
      method: "DELETE",
      uri: `${this.baseUrl}/${templateCode}`,
      params: null,
      data: null,
    };

    try {
      await axiosCustom(request);
    } catch (error) {
      // Fallback to mock data
      console.log("Deleting template with mock data");
      const template = getMockTemplateByCode(templateCode);
      if (!template) throw new Error("Template not found");
      const deleted = deleteMockTemplate(template.templateId!);
      if (!deleted) throw new Error("Failed to delete template");
    }
  }

  async getTemplatesByAgent(agentCode: string): Promise<ITemplate[]> {
    const request: IDataRequest = {
      method: "GET",
      uri: this.baseUrl,
      params: { agentCode, size: 1000 },
      data: null,
    };

    try {
      const response: IDataResponse<ITemplateResponse> = await axiosCustom(
        request
      );
      return response.value.content;
    } catch (error) {
      // Fallback to mock data
      const templates = getMockTemplates({ agentCode });
      return templates.content;
    }
  }
}

const templateApi = new TemplateApi();
export default templateApi;
