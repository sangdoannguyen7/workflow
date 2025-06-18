import {
  IWorkflow,
  IWorkflowResponse,
  IWorkflowSearchParams,
  IWorkflowDesign,
} from "../../interface/workflow.interface";

export interface IWorkflowApi {
  getWorkflows(params?: IWorkflowSearchParams): Promise<IWorkflowResponse>;
  getWorkflowById(id: number): Promise<IWorkflow>;
  createWorkflow(workflow: Omit<IWorkflow, "workflowId">): Promise<IWorkflow>;
  updateWorkflow(id: number, workflow: IWorkflow): Promise<IWorkflow>;
  deleteWorkflow(id: number): Promise<void>;
  getWorkflowByCode(code: string): Promise<IWorkflow>;
  getWorkflowDesign(workflowCode: string): Promise<IWorkflowDesign>;
  saveWorkflowDesign(
    workflowCode: string,
    design: IWorkflowDesign
  ): Promise<IWorkflowDesign>;
}
