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

export interface INodeSearchParams {
  page?: number;
  size?: number;
  search?: string;
  statusCode?: string;
  nodeCode?: string;
  templateCode?: string;
  agentCode?: string;
  workflowCode?: string;
  typeCode?: string;
}

export interface INodeResponse {
  content: INode[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
