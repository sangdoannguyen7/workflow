import { AxiosResponse } from "axios";
import axiosCustom from "../axiosCustom";
import {
  INode,
  INodeResponse,
  INodeSearchParams,
} from "../../interface/node.interface";
import { INodeApi } from "./api.node.interface";

class NodeApi implements INodeApi {
  private readonly baseUrl = "/api/nodes";

  async getNodes(params?: INodeSearchParams): Promise<INodeResponse> {
    const response: AxiosResponse<INodeResponse> = await axiosCustom.get(
      this.baseUrl,
      { params }
    );
    return response.data;
  }

  async getNodeById(id: number): Promise<INode> {
    const response: AxiosResponse<INode> = await axiosCustom.get(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }

  async createNode(node: Omit<INode, "nodeId">): Promise<INode> {
    const response: AxiosResponse<INode> = await axiosCustom.post(
      this.baseUrl,
      node
    );
    return response.data;
  }

  async updateNode(id: number, node: INode): Promise<INode> {
    const response: AxiosResponse<INode> = await axiosCustom.put(
      `${this.baseUrl}/${id}`,
      node
    );
    return response.data;
  }

  async deleteNode(id: number): Promise<void> {
    await axiosCustom.delete(`${this.baseUrl}/${id}`);
  }

  async getNodeByCode(code: string): Promise<INode> {
    const response: AxiosResponse<INode> = await axiosCustom.get(
      `${this.baseUrl}/code/${code}`
    );
    return response.data;
  }

  async getNodesByWorkflow(workflowCode: string): Promise<INode[]> {
    const response: AxiosResponse<INode[]> = await axiosCustom.get(
      `${this.baseUrl}/workflow/${workflowCode}`
    );
    return response.data;
  }

  async getNodesByTemplate(templateCode: string): Promise<INode[]> {
    const response: AxiosResponse<INode[]> = await axiosCustom.get(
      `${this.baseUrl}/template/${templateCode}`
    );
    return response.data;
  }
}

export default new NodeApi();
