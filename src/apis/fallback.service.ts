import { getMockWorkflows, getMockWorkflowByCode } from "../mock/workflow.mock";
import {
  getEnhancedMockWorkflows,
  getEnhancedMockWorkflowDesign,
} from "../mock/enhanced-workflow.mock";
import { getTestWorkflowDesign } from "../mock/workflow-examples.mock";
import { getMockNodes, getMockNodesByWorkflow } from "../mock/node.mock";
import {
  getMockAgents,
  createMockAgent,
  updateMockAgent,
  deleteMockAgent,
} from "../mock/agent.mock";
import {
  getMockTemplates,
  createMockTemplate,
  updateMockTemplate,
  deleteMockTemplate,
} from "../mock/template.mock";
import { IDataRequest, IDataResponse } from "./axiosCustom";

export class ApiFallbackService {
  private static useApiFirst = true;
  private static apiHealth = false;

  static setApiHealth(isHealthy: boolean) {
    this.apiHealth = isHealthy;
  }

  static getApiHealth(): boolean {
    return this.apiHealth;
  }

  static shouldUseMockData(): boolean {
    return !this.apiHealth;
  }

  static async executeFallback<T>(
    apiCall: () => Promise<T>,
    mockFallback: () => T
  ): Promise<T> {
    if (!this.useApiFirst || !this.apiHealth) {
      console.log("Using mock data (API unavailable)");
      return mockFallback();
    }

    try {
      const result = await apiCall();
      this.setApiHealth(true);
      return result;
    } catch (error) {
      console.warn("API call failed, falling back to mock data:", error);
      this.setApiHealth(false);
      return mockFallback();
    }
  }

  static handleWorkflowRequests(request: IDataRequest): any {
    const { uri, params, method, data } = request;
    console.log("Mock API Request:", { uri, method, params });

    // Workflows
    if (
      uri.includes("/workflows") &&
      method === "GET" &&
      !uri.includes("/design")
    ) {
      const mockResponse = getEnhancedMockWorkflows(params);
      return {
        value: {
          content: mockResponse.content,
          totalElements: mockResponse.totalElements,
          totalPages: mockResponse.totalPages,
          size: mockResponse.size,
          number: mockResponse.number,
        },
      };
    }

    // Workflow by code
    if (
      uri.includes("/workflows/") &&
      method === "GET" &&
      !uri.includes("/design")
    ) {
      const workflowCode = uri.split("/").pop();
      if (workflowCode) {
        const workflow = getMockWorkflowByCode(workflowCode);
        return { value: { data: workflow } };
      }
    }

    // Workflow design
    if (
      uri.includes("/workflows/") &&
      uri.includes("/design") &&
      method === "GET"
    ) {
      const pathParts = uri.split("/");
      const workflowCodeIndex = pathParts.indexOf("workflows") + 1;
      const workflowCode = pathParts[workflowCodeIndex];

      if (workflowCode) {
        let design = getEnhancedMockWorkflowDesign(workflowCode);
        if (!design) {
          design = getTestWorkflowDesign(workflowCode);
        }
        return { value: design || this.getDefaultWorkflowDesign(workflowCode) };
      }
    }

    // Save workflow design
    if (
      uri.includes("/workflows/") &&
      uri.includes("/design") &&
      method === "POST"
    ) {
      console.log("Saving workflow design:", data);
      return { value: data };
    }

    // Nodes
    if (uri.includes("/nodes") && method === "GET") {
      const mockResponse = getMockNodes(params);
      return {
        value: {
          content: mockResponse.content,
          totalElements: mockResponse.totalElements,
          totalPages: mockResponse.totalPages,
          size: mockResponse.size,
          number: mockResponse.number,
        },
      };
    }

    // Nodes by workflow
    if (uri.includes("/workflows/") && uri.includes("/nodes")) {
      const pathParts = uri.split("/");
      const workflowCode = pathParts[pathParts.indexOf("workflows") + 1];
      if (workflowCode) {
        const nodes = getMockNodesByWorkflow(workflowCode);
        return { value: { data: nodes } };
      }
    }

    // Agents
    if (uri.includes("/agents")) {
      if (method === "GET") {
        const mockResponse = getMockAgents(params);
        return {
          value: {
            content: mockResponse.content,
            totalElements: mockResponse.totalElements,
            totalPages: mockResponse.totalPages,
            size: mockResponse.size,
            number: mockResponse.number,
          },
        };
      }
      if (method === "POST") {
        const newAgent = createMockAgent(data);
        return { value: { data: newAgent } };
      }
      if (method === "PUT" || method === "PATCH") {
        const agentCode = uri.split("/").pop();
        if (agentCode) {
          const updated = updateMockAgent(parseInt(agentCode), data);
          return { value: { data: updated } };
        }
      }
      if (method === "DELETE") {
        const agentCode = uri.split("/").pop();
        if (agentCode) {
          deleteMockAgent(parseInt(agentCode));
          return { value: { success: true } };
        }
      }
    }

    // Templates
    if (uri.includes("/templates")) {
      if (method === "GET") {
        const mockResponse = getMockTemplates(params);
        return {
          value: {
            content: mockResponse.content,
            totalElements: mockResponse.totalElements,
            totalPages: mockResponse.totalPages,
            size: mockResponse.size,
            number: mockResponse.number,
          },
        };
      }
      if (method === "POST") {
        const newTemplate = createMockTemplate(data);
        return { value: { data: newTemplate } };
      }
      if (method === "PUT" || method === "PATCH") {
        const templateCode = uri.split("/").pop();
        if (templateCode) {
          const updated = updateMockTemplate(parseInt(templateCode), data);
          return { value: { data: updated } };
        }
      }
      if (method === "DELETE") {
        const templateCode = uri.split("/").pop();
        if (templateCode) {
          deleteMockTemplate(parseInt(templateCode));
          return { value: { success: true } };
        }
      }
    }

    // Health checks
    if (
      uri.includes("health") ||
      uri.includes("status") ||
      uri.includes("ping")
    ) {
      return {
        value: {
          status: "OK",
          timestamp: new Date().toISOString(),
          mode: "mock",
        },
      };
    }

    // Default fallback
    return {
      value: {
        message: "Mock response for " + uri,
        timestamp: new Date().toISOString(),
        data: null,
      },
    };
  }

  private static getDefaultWorkflowDesign(workflowCode: string) {
    return {
      workflowCode,
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    };
  }
}

export default ApiFallbackService;
