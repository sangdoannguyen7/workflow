export interface IAgent {
  agentId?: number;
  agentCode: string;
  agentName: string;
  statusCode: string;
  statusName: string;
  description?: string;
  search?: string;
}

export interface IAgentSearchParams {
  page?: number;
  size?: number;
  search?: string;
  statusCode?: string;
  agentCode?: string;
}

export interface IAgentResponse {
  content: IAgent[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
