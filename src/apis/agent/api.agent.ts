import axiosCustom, { IDataRequest, IDataResponse } from "../axiosCustom";
import {
  IAgent,
  IAgentResponse,
  IAgentSearchParams,
  PageImplResponse,
} from "../../interface/agent.interface";
import { IAgentApi } from "./api.agent.interface";

class AgentApi implements IAgentApi {
  private readonly baseUrl = "/v1/property/agents";

  async getAgents(params?: IAgentSearchParams): Promise<IAgentResponse> {
    const request: IDataRequest = {
      method: "GET",
      uri: this.baseUrl,
      params: {
        search: params?.search || "",
        sorter: params?.sorter || "",
        current: params?.current || 1,
        pageSize: params?.pageSize || 20,
      },
      data: null,
    };

    const response: IDataResponse<PageImplResponse<IAgent>> = await axiosCustom(
      request
    );

    return {
      content: response.value.content,
      totalElements: response.value.totalElements,
      totalPages: response.value.totalPages,
      size: response.value.size,
      number: response.value.number,
      first: response.value.first,
      last: response.value.last,
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
      method: "PATCH",
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
      uri: `${this.baseUrl}/${code}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<IAgent> = await axiosCustom(request);
    return response.value;
  }
}

export default new AgentApi();
