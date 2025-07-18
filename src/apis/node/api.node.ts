import axiosCustom, { IDataRequest, IDataResponse } from "../axiosCustom";
import {
  INode,
  INodeResponse,
  INodeSearchParams,
  INodeCreateRequest,
  INodeInitRequest,
} from "../../interface/node.interface";
import {
  ValueResponse,
  ListResponse,
} from "../../interface/template.interface";
import { PageImplResponse } from "../../interface/agent.interface";
import { INodeApi } from "./api.node.interface";

class NodeApi implements INodeApi {
  private readonly baseUrl = "/v1/property/nodes";

  async getNodes(params?: INodeSearchParams): Promise<INodeResponse> {
    // Note: API doesn't have getAll nodes endpoint, this might need to be implemented on backend
    throw new Error("API does not have getAll nodes endpoint");
  }

  async getNodeById(id: number): Promise<INode> {
    // Note: API doesn't have getById endpoint
    throw new Error("API does not support getById");
  }

  async createNode(createRequest: INodeCreateRequest): Promise<INode> {
    const request: IDataRequest = {
      method: "POST",
      uri: this.baseUrl,
      params: null,
      data: createRequest,
    };
    const response: IDataResponse<ValueResponse<INode>> = await axiosCustom(
      request
    );
    return response.value.data;
  }

  async updateNode(id: number, node: INode): Promise<INode> {
    throw new Error("API does not support update node");
  }

  async deleteNode(id: number): Promise<void> {
    throw new Error("API does not support delete node");
  }

  async getNodeByCode(code: string): Promise<INode> {
    throw new Error("API does not support getByCode");
  }

  async getNodesByWorkflow(workflowCode: string): Promise<INode[]> {
    // This will be handled by workflow API
    throw new Error("Use workflow API to get nodes");
  }

  async getNodesByTemplate(templateCode: string): Promise<INode[]> {
    throw new Error("API does not support getByTemplate");
  }

  async initializeNodes(initRequest: INodeInitRequest): Promise<INode[]> {
    const request: IDataRequest = {
      method: "POST",
      uri: `${this.baseUrl}/initialize`,
      params: null,
      data: initRequest,
    };
    const response: IDataResponse<ListResponse<INode>> = await axiosCustom(
      request
    );
    return response.value.data;
  }
}

export default new NodeApi();
