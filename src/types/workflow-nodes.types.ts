import React from "react";
import { ApiOutlined, LinkOutlined, ScheduleOutlined } from "@ant-design/icons";

// Node Types enum
export enum NodeType {
  TRIGGER = "trigger",
  BEHAVIOR = "behavior",
  OUTPUT = "output",
}

// Node type configurations
export interface NodeTypeConfig {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  emoji: string;
  description: string;
}

export const NODE_TYPE_CONFIGS: Record<NodeType, NodeTypeConfig> = {
  [NodeType.TRIGGER]: {
    icon: <LinkOutlined />,
    color: "#52c41a",
    bgColor: "#f6ffed",
    borderColor: "#b7eb8f",
    emoji: "🚀",
    description: "Khởi động workflow - chỉ có output",
  },
  [NodeType.BEHAVIOR]: {
    icon: <ApiOutlined />,
    color: "#1890ff",
    bgColor: "#e6f7ff",
    borderColor: "#91d5ff",
    emoji: "⚙️",
    description: "Xử lý logic - có input và output",
  },
  [NodeType.OUTPUT]: {
    icon: <ScheduleOutlined />,
    color: "#fa8c16",
    bgColor: "#fff7e6",
    borderColor: "#ffd591",
    emoji: "📤",
    description: "Kết thúc workflow - chỉ có input",
  },
};

// Helper functions
export const getNodeTypeFromTemplate = (templateType?: string): NodeType => {
  if (!templateType) return NodeType.BEHAVIOR;

  const type = templateType.toLowerCase();

  // Check for trigger patterns
  if (
    type.includes("webhook") ||
    type.includes("trigger") ||
    type.includes("start") ||
    type.includes("init")
  ) {
    return NodeType.TRIGGER;
  }

  // Check for output patterns
  if (
    type.includes("output") ||
    type.includes("result") ||
    type.includes("end") ||
    type.includes("finish") ||
    type.includes("complete")
  ) {
    return NodeType.OUTPUT;
  }

  // Default to behavior for processing nodes
  return NodeType.BEHAVIOR;
};

export const canNodesConnect = (
  sourceType: NodeType,
  targetType: NodeType
): boolean => {
  // TRIGGER chỉ có thể kết nối tới BEHAVIOR hoặc OUTPUT
  if (sourceType === NodeType.TRIGGER && targetType === NodeType.TRIGGER) {
    return false;
  }

  // OUTPUT không thể là source (không có output handle)
  if (sourceType === NodeType.OUTPUT) {
    return false;
  }

  // TRIGGER không thể là target (không có input handle)
  if (targetType === NodeType.TRIGGER) {
    return false;
  }

  return true;
};

export const getNodeTypeColor = (nodeType: NodeType): string => {
  return NODE_TYPE_CONFIGS[nodeType]?.color || "#1890ff";
};

export const getNodeTypeIcon = (
  nodeType: NodeType | string
): React.ReactNode => {
  if (typeof nodeType === "string") {
    const enumValue = Object.values(NodeType).find(
      (type) => type === nodeType
    ) as NodeType;
    return NODE_TYPE_CONFIGS[enumValue]?.icon || <ApiOutlined />;
  }
  return NODE_TYPE_CONFIGS[nodeType]?.icon || <ApiOutlined />;
};

export const getNodeTypeBgColor = (nodeType: NodeType): string => {
  return NODE_TYPE_CONFIGS[nodeType]?.bgColor || "#e6f7ff";
};

export const getNodeTypeBorderColor = (nodeType: NodeType): string => {
  return NODE_TYPE_CONFIGS[nodeType]?.borderColor || "#91d5ff";
};

export const getNodeTypeEmoji = (nodeType: NodeType): string => {
  return NODE_TYPE_CONFIGS[nodeType]?.emoji || "⚙️";
};

export const getNodeTypeDescription = (nodeType: NodeType): string => {
  return NODE_TYPE_CONFIGS[nodeType]?.description || "Node xử lý logic";
};

// Validation helpers
export const validateWorkflow = (
  nodes: any[],
  edges: any[]
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if workflow has at least one TRIGGER
  const triggerNodes = nodes.filter(
    (node) =>
      getNodeTypeFromTemplate(node.data?.templateType) === NodeType.TRIGGER
  );

  if (triggerNodes.length === 0) {
    errors.push("Workflow phải có ít nhất một node TRIGGER để khởi động");
  }

  if (triggerNodes.length > 1) {
    warnings.push(
      "Workflow có nhiều hơn một TRIGGER node, có thể gây xung đột"
    );
  }

  // Check if workflow has at least one OUTPUT
  const outputNodes = nodes.filter(
    (node) =>
      getNodeTypeFromTemplate(node.data?.templateType) === NodeType.OUTPUT
  );

  if (outputNodes.length === 0) {
    warnings.push("Workflow nên có ít nhất một node OUTPUT để kết thúc");
  }

  // Check for disconnected nodes
  const connectedNodeIds = new Set();
  edges.forEach((edge) => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  const disconnectedNodes = nodes.filter(
    (node) => !connectedNodeIds.has(node.id)
  );
  if (disconnectedNodes.length > 0) {
    warnings.push(
      `${disconnectedNodes.length} node(s) không được kết nối với workflow`
    );
  }

  // Check for invalid connections
  edges.forEach((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);

    if (sourceNode && targetNode) {
      const sourceType = getNodeTypeFromTemplate(sourceNode.data?.templateType);
      const targetType = getNodeTypeFromTemplate(targetNode.data?.templateType);

      if (!canNodesConnect(sourceType, targetType)) {
        errors.push(
          `Kết nối không hợp lệ: ${sourceType.toUpperCase()} → ${targetType.toUpperCase()}`
        );
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Export all types
export type { NodeTypeConfig };
