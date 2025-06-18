import axiosCustom, { IDataRequest, IDataResponse } from "../axiosCustom";
import {
  INode,
  INodeResponse,
  INodeSearchParams,
} from "../../interface/node.interface";
import { INodeApi } from "./api.node.interface";

class NodeApi implements INodeApi {
  private readonly baseUrl = "/api/nodes";

  async getNodes(params?: INodeSearchParams): Promise<INodeResponse> {
    const request: IDataRequest = {
      method: "GET",
      uri: this.baseUrl,
      params: params || null,
      data: null,
    };
    const response: IDataResponse<INode> = await axiosCustom(request);
    return {
      content: response.data,
      totalElements: response.total,
      totalPages: response.totalPage,
      size: response.pageSize,
      number: response.page,
    };
  }

  async getNodeById(id: number): Promise<INode> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/${id}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<INode> = await axiosCustom(request);
    return response.value;
  }

  async createNode(node: Omit<INode, "nodeId">): Promise<INode> {
    const request: IDataRequest = {
      method: "POST",
      uri: this.baseUrl,
      params: null,
      data: node,
    };
    const response: IDataResponse<INode> = await axiosCustom(request);
    return response.value;
  }

  async updateNode(id: number, node: INode): Promise<INode> {
    const request: IDataRequest = {
      method: "PUT",
      uri: `${this.baseUrl}/${id}`,
      params: null,
      data: node,
    };
    const response: IDataResponse<INode> = await axiosCustom(request);
    return response.value;
  }

  async deleteNode(id: number): Promise<void> {
    const request: IDataRequest = {
      method: "DELETE",
      uri: `${this.baseUrl}/${id}`,
      params: null,
      data: null,
    };
    await axiosCustom(request);
  }

  async getNodeByCode(code: string): Promise<INode> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/code/${code}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<INode> = await axiosCustom(request);
    return response.value;
  }

  async getNodesByWorkflow(workflowCode: string): Promise<INode[]> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/workflow/${workflowCode}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<INode> = await axiosCustom(request);
    return response.data;
  }

  async getNodesByTemplate(templateCode: string): Promise<INode[]> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/template/${templateCode}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<INode> = await axiosCustom(request);
    return response.data;
  }
}

export default new NodeApi();
