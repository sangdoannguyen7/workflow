export interface ITemplate {
  templateId?: number;
  templateCode: string;
  templateName: string;
  agentCode: string;
  agentName: string;
  statusCode: string;
  statusName: string;
  description?: string;
}

export interface ITemplateSearchParams {
  agentCode?: string;
  search?: string;
  sorter?: string;
  current?: number;
  pageSize?: number;
}

export interface ITemplateResponse {
  content: ITemplate[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ValueResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ListResponse<T> {
  data: T[];
  success: boolean;
  message?: string;
}
