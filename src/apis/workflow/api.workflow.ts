import {
  IWorkflow,
  IWorkflowResponse,
  IWorkflowSearchParams,
  IWorkflowDesign,
} from "../../interface/workflow.interface";
import { IWorkflowApi } from "./api.workflow.interface";
import {
  getMockWorkflows,
  getMockWorkflowById,
  getMockWorkflowByCode,
  getMockWorkflowDesign,
  saveMockWorkflowDesign,
  mockWorkflows,
} from "../../mock/workflow.mock";

class WorkflowApi implements IWorkflowApi {
  private nextId = Math.max(...mockWorkflows.map((w) => w.workflowId || 0)) + 1;

  async getWorkflows(
    params?: IWorkflowSearchParams
  ): Promise<IWorkflowResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMockWorkflows(params));
      }, 300);
    });
  }

  async getWorkflowById(id: number): Promise<IWorkflow> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const workflow = getMockWorkflowById(id);
        if (workflow) {
          resolve(workflow);
        } else {
          reject(new Error("Workflow not found"));
        }
      }, 200);
    });
  }

  async createWorkflow(
    workflow: Omit<IWorkflow, "workflowId">
  ): Promise<IWorkflow> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newWorkflow: IWorkflow = {
          ...workflow,
          workflowId: this.nextId++,
          search:
            `${workflow.workflowCode} ${workflow.workflowName} ${workflow.statusName}`.toLowerCase(),
          nodes: [],
        };
        mockWorkflows.push(newWorkflow);
        resolve(newWorkflow);
      }, 500);
    });
  }

  async updateWorkflow(id: number, workflow: IWorkflow): Promise<IWorkflow> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockWorkflows.findIndex((w) => w.workflowId === id);
        if (index !== -1) {
          const updatedWorkflow = {
            ...workflow,
            workflowId: id,
            search:
              `${workflow.workflowCode} ${workflow.workflowName} ${workflow.statusName}`.toLowerCase(),
          };
          mockWorkflows[index] = updatedWorkflow;
          resolve(updatedWorkflow);
        } else {
          reject(new Error("Workflow not found"));
        }
      }, 500);
    });
  }

  async deleteWorkflow(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockWorkflows.findIndex((w) => w.workflowId === id);
        if (index !== -1) {
          mockWorkflows.splice(index, 1);
          resolve();
        } else {
          reject(new Error("Workflow not found"));
        }
      }, 300);
    });
  }

  async getWorkflowByCode(code: string): Promise<IWorkflow> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const workflow = getMockWorkflowByCode(code);
        if (workflow) {
          resolve(workflow);
        } else {
          reject(new Error("Workflow not found"));
        }
      }, 200);
    });
  }

  async getWorkflowDesign(workflowCode: string): Promise<IWorkflowDesign> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const design = getMockWorkflowDesign(workflowCode);
        if (design) {
          resolve(design);
        } else {
          // Return empty design for new workflows
          resolve({
            workflowCode,
            nodes: [],
            edges: [],
            viewport: { x: 0, y: 0, zoom: 1 },
          });
        }
      }, 200);
    });
  }

  async saveWorkflowDesign(
    workflowCode: string,
    design: IWorkflowDesign
  ): Promise<IWorkflowDesign> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const savedDesign = saveMockWorkflowDesign(workflowCode, design);
        resolve(savedDesign);
      }, 400);
    });
  }
}

export default new WorkflowApi();
