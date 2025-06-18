import { AxiosResponse } from "axios";
import axiosCustom from "../axiosCustom";
import {
  IAgent,
  IAgentResponse,
  IAgentSearchParams,
} from "../../interface/agent.interface";
import { IAgentApi } from "./api.agent.interface";

class AgentApi implements IAgentApi {
  private readonly baseUrl = "/api/agents";

  async getAgents(params?: IAgentSearchParams): Promise<IAgentResponse> {
    const response: AxiosResponse<IAgentResponse> = await axiosCustom.get(
      this.baseUrl,
      { params }
    );
    return response.data;
  }

  async getAgentById(id: number): Promise<IAgent> {
    const response: AxiosResponse<IAgent> = await axiosCustom.get(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }

  async createAgent(agent: Omit<IAgent, "agentId">): Promise<IAgent> {
    const response: AxiosResponse<IAgent> = await axiosCustom.post(
      this.baseUrl,
      agent
    );
    return response.data;
  }

  async updateAgent(id: number, agent: IAgent): Promise<IAgent> {
    const response: AxiosResponse<IAgent> = await axiosCustom.put(
      `${this.baseUrl}/${id}`,
      agent
    );
    return response.data;
  }

  async deleteAgent(id: number): Promise<void> {
    await axiosCustom.delete(`${this.baseUrl}/${id}`);
  }

  async getAgentByCode(code: string): Promise<IAgent> {
    const response: AxiosResponse<IAgent> = await axiosCustom.get(
      `${this.baseUrl}/code/${code}`
    );
    return response.data;
  }
}

export default new AgentApi();
