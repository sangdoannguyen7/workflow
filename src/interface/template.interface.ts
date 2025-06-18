import {
  ApiResponse,
  CommonSearchParams,
  SingleApiResponse,
} from "./common.interface";

export interface ITemplate {
  templateId?: number;
  templateCode: string;
  templateName: string;
  typeCode?: string;
  typeName?: string;
  agentCode: string;
  agentName: string;
  workflowCode?: string;
  workflowName?: string;
  statusCode: string;
  statusName: string | null;
  templateType: string; // Added for workflow builder
  description: string | null;
  search?: string | null;
  metadata?: string | null;
  info?: string | null;
  schema?: string | null;
  body?: string | null;
  rule?: string | null;
  configuration?: string | null;
  outputCode?: string | null;
}

export interface ITemplateRequest {
  templateName: string;
  typeCode?: string;
  typeName?: string;
  agentCode: string;
  agentName: string;
  workflowCode?: string;
  workflowName?: string;
  statusCode: string;
  statusName: string;
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

export interface ITemplateSearchParams extends CommonSearchParams {
  agentCode?: string;
}

export interface ITemplateResponse extends ApiResponse<ITemplate> {}

export interface ITemplateValueResponse extends SingleApiResponse<ITemplate> {}
