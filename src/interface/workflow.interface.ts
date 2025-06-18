import { INode, INodeRequest } from "./node.interface";

export interface IWorkflow {
  workflowCode: string;
  workflowName: string;
  statusCode: string;
  statusName: string;
  description?: string;
  nodes?: INode[];
}

export interface IWorkflowRequest {
  workflowName: string;
  statusCode: string;
  statusName: string;
  description: string;
  nodes: INodeRequest[];
}

export interface IWorkflowSearchRequest {
  workflowCodes: string[];
}

export interface IWorkflowDeleteRequest {
  workflowCodes: string[];
}

export interface IWorkflowSearchParams {
  search?: string;
  sorter?: string;
  current?: number;
  pageSize?: number;
}

export interface IWorkflowResponse {
  content: IWorkflow[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
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
    [key: string]: any; // For storing additional properties
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
