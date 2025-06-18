import axiosCustom, { IDataRequest, IDataResponse } from "../axiosCustom";
import {
  IAgent,
  IAgentResponse,
  IAgentSearchParams,
  IAgentRequest,
} from "../../interface/agent.interface";
import {
  getMockAgents,
  createMockAgent,
  updateMockAgent,
  deleteMockAgent,
  getMockAgentByCode,
} from "../../mock/agent.mock";

class AgentApi {
  private readonly baseUrl = "/v1/property/agents";

  async getAgents(params?: IAgentSearchParams): Promise<IAgentResponse> {
    const request: IDataRequest = {
      method: "GET",
      uri: this.baseUrl,
      params: params || {},
      data: null,
    };

    try {
      const response: IDataResponse<IAgentResponse> = await axiosCustom(
        request
      );
      return response.value;
    } catch (error) {
      // Fallback to mock data
      console.log("Using mock data for agents");
      return getMockAgents(params);
    }
  }

  async getAgentById(id: number): Promise<IAgent> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/${id}`,
      params: null,
      data: null,
    };

    try {
      const response: IDataResponse<{ data: IAgent }> = await axiosCustom(
        request
      );
      return response.value.data;
    } catch (error) {
      // Fallback to mock data
      const agents = getMockAgents();
      const agent = agents.content.find((a) => a.agentId === id);
      if (!agent) throw new Error("Agent not found");
      return agent;
    }
  }

  async getAgentByCode(code: string): Promise<IAgent> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/${code}`,
      params: null,
      data: null,
    };

    try {
      const response: IDataResponse<{ data: IAgent }> = await axiosCustom(
        request
      );
      return response.value.data;
    } catch (error) {
      // Fallback to mock data
      const agent = getMockAgentByCode(code);
      if (!agent) throw new Error("Agent not found");
      return agent;
    }
  }

  async createAgent(agentRequest: IAgentRequest): Promise<IAgent> {
    const request: IDataRequest = {
      method: "POST",
      uri: this.baseUrl,
      params: null,
      data: agentRequest,
    };

    try {
      const response: IDataResponse<{ data: IAgent }> = await axiosCustom(
        request
      );
      return response.value.data;
    } catch (error) {
      // Fallback to mock data
      console.log("Creating agent with mock data");
      return createMockAgent(agentRequest);
    }
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

    try {
      const response: IDataResponse<{ data: IAgent }> = await axiosCustom(
        request
      );
      return response.value.data;
    } catch (error) {
      // Fallback to mock data
      console.log("Updating agent with mock data");
      const agent = getMockAgentByCode(agentCode);
      if (!agent) throw new Error("Agent not found");
      const updated = updateMockAgent(agent.agentId!, agentRequest);
      if (!updated) throw new Error("Failed to update agent");
      return updated;
    }
  }

  async deleteAgent(agentCode: string): Promise<void> {
    const request: IDataRequest = {
      method: "DELETE",
      uri: `${this.baseUrl}/${agentCode}`,
      params: null,
      data: null,
    };

    try {
      await axiosCustom(request);
    } catch (error) {
      // Fallback to mock data
      console.log("Deleting agent with mock data");
      const agent = getMockAgentByCode(agentCode);
      if (!agent) throw new Error("Agent not found");
      const deleted = deleteMockAgent(agent.agentId!);
      if (!deleted) throw new Error("Failed to delete agent");
    }
  }
}

const agentApi = new AgentApi();
export default agentApi;
