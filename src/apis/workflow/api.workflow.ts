import axiosCustom, { IDataRequest, IDataResponse } from "../axiosCustom";
import {
  IWorkflow,
  IWorkflowResponse,
  IWorkflowSearchParams,
  IWorkflowDesign,
} from "../../interface/workflow.interface";
import { IWorkflowApi } from "./api.workflow.interface";

class WorkflowApi implements IWorkflowApi {
  private readonly baseUrl = "/api/workflows";

  async getWorkflows(
    params?: IWorkflowSearchParams
  ): Promise<IWorkflowResponse> {
    const request: IDataRequest = {
      method: "GET",
      uri: this.baseUrl,
      params: params || null,
      data: null,
    };
    const response: IDataResponse<IWorkflow> = await axiosCustom(request);
    return {
      content: response.data,
      totalElements: response.total,
      totalPages: response.totalPage,
      size: response.pageSize,
      number: response.page,
    };
  }

  async getWorkflowById(id: number): Promise<IWorkflow> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/${id}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<IWorkflow> = await axiosCustom(request);
    return response.value;
  }

  async createWorkflow(
    workflow: Omit<IWorkflow, "workflowId">
  ): Promise<IWorkflow> {
    const request: IDataRequest = {
      method: "POST",
      uri: this.baseUrl,
      params: null,
      data: workflow,
    };
    const response: IDataResponse<IWorkflow> = await axiosCustom(request);
    return response.value;
  }

  async updateWorkflow(id: number, workflow: IWorkflow): Promise<IWorkflow> {
    const request: IDataRequest = {
      method: "PUT",
      uri: `${this.baseUrl}/${id}`,
      params: null,
      data: workflow,
    };
    const response: IDataResponse<IWorkflow> = await axiosCustom(request);
    return response.value;
  }

  async deleteWorkflow(id: number): Promise<void> {
    const request: IDataRequest = {
      method: "DELETE",
      uri: `${this.baseUrl}/${id}`,
      params: null,
      data: null,
    };
    await axiosCustom(request);
  }

  async getWorkflowByCode(code: string): Promise<IWorkflow> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/code/${code}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<IWorkflow> = await axiosCustom(request);
    return response.value;
  }

  async getWorkflowDesign(workflowCode: string): Promise<IWorkflowDesign> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/${workflowCode}/design`,
      params: null,
      data: null,
    };
    const response: IDataResponse<IWorkflowDesign> = await axiosCustom(request);
    return response.value;
  }

  async saveWorkflowDesign(
    workflowCode: string,
    design: IWorkflowDesign
  ): Promise<IWorkflowDesign> {
    const request: IDataRequest = {
      method: "POST",
      uri: `${this.baseUrl}/${workflowCode}/design`,
      params: null,
      data: design,
    };
    const response: IDataResponse<IWorkflowDesign> = await axiosCustom(request);
    return response.value;
  }
}

export default new WorkflowApi();
