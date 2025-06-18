import axiosCustom, { IDataRequest, IDataResponse } from "../axiosCustom";
import {
  INode,
  INodeResponse,
  INodeSearchParams,
  INodeRequest,
} from "../../interface/node.interface";

class NodeApi {
  private readonly baseUrl = "/v1/property/nodes";

  async getNodes(params?: INodeSearchParams): Promise<INodeResponse> {
    const request: IDataRequest = {
      method: "GET",
      uri: this.baseUrl,
      params: params || {},
      data: null,
    };

    const response: IDataResponse<INodeResponse> = await axiosCustom(request);
    return response.value;
  }

  async getNodeById(id: number): Promise<INode> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/${id}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<{ data: INode }> = await axiosCustom(request);
    return response.value.data;
  }

  async getNodeByCode(code: string): Promise<INode> {
    const request: IDataRequest = {
      method: "GET",
      uri: `${this.baseUrl}/${code}`,
      params: null,
      data: null,
    };
    const response: IDataResponse<{ data: INode }> = await axiosCustom(request);
    return response.value.data;
  }

  async getNodesByWorkflow(workflowCode: string): Promise<INode[]> {
    const request: IDataRequest = {
      method: "GET",
      uri: `/v1/property/workflows/${workflowCode}/nodes`,
      params: null,
      data: null,
    };
    const response: IDataResponse<{ data: INode[] }> = await axiosCustom(
      request
    );
    return response.value.data;
  }

  async createNode(nodeRequest: INodeRequest): Promise<INode> {
    const request: IDataRequest = {
      method: "POST",
      uri: this.baseUrl,
      params: null,
      data: nodeRequest,
    };
    const response: IDataResponse<{ data: INode }> = await axiosCustom(request);
    return response.value.data;
  }

  async updateNode(
    nodeCode: string,
    nodeRequest: INodeRequest
  ): Promise<INode> {
    const request: IDataRequest = {
      method: "PUT",
      uri: `${this.baseUrl}/${nodeCode}`,
      params: null,
      data: nodeRequest,
    };
    const response: IDataResponse<{ data: INode }> = await axiosCustom(request);
    return response.value.data;
  }

  async deleteNode(nodeCode: string): Promise<void> {
    const request: IDataRequest = {
      method: "DELETE",
      uri: `${this.baseUrl}/${nodeCode}`,
      params: null,
      data: null,
    };
    await axiosCustom(request);
  }
}

const nodeApi = new NodeApi();
export default nodeApi;
