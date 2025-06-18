export interface ITemplate {
  templateId?: number;
  templateCode: string;
  templateName: string;
  typeCode: string;
  typeName: string;
  agentCode: string;
  agentName: string;
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
}

export interface ITemplateSearchParams {
  page?: number;
  size?: number;
  search?: string;
  statusCode?: string;
  templateCode?: string;
  agentCode?: string;
  typeCode?: string;
  templateType?: string;
}

export interface ITemplateResponse {
  content: ITemplate[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
