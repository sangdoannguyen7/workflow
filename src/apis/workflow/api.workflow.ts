import axiosCustom, { IDataRequest, IDataResponse } from "../axiosCustom";
import {
  IWorkflow,
  IWorkflowResponse,
  IWorkflowSearchParams,
  IWorkflowDesign,
  IWorkflowRequest,
} from "../../interface/workflow.interface";
import { SingleApiResponse } from "../../interface/common.interface";

class WorkflowApi {
  private readonly baseUrl = "/v1/property/workflows";

  async getWorkflows(
    params?: IWorkflowSearchParams
  ): Promise<IWorkflowResponse> {
    const request: IDataRequest = {
      method: "GET",
      uri: this.baseUrl,
      params: params || {},
      data: null,
    };

    const response: IDataResponse<IWorkflowResponse> = await axiosCustom(
      request
    );
    return response.value;
  }

  async getWorkflowById(id: number): Promise<IWorkflow> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/${id}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<SingleApiResponse<IWorkflow>> =
      await axiosCustom(request);
    return response.value.data;
  }

  async getWorkflowByCode(code: string): Promise<IWorkflow> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/${code}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<SingleApiResponse<IWorkflow>> =
      await axiosCustom(request);
    return response.value.data;
  }

  async createWorkflow(workflowRequest: IWorkflowRequest): Promise<IWorkflow> {
    const request: IDataRequest = {
      method: "POST",
      uri: this.baseUrl,
      params: null,
      data: workflowRequest,
    };
    const response: IDataResponse<SingleApiResponse<IWorkflow>> =
      await axiosCustom(request);
    return response.value.data;
  }

  async updateWorkflow(
    workflowCode: string,
    workflowRequest: IWorkflowRequest
  ): Promise<IWorkflow> {
    const request: IDataRequest = {
      method: "PUT",
      uri: `${this.baseUrl}/${workflowCode}`,
      params: null,
      data: workflowRequest,
    };
    const response: IDataResponse<SingleApiResponse<IWorkflow>> =
      await axiosCustom(request);
    return response.value.data;
  }

  async deleteWorkflow(workflowCode: string): Promise<void> {
    const request: IDataRequest = {
      method: "DELETE",
      uri: `${this.baseUrl}/${workflowCode}`,
      params: null,
      data: null,
    };
    await axiosCustom(request);
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

  // Helper method to get workflow nodes
  async getWorkflowNodes(workflowCode: string) {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/${workflowCode}/nodes`,
      params: null,
      data: null,
    };
    const response = await axiosCustom(request);
    return response.value;
  }
}

const workflowApi = new WorkflowApi();
export default workflowApi;
