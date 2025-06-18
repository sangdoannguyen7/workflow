import axiosCustom, { IDataRequest, IDataResponse } from "../axiosCustom";
import {
  IWorkflow,
  IWorkflowResponse,
  IWorkflowSearchParams,
  IWorkflowDesign,
  IWorkflowRequest,
  IWorkflowSearchRequest,
} from "../../interface/workflow.interface";
import {
  ValueResponse,
  ListResponse,
} from "../../interface/template.interface";
import { PageImplResponse } from "../../interface/agent.interface";
import { IWorkflowApi } from "./api.workflow.interface";

class WorkflowApi implements IWorkflowApi {
  private readonly baseUrl = "/v1/property/workflows";

  async getWorkflows(
    params?: IWorkflowSearchParams
  ): Promise<IWorkflowResponse> {
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

    const response: IDataResponse<PageImplResponse<IWorkflow>> =
      await axiosCustom(request);

    return {
      content: response.value.content,
      totalElements: response.value.totalElements,
      totalPages: response.value.totalPages,
      size: response.value.size,
      number: response.value.number,
      first: response.value.first,
      last: response.value.last,
    };
  }

  async getWorkflowById(id: number): Promise<IWorkflow> {
    throw new Error("API does not support getById, use getByCode instead");
  }

  async createWorkflow(workflowRequest: IWorkflowRequest): Promise<IWorkflow> {
    const request: IDataRequest = {
      method: "POST",
      uri: this.baseUrl,
      params: null,
      data: workflowRequest,
    };
    const response: IDataResponse<ValueResponse<IWorkflow>> = await axiosCustom(
      request
    );
    return response.value.data;
  }

  async updateWorkflow(
    workflowCode: string,
    workflowRequest: IWorkflowRequest
  ): Promise<IWorkflow> {
    const request: IDataRequest = {
      method: "PATCH",
      uri: `${this.baseUrl}/${workflowCode}`,
      params: null,
      data: workflowRequest,
    };
    const response: IDataResponse<ValueResponse<IWorkflow>> = await axiosCustom(
      request
    );
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

  async getWorkflowByCode(code: string): Promise<IWorkflow> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/${code}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<ValueResponse<IWorkflow>> = await axiosCustom(
      request
    );
    return response.value.data;
  }

  async getWorkflowsByCodes(
    searchRequest: IWorkflowSearchRequest
  ): Promise<IWorkflow[]> {
    const request: IDataRequest = {
      method: "POST",
      uri: `${this.baseUrl}/workflowCodes`,
      params: null,
      data: searchRequest,
    };
    const response: IDataResponse<ListResponse<IWorkflow>> = await axiosCustom(
      request
    );
    return response.value.data;
  }

  // For workflow design (this might need to be implemented on backend)
  async getWorkflowDesign(workflowCode: string): Promise<IWorkflowDesign> {
    // This is custom functionality for React Flow - might need backend support
    // For now, return empty design
    return {
      workflowCode,
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    };
  }

  async saveWorkflowDesign(
    workflowCode: string,
    design: IWorkflowDesign
  ): Promise<IWorkflowDesign> {
    // Store design data in workflow's info field or separate endpoint
    // For now, just return the design
    return design;
  }
}

export default new WorkflowApi();
