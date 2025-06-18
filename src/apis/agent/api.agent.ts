import {
  IAgent,
  IAgentResponse,
  IAgentSearchParams,
} from "../../interface/agent.interface";
import { IAgentApi } from "./api.agent.interface";
import {
  getMockAgents,
  getMockAgentById,
  getMockAgentByCode,
  mockAgents,
} from "../../mock/agent.mock";

class AgentApi implements IAgentApi {
  private nextId = Math.max(...mockAgents.map((a) => a.agentId || 0)) + 1;

  async getAgents(params?: IAgentSearchParams): Promise<IAgentResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMockAgents(params));
      }, 300); // Simulate API delay
    });
  }

  async getAgentById(id: number): Promise<IAgent> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const agent = getMockAgentById(id);
        if (agent) {
          resolve(agent);
        } else {
          reject(new Error("Agent not found"));
        }
      }, 200);
    });
  }

  async createAgent(agent: Omit<IAgent, "agentId">): Promise<IAgent> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAgent: IAgent = {
          ...agent,
          agentId: this.nextId++,
          search:
            `${agent.agentCode} ${agent.agentName} ${agent.statusName}`.toLowerCase(),
        };
        mockAgents.push(newAgent);
        resolve(newAgent);
      }, 500);
    });
  }

  async updateAgent(id: number, agent: IAgent): Promise<IAgent> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockAgents.findIndex((a) => a.agentId === id);
        if (index !== -1) {
          const updatedAgent = {
            ...agent,
            agentId: id,
            search:
              `${agent.agentCode} ${agent.agentName} ${agent.statusName}`.toLowerCase(),
          };
          mockAgents[index] = updatedAgent;
          resolve(updatedAgent);
        } else {
          reject(new Error("Agent not found"));
        }
      }, 500);
    });
  }

  async deleteAgent(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockAgents.findIndex((a) => a.agentId === id);
        if (index !== -1) {
          mockAgents.splice(index, 1);
          resolve();
        } else {
          reject(new Error("Agent not found"));
        }
      }, 300);
    });
  }

  async getAgentByCode(code: string): Promise<IAgent> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const agent = getMockAgentByCode(code);
        if (agent) {
          resolve(agent);
        } else {
          reject(new Error("Agent not found"));
        }
      }, 200);
    });
  }
}

export default new AgentApi();
