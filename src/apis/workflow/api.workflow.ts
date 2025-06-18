import axiosCustom, { IDataRequest, IDataResponse } from "../axiosCustom";
import {
  IWorkflow,
  IWorkflowResponse,
  IWorkflowSearchParams,
  IWorkflowDesign,
  IWorkflowRequest,
} from "../../interface/workflow.interface";
import { SingleApiResponse } from "../../interface/common.interface";
import { IWorkflowApi } from "./api.workflow.interface";

class WorkflowApi implements IWorkflowApi {
  private readonly baseUrl = "/v1/property/workflows";

  async getWorkflows(
    params?: IWorkflowSearchParams
  ): Promise<IWorkflowResponse> {
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

    const response: IDataResponse<IWorkflowResponse> = await axiosCustom(
      request
    );
    return response.value;
  }

  async getWorkflowById(id: number): Promise<IWorkflow> {
    throw new Error("API does not support getById, use getByCode instead");
  }

  async createWorkflow(workflowRequest: IWorkflowRequest): Promise<IWorkflow> {
    const request: IDataRequest = {
      method: "POST",
      uri: this.baseUrl,
      params: null,
      data: workflowRequest,
    };
    const response: IDataResponse<SingleApiResponse<IWorkflow>> =
      await axiosCustom(request);
    return response.value.data;
  }

  async updateWorkflow(
    workflowCode: string,
    workflowRequest: IWorkflowRequest
  ): Promise<IWorkflow> {
    const request: IDataRequest = {
      method: "PATCH",
      uri: `${this.baseUrl}/${workflowCode}`,
      params: null,
      data: workflowRequest,
    };
    const response: IDataResponse<SingleApiResponse<IWorkflow>> =
      await axiosCustom(request);
    return response.value.data;
  }

  async deleteWorkflow(workflowCode: string): Promise<void> {
    const request: IDataRequest = {
      method: "DELETE",
      uri: `${this.baseUrl}/${workflowCode}`,
      params: null,
      data: null,
    };
    await axiosCustom(request);
  }

  async getWorkflowByCode(code: string): Promise<IWorkflow> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/${code}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<SingleApiResponse<IWorkflow>> =
      await axiosCustom(request);
    return response.value.data;
  }

  // For workflow design - store as metadata in workflow description or separate endpoint
  async getWorkflowDesign(workflowCode: string): Promise<IWorkflowDesign> {
    try {
      const workflow = await this.getWorkflowByCode(workflowCode);

      // Try to extract design from workflow description or metadata
      let design: IWorkflowDesign = {
        workflowCode,
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
      };

      if (workflow.nodes && workflow.nodes.length > 0) {
        design.nodes = workflow.nodes.map((node, index) => {
          let position = {
            x: 100 + (index % 3) * 250,
            y: 100 + Math.floor(index / 3) * 150,
          };

          // Try to parse position from metadata
          try {
            if (node.metadata) {
              const metadata = JSON.parse(node.metadata);
              if (metadata.position) {
                position = metadata.position;
              }
            }
          } catch (e) {
            console.warn("Failed to parse node metadata");
          }

          return {
            id: node.nodeCode,
            position,
            data: {
              label: node.nodeName,
              nodeCode: node.nodeCode,
              templateCode: node.templateCode,
              templateType: node.templateType || "restapi",
              agentCode: node.agentCode,
              description: node.description,
              info: node.info,
            },
          };
        });

        // Try to extract edges from node rules
        const edges: any[] = [];
        workflow.nodes.forEach((node) => {
          try {
            if (node.rule) {
              const rule = JSON.parse(node.rule);
              if (rule.edges) {
                edges.push(...rule.edges);
              }
            }
          } catch (e) {
            console.warn("Failed to parse node rule");
          }
        });

        design.edges = edges.map((edge, index) => ({
          id: edge.id || `edge-${index}`,
          source: edge.source,
          target: edge.target,
          type: edge.type || "default",
        }));
      }

      return design;
    } catch (error) {
      return {
        workflowCode,
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
      };
    }
  }

  async saveWorkflowDesign(
    workflowCode: string,
    design: IWorkflowDesign
  ): Promise<IWorkflowDesign> {
    try {
      const workflow = await this.getWorkflowByCode(workflowCode);

      // Convert design nodes to workflow nodes
      const nodes = design.nodes.map((node) => ({
        nodeCode: node.id,
        nodeName: node.data.label,
        templateCode: node.data.templateCode || "",
        templateName: node.data.label,
        typeCode: node.data.templateType || "DEFAULT",
        typeName: node.data.templateType || "Default",
        agentCode: node.data.agentCode || "",
        agentName: node.data.agentCode || "",
        description: node.data.description || "",
        search: `${node.data.label} ${node.data.templateCode}`.toLowerCase(),
        metadata: JSON.stringify({ position: node.position }),
        info: node.data.info || JSON.stringify({}),
        schema: "",
        body: "",
        rule: JSON.stringify({
          edges: design.edges.filter(
            (e) => e.source === node.id || e.target === node.id
          ),
        }),
        configuration: "",
        outputCode: "",
      }));

      const workflowRequest: IWorkflowRequest = {
        workflowName: workflow.workflowName,
        statusCode: workflow.statusCode,
        statusName: workflow.statusName,
        description: workflow.description || "",
        nodes,
      };

      await this.updateWorkflow(workflowCode, workflowRequest);
      return design;
    } catch (error) {
      throw new Error("Failed to save workflow design");
    }
  }
}

export default new WorkflowApi();
