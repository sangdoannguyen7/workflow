import { AxiosResponse } from "axios";
import axiosCustom from "../axiosCustom";
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
    const response: AxiosResponse<IWorkflowResponse> = await axiosCustom.get(
      this.baseUrl,
      { params }
    );
    return response.data;
  }

  async getWorkflowById(id: number): Promise<IWorkflow> {
    const response: AxiosResponse<IWorkflow> = await axiosCustom.get(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }

  async createWorkflow(
    workflow: Omit<IWorkflow, "workflowId">
  ): Promise<IWorkflow> {
    const response: AxiosResponse<IWorkflow> = await axiosCustom.post(
      this.baseUrl,
      workflow
    );
    return response.data;
  }

  async updateWorkflow(id: number, workflow: IWorkflow): Promise<IWorkflow> {
    const response: AxiosResponse<IWorkflow> = await axiosCustom.put(
      `${this.baseUrl}/${id}`,
      workflow
    );
    return response.data;
  }

  async deleteWorkflow(id: number): Promise<void> {
    await axiosCustom.delete(`${this.baseUrl}/${id}`);
  }

  async getWorkflowByCode(code: string): Promise<IWorkflow> {
    const response: AxiosResponse<IWorkflow> = await axiosCustom.get(
      `${this.baseUrl}/code/${code}`
    );
    return response.data;
  }

  async getWorkflowDesign(workflowCode: string): Promise<IWorkflowDesign> {
    const response: AxiosResponse<IWorkflowDesign> = await axiosCustom.get(
      `${this.baseUrl}/${workflowCode}/design`
    );
    return response.data;
  }

  async saveWorkflowDesign(
    workflowCode: string,
    design: IWorkflowDesign
  ): Promise<IWorkflowDesign> {
    const response: AxiosResponse<IWorkflowDesign> = await axiosCustom.post(
      `${this.baseUrl}/${workflowCode}/design`,
      design
    );
    return response.data;
  }
}

export default new WorkflowApi();
