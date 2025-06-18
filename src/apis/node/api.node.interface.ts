import {
  INode,
  INodeResponse,
  INodeSearchParams,
} from "../../interface/node.interface";

export interface INodeApi {
  getNodes(params?: INodeSearchParams): Promise<INodeResponse>;
  getNodeById(id: number): Promise<INode>;
  createNode(node: Omit<INode, "nodeId">): Promise<INode>;
  updateNode(id: number, node: INode): Promise<INode>;
  deleteNode(id: number): Promise<void>;
  getNodeByCode(code: string): Promise<INode>;
  getNodesByWorkflow(workflowCode: string): Promise<INode[]>;
  getNodesByTemplate(templateCode: string): Promise<INode[]>;
}
