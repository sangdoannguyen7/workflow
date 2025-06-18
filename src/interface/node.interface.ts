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
  description?: string;
  search?: string;
  metadata?: string;
  info?: string; // Store node properties here
  schema?: string;
  body?: string;
  rule?: string;
  configuration?: string;
  outputCode?: string;
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
  description?: string;
  search?: string;
  metadata?: string;
  info?: string;
  schema?: string;
  body?: string;
  rule?: string;
  configuration?: string;
  outputCode?: string;
}

export interface INodeCreateRequest {
  templateCode: string;
}

export interface INodeInitRequest {
  initializationCode: string;
}

export interface INodeSearchParams {
  search?: string;
  sorter?: string;
  current?: number;
  pageSize?: number;
}

export interface INodeResponse {
  content: INode[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
