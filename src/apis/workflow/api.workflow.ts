import axiosCustom, { IDataRequest, IDataResponse } from "../axiosCustom";
import {
  IWorkflow,
  IWorkflowResponse,
  IWorkflowSearchParams,
  IWorkflowDesign,
} from "../../interface/workflow.interface";
import { SingleApiResponse } from "../../interface/common.interface";
import { IWorkflowApi } from "./api.workflow.interface";
import { MockAPI, API_CONFIG } from "../../config/api.config";

class WorkflowApi implements IWorkflowApi {
  private readonly baseUrl = "/v1/property/workflows";

  async getWorkflows(params?: IWorkflowSearchParams): Promise<any> {
    if (API_CONFIG.USE_MOCK) {
      return await MockAPI.getWorkflows(params);
    }

    const request: IDataRequest = {
      method: "GET",
      uri: this.baseUrl,
      params: {
        search: params?.search || "",
        sorter: params?.sorter || "",
        current: params?.current || 1,
        pageSize: params?.pageSize || 20,
      },
      data: null,
    };

    const response: IDataResponse<IWorkflowResponse> = await axiosCustom(
      request
    );
    return response.value;
  }

  async getWorkflowById(_id: number): Promise<IWorkflow> {
    throw new Error("API does not support getById, use getByCode instead");
  }

  async createWorkflow(workflow: any): Promise<any> {
    if (API_CONFIG.USE_MOCK) {
      const result = await MockAPI.createWorkflow(workflow);
      return result.data;
    }

    const request: IDataRequest = {
      method: "POST",
      uri: this.baseUrl,
      params: null,
      data: workflow,
    };
    const response: IDataResponse<SingleApiResponse<IWorkflow>> =
      await axiosCustom(request);
    return response.value.data;
  }

  async updateWorkflow(id: any, workflow: any): Promise<any> {
    if (API_CONFIG.USE_MOCK) {
      const result = await MockAPI.updateWorkflow(id.toString(), workflow);
      return result.data;
    }

    const request: IDataRequest = {
      method: "PUT",
      uri: `${this.baseUrl}/${id}`,
      params: null,
      data: workflow,
    };
    const response: IDataResponse<SingleApiResponse<IWorkflow>> =
      await axiosCustom(request);
    return response.value.data;
  }

  async deleteWorkflow(id: number): Promise<void> {
    if (API_CONFIG.USE_MOCK) {
      await MockAPI.deleteWorkflow(id.toString());
      return;
    }

    const request: IDataRequest = {
      method: "DELETE",
      uri: `${this.baseUrl}/${id}`,
      params: null,
      data: null,
    };
    await axiosCustom(request);
  }

  async getWorkflowByCode(workflowCode: string): Promise<IWorkflow> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/${workflowCode}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<SingleApiResponse<IWorkflow>> =
      await axiosCustom(request);
    return response.value.data;
  }

  async getWorkflowDesign(workflowCode: string): Promise<IWorkflowDesign> {
    // Mock workflow design data
    const mockDesign: IWorkflowDesign = {
      workflowCode,
      nodes: [],
      edges: [],
    };

    if (API_CONFIG.USE_MOCK) {
      // Return mock design or empty design
      return mockDesign;
    }

    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/${workflowCode}/design`,
      params: null,
      data: null,
    };
    const response: IDataResponse<SingleApiResponse<IWorkflowDesign>> =
      await axiosCustom(request);
    return response.value.data;
  }

  async saveWorkflowDesign(
    workflowCode: string,
    design: IWorkflowDesign
  ): Promise<IWorkflowDesign> {
    if (API_CONFIG.USE_MOCK) {
      // Just simulate saving and return the design
      await new Promise((resolve) => setTimeout(resolve, 500));
      return design;
    }

    const request: IDataRequest = {
      method: "PUT",
      uri: `${this.baseUrl}/${workflowCode}/design`,
      params: null,
      data: design,
    };
    const response: IDataResponse<SingleApiResponse<IWorkflowDesign>> =
      await axiosCustom(request);
    return response.value.data;
  }
}

const workflowApi = new WorkflowApi();
export default workflowApi;
