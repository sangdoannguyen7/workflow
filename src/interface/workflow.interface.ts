import {
  ApiResponse,
  CommonSearchParams,
  SingleApiResponse,
} from "./common.interface";

export interface INode {
  nodeId?: number;
  nodeCode: string;
  nodeName: string;
  templateCode: string;
  templateName: string;
  typeCode: string;
  typeName: string;
  agentCode: string;
  agentName: string;
  workflowCode: string;
  workflowName: string;
  statusCode: string;
  statusName: string;
  templateType: string;
  description: string | null;
  search: string | null;
  metadata: string | null;
  info: string | null;
  schema: string | null;
  body: string | null;
  rule: string | null;
  configuration: string | null;
  outputCode: string | null;
}

export interface IWorkflow {
  workflowCode: string;
  workflowName: string;
  statusCode: string;
  statusName: string;
  description: string | null;
  nodes: INode[];
}

export interface IWorkflowRequest {
  workflowName: string;
  statusCode: string;
  statusName: string;
  description: string;
  nodes: INodeRequest[];
}

export interface INodeRequest {
  nodeCode: string;
  nodeName: string;
  templateCode: string;
  templateName: string;
  typeCode: string;
  typeName: string;
  agentCode: string;
  agentName: string;
  description: string;
  search: string;
  metadata: string;
  info: string;
  schema: string;
  body: string;
  rule: string;
  configuration: string;
  outputCode: string;
}

export interface IWorkflowSearchParams extends CommonSearchParams {}

export interface IWorkflowResponse extends ApiResponse<IWorkflow> {}

// React Flow interfaces
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
    templateType?: string;
    [key: string]: any;
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
