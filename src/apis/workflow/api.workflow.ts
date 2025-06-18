import axiosCustom, { IDataRequest, IDataResponse } from "../axiosCustom";
import {
  IWorkflow,
  IWorkflowResponse,
  IWorkflowSearchParams,
  IWorkflowDesign,
  IWorkflowRequest,
} from "../../interface/workflow.interface";
import { SingleApiResponse } from "../../interface/common.interface";
import { IWorkflowApi } from "./api.workflow.interface";
import { MockAPI, API_CONFIG } from "../../config/api.config";

class WorkflowApi implements IWorkflowApi {
  private readonly baseUrl = "/v1/property/workflows";

  async getWorkflows(
    params?: IWorkflowSearchParams
  ): Promise<IWorkflowResponse> {
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

  async getWorkflowById(id: number): Promise<IWorkflow> {
    throw new Error("API does not support getById, use getByCode instead");
  }

  async createWorkflow(workflowRequest: IWorkflowRequest): Promise<IWorkflow> {
    if (API_CONFIG.USE_MOCK) {
      const result = await MockAPI.createWorkflow(workflowRequest);
      return result.data;
    }

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
    if (API_CONFIG.USE_MOCK) {
      const result = await MockAPI.updateWorkflow(
        workflowCode,
        workflowRequest
      );
      return result.data;
    }

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
    if (API_CONFIG.USE_MOCK) {
      await MockAPI.deleteWorkflow(workflowCode);
      return;
    }

    const request: IDataRequest = {
      method: "DELETE",
      uri: `${this.baseUrl}/${workflowCode}`,
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
  ): Promise<void> {
    if (API_CONFIG.USE_MOCK) {
      // Just simulate saving
      await new Promise((resolve) => setTimeout(resolve, 500));
      return;
    }

    const request: IDataRequest = {
      method: "PUT",
      uri: `${this.baseUrl}/${workflowCode}/design`,
      params: null,
      data: design,
    };
    await axiosCustom(request);
  }

  // Helper method to generate mock workflow nodes from design
  private generateMockNodes(nodes: any[]) {
    return nodes.map((node, index) => ({
      id: node.id,
      position: node.position,
      data: {
        label: node.data?.label || `Node ${index + 1}`,
        nodeCode: node.data?.nodeCode || `NODE_${index + 1}`,
        templateCode: node.data?.templateCode || "TPL_DEFAULT",
        templateType: node.data?.templateType || "webhook",
        agentCode: node.data?.agentCode || "AGENT_DEFAULT",
        description: node.data?.description || "",
        ...node.data,
      },
    }));
  }
}

const workflowApi = new WorkflowApi();
export default workflowApi;
