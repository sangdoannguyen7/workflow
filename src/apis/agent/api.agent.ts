import axiosCustom, { IDataRequest, IDataResponse } from "../axiosCustom";
import {
  IAgent,
  IAgentResponse,
  IAgentSearchParams,
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

    const response: IDataResponse<IAgentResponse> = await axiosCustom(request);
    return response.value;
  }

  async getAgentById(id: number): Promise<IAgent> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/${id}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<{ data: IAgent }> = await axiosCustom(
      request
    );
    return response.value.data;
  }

  async createAgent(agent: Omit<IAgent, "agentId">): Promise<IAgent> {
    const request: IDataRequest = {
      method: "POST",
      uri: this.baseUrl,
      params: null,
      data: agent,
    };
    const response: IDataResponse<{ data: IAgent }> = await axiosCustom(
      request
    );
    return response.value.data;
  }

  async updateAgent(id: number, agent: IAgent): Promise<IAgent> {
    const request: IDataRequest = {
      method: "PATCH",
      uri: `${this.baseUrl}/${id}`,
      params: null,
      data: agent,
    };
    const response: IDataResponse<{ data: IAgent }> = await axiosCustom(
      request
    );
    return response.value.data;
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
    const response: IDataResponse<{ data: IAgent }> = await axiosCustom(
      request
    );
    return response.value.data;
  }
}

export default new AgentApi();
