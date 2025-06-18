import {
  IAgent,
  IAgentResponse,
  IAgentSearchParams,
} from "../../interface/agent.interface";

export interface IAgentApi {
  getAgents(params?: IAgentSearchParams): Promise<IAgentResponse>;
  getAgentById(id: number): Promise<IAgent>;
  createAgent(agent: Omit<IAgent, "agentId">): Promise<IAgent>;
  updateAgent(id: number, agent: IAgent): Promise<IAgent>;
  deleteAgent(id: number): Promise<void>;
  getAgentByCode(code: string): Promise<IAgent>;
}
