export enum NodeType {
  TRIGGER = "trigger",
  BEHAVIOR = "behavior",
  OUTPUT = "output",
}

export enum ConnectionType {
  INPUT = "input",
  OUTPUT = "output",
}

export interface NodeConnectionRules {
  canConnectFrom: NodeType[];
  canConnectTo: NodeType[];
  maxInputs: number;
  maxOutputs: number;
}

export const NODE_CONNECTION_RULES: Record<NodeType, NodeConnectionRules> = {
  [NodeType.TRIGGER]: {
    canConnectFrom: [], // Trigger không nhận input
    canConnectTo: [NodeType.BEHAVIOR, NodeType.OUTPUT], // Trigger có thể kết nối đến behavior hoặc output
    maxInputs: 0, // Không có input
    maxOutputs: -1, // Không giới hạn output
  },
  [NodeType.BEHAVIOR]: {
    canConnectFrom: [NodeType.TRIGGER, NodeType.BEHAVIOR], // Behavior có thể nhận từ trigger hoặc behavior khác
    canConnectTo: [NodeType.BEHAVIOR, NodeType.OUTPUT], // Behavior có thể kết nối đến behavior hoặc output
    maxInputs: -1, // Không giới hạn input
    maxOutputs: -1, // Không giới hạn output
  },
  [NodeType.OUTPUT]: {
    canConnectFrom: [NodeType.TRIGGER, NodeType.BEHAVIOR], // Output có thể nhận từ trigger hoặc behavior
    canConnectTo: [], // Output không có output
    maxInputs: -1, // Không giới hạn input
    maxOutputs: 0, // Không có output
  },
};

export const getNodeTypeFromTemplate = (templateType: string): NodeType => {
  switch (templateType) {
    case "webhook":
    case "schedule":
    case "trigger":
      return NodeType.TRIGGER;
    case "webhook_send":
    case "email":
    case "notification":
    case "output":
      return NodeType.OUTPUT;
    case "restapi":
    case "process":
    case "logic":
    case "transform":
    case "behavior":
    default:
      return NodeType.BEHAVIOR;
  }
};

export const canNodesConnect = (
  sourceType: NodeType,
  targetType: NodeType
): boolean => {
  const sourceRules = NODE_CONNECTION_RULES[sourceType];
  const targetRules = NODE_CONNECTION_RULES[targetType];

  return (
    sourceRules.canConnectTo.includes(targetType) &&
    targetRules.canConnectFrom.includes(sourceType)
  );
};

export const getNodeTypeColor = (nodeType: NodeType): string => {
  switch (nodeType) {
    case NodeType.TRIGGER:
      return "#52c41a"; // Green for triggers
    case NodeType.BEHAVIOR:
      return "#1890ff"; // Blue for behaviors
    case NodeType.OUTPUT:
      return "#fa8c16"; // Orange for outputs
    default:
      return "#666";
  }
};

export const getNodeTypeIcon = (nodeType: NodeType): string => {
  switch (nodeType) {
    case NodeType.TRIGGER:
      return "🚀"; // Rocket for triggers
    case NodeType.BEHAVIOR:
      return "⚙️"; // Gear for behaviors
    case NodeType.OUTPUT:
      return "📤"; // Outbox for outputs
    default:
      return "📦";
  }
};
