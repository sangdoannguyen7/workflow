import { INode } from "./node.interface";

export interface IWorkflow {
  workflowId?: number;
  workflowCode: string;
  workflowName: string;
  statusCode: string;
  statusName: string;
  description?: string;
  search?: string;
  nodes?: INode[];
}

export interface IWorkflowSearchParams {
  page?: number;
  size?: number;
  search?: string;
  statusCode?: string;
  workflowCode?: string;
}

export interface IWorkflowResponse {
  content: IWorkflow[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// React Flow related interfaces
export interface IWorkflowNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: {
    label: string;
    nodeCode?: string;
    templateCode?: string;
    agentCode?: string;
    description?: string;
  };
}

export interface IWorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: {
    label?: string;
  };
}

export interface IWorkflowDesign {
  workflowCode: string;
  nodes: IWorkflowNode[];
  edges: IWorkflowEdge[];
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
}
