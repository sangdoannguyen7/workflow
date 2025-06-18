import { ApiResponse, CommonSearchParams } from "./common.interface";

export interface IAgent {
  agentId: number;
  agentCode: string;
  agentName: string;
  statusCode: string | null;
  statusName: string | null;
  description: string | null;
  search?: string;
  endpoint?: string;
  lastPing?: string;
  isOnline?: boolean;
}

export interface IAgentSearchParams extends CommonSearchParams {}

export interface IAgentResponse extends ApiResponse<IAgent> {}
