import { getMockWorkflows, getMockWorkflowByCode } from "../mock/workflow.mock";
import { getEnhancedMockWorkflows } from "../mock/enhanced-workflow.mock";
import { getMockNodes, getMockNodesByWorkflow } from "../mock/node.mock";
import { getMockAgents } from "../mock/agent.mock";
import { getMockTemplates } from "../mock/template.mock";
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
    const { uri, params } = request;

    // Workflows
    if (uri === "/v1/workflows" && request.method === "GET") {
      return getMockWorkflows(params);
    }

    if (uri.startsWith("/v1/workflows/") && request.method === "GET") {
      const workflowCode = uri.split("/").pop();
      if (workflowCode) {
        const workflow = getMockWorkflowByCode(workflowCode);
        return { data: workflow };
      }
    }

    // Nodes
    if (uri === "/v1/nodes" && request.method === "GET") {
      return getMockNodes(params);
    }

    if (uri.startsWith("/v1/workflows/") && uri.includes("/nodes")) {
      const pathParts = uri.split("/");
      const workflowCode = pathParts[pathParts.indexOf("workflows") + 1];
      if (workflowCode) {
        const nodes = getMockNodesByWorkflow(workflowCode);
        return { data: nodes };
      }
    }

    // Agents
    if (uri === "/v1/agents" && request.method === "GET") {
      return getMockAgents(params);
    }

    // Templates
    if (uri === "/v1/templates" && request.method === "GET") {
      return getMockTemplates(params);
    }

    // Health checks
    if (
      uri.includes("health") ||
      uri.includes("status") ||
      uri.includes("ping")
    ) {
      return { status: "OK", timestamp: new Date().toISOString() };
    }

    // Default fallback
    return {
      message: "Mock response for " + uri,
      timestamp: new Date().toISOString(),
      data: null,
    };
  }
}

export default ApiFallbackService;
