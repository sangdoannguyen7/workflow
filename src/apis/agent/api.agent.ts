import axiosCustom, { IDataRequest, IDataResponse } from "../axiosCustom";
import {
  IAgent,
  IAgentResponse,
  IAgentSearchParams,
} from "../../interface/agent.interface";
import { IAgentApi } from "./api.agent.interface";

class AgentApi implements IAgentApi {
  private readonly baseUrl = "/api/agents";

  async getAgents(params?: IAgentSearchParams): Promise<IAgentResponse> {
    const request: IDataRequest = {
      method: "GET",
      uri: this.baseUrl,
      params: params || null,
      data: null,
    };
    const response: IDataResponse<IAgent> = await axiosCustom(request);
    return {
      content: response.data,
      totalElements: response.total,
      totalPages: response.totalPage,
      size: response.pageSize,
      number: response.page,
    };
  }

  async getAgentById(id: number): Promise<IAgent> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/${id}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<IAgent> = await axiosCustom(request);
    return response.value;
  }

  async createAgent(agent: Omit<IAgent, "agentId">): Promise<IAgent> {
    const request: IDataRequest = {
      method: "POST",
      uri: this.baseUrl,
      params: null,
      data: agent,
    };
    const response: IDataResponse<IAgent> = await axiosCustom(request);
    return response.value;
  }

  async updateAgent(id: number, agent: IAgent): Promise<IAgent> {
    const request: IDataRequest = {
      method: "PUT",
      uri: `${this.baseUrl}/${id}`,
      params: null,
      data: agent,
    };
    const response: IDataResponse<IAgent> = await axiosCustom(request);
    return response.value;
  }

  async deleteAgent(id: number): Promise<void> {
    const request: IDataRequest = {
      method: "DELETE",
      uri: `${this.baseUrl}/${id}`,
      params: null,
      data: null,
    };
    await axiosCustom(request);
  }

  async getAgentByCode(code: string): Promise<IAgent> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/code/${code}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<IAgent> = await axiosCustom(request);
    return response.value;
  }
}

export default new AgentApi();
