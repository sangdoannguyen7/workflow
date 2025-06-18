import {
  INode,
  INodeResponse,
  INodeSearchParams,
} from "../../interface/node.interface";
import { INodeApi } from "./api.node.interface";
import {
  getMockNodes,
  getMockNodeById,
  getMockNodeByCode,
  getMockNodesByWorkflow,
  getMockNodesByTemplate,
  mockNodes,
} from "../../mock/node.mock";

class NodeApi implements INodeApi {
  private nextId = Math.max(...mockNodes.map((n) => n.nodeId || 0)) + 1;

  async getNodes(params?: INodeSearchParams): Promise<INodeResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMockNodes(params));
      }, 300);
    });
  }

  async getNodeById(id: number): Promise<INode> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const node = getMockNodeById(id);
        if (node) {
          resolve(node);
        } else {
          reject(new Error("Node not found"));
        }
      }, 200);
    });
  }

  async createNode(node: Omit<INode, "nodeId">): Promise<INode> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newNode: INode = {
          ...node,
          nodeId: this.nextId++,
          search:
            `${node.nodeCode} ${node.nodeName} ${node.templateType} ${node.statusName}`.toLowerCase(),
        };
        mockNodes.push(newNode);
        resolve(newNode);
      }, 500);
    });
  }

  async updateNode(id: number, node: INode): Promise<INode> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockNodes.findIndex((n) => n.nodeId === id);
        if (index !== -1) {
          const updatedNode = {
            ...node,
            nodeId: id,
            search:
              `${node.nodeCode} ${node.nodeName} ${node.templateType} ${node.statusName}`.toLowerCase(),
          };
          mockNodes[index] = updatedNode;
          resolve(updatedNode);
        } else {
          reject(new Error("Node not found"));
        }
      }, 500);
    });
  }

  async deleteNode(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockNodes.findIndex((n) => n.nodeId === id);
        if (index !== -1) {
          mockNodes.splice(index, 1);
          resolve();
        } else {
          reject(new Error("Node not found"));
        }
      }, 300);
    });
  }

  async getNodeByCode(code: string): Promise<INode> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const node = getMockNodeByCode(code);
        if (node) {
          resolve(node);
        } else {
          reject(new Error("Node not found"));
        }
      }, 200);
    });
  }

  async getNodesByWorkflow(workflowCode: string): Promise<INode[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMockNodesByWorkflow(workflowCode));
      }, 200);
    });
  }

  async getNodesByTemplate(templateCode: string): Promise<INode[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMockNodesByTemplate(templateCode));
      }, 200);
    });
  }
}

export default new NodeApi();
