import axiosCustom, { IDataRequest, IDataResponse } from "../axiosCustom";
import {
  IAgent,
  IAgentResponse,
  IAgentSearchParams,
  IAgentRequest,
} from "../../interface/agent.interface";

class AgentApi {
  private readonly baseUrl = "/v1/property/agents";

  async getAgents(params?: IAgentSearchParams): Promise<IAgentResponse> {
    const request: IDataRequest = {
      method: "GET",
      uri: this.baseUrl,
      params: params || {},
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

  async createAgent(agentRequest: IAgentRequest): Promise<IAgent> {
    const request: IDataRequest = {
      method: "POST",
      uri: this.baseUrl,
      params: null,
      data: agentRequest,
    };
    const response: IDataResponse<{ data: IAgent }> = await axiosCustom(
      request
    );
    return response.value.data;
  }

  async updateAgent(
    agentCode: string,
    agentRequest: IAgentRequest
  ): Promise<IAgent> {
    const request: IDataRequest = {
      method: "PUT",
      uri: `${this.baseUrl}/${agentCode}`,
      params: null,
      data: agentRequest,
    };
    const response: IDataResponse<{ data: IAgent }> = await axiosCustom(
      request
    );
    return response.value.data;
  }

  async deleteAgent(agentCode: string): Promise<void> {
    const request: IDataRequest = {
      method: "DELETE",
      uri: `${this.baseUrl}/${agentCode}`,
      params: null,
      data: null,
    };
    await axiosCustom(request);
  }
}

const agentApi = new AgentApi();
export default agentApi;
