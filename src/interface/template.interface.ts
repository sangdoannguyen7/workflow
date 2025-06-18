import { ApiResponse, CommonSearchParams } from "./common.interface";

export interface ITemplate {
  templateId: number;
  templateCode: string;
  templateName: string;
  agentCode: string;
  agentName: string;
  statusCode: string;
  statusName: string | null;
  description: string | null;
}

export interface ITemplateSearchParams extends CommonSearchParams {
  agentCode?: string;
}

export interface ITemplateResponse extends ApiResponse<ITemplate> {}
