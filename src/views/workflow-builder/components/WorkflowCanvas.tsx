import React, { useCallback, DragEvent } from "react";
import { Typography, message } from "antd";
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  ConnectionMode,
  Panel,
  useReactFlow,
  ReactFlowInstance,
  Handle,
  Position,
  NodeProps,
} from "@xyflow/react";
import { ApartmentOutlined } from "@ant-design/icons";
import "@xyflow/react/dist/style.css";
import "../../../styles/workflow-edges.css";

import {
  NodeType,
  getNodeTypeFromTemplate,
  NODE_TYPE_CONFIGS,
  getNodeTypeColor,
} from "../../../types/workflow-nodes.types";

const { Text, Title } = Typography;

const ICON_MAP = {
  [NodeType.TRIGGER]: "🚀",
  [NodeType.BEHAVIOR]: "⚙️",
  [NodeType.OUTPUT]: "📤",
};

// Enhanced WorkflowNode component with clean structure
const WorkflowNode: React.FC<NodeProps> = ({
  data,
  selected,
  id,
  dragging,
}) => {
  const nodeType = getNodeTypeFromTemplate(data.templateType);
  const config = NODE_TYPE_CONFIGS[nodeType];
  const canHaveInput = nodeType !== NodeType.TRIGGER;
  const canHaveOutput = nodeType !== NodeType.OUTPUT;

  return (
    <article
      className="workflow-node"
      style={{
        padding: "18px",
        border: selected
          ? `3px solid ${config.color}`
          : `2px solid ${config.borderColor}`,
        borderRadius: "16px",
        background: "#fff",
        minWidth: "220px",
        maxWidth: "280px",
        boxShadow: selected
          ? `0 12px 24px ${config.color}30`
          : dragging
          ? "0 16px 32px rgba(0,0,0,0.2)"
          : "0 4px 12px rgba(0,0,0,0.1)",
        position: "relative",
        // CRITICAL: Disable transitions during drag for perfect sync
        transition: dragging ? "none" : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: dragging ? "grabbing" : "pointer",
        // Hardware acceleration
        willChange: dragging ? "transform" : "auto",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)",
        zIndex: dragging ? 1000 : selected ? 100 : "auto",
      }}
    >
      {/* Input Handle */}
      {canHaveInput && (
        <Handle
          type="target"
          position={Position.Left}
          id="input"
          className="node-handle node-handle-input"
          style={{
            left: -8,
            width: 16,
            height: 16,
            border: `3px solid ${config.color}`,
            backgroundColor: "#fff",
            borderRadius: "50%",
            transition: dragging ? "none" : "all 0.2s ease",
            willChange: dragging ? "none" : "transform",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
            zIndex: 15,
            cursor: "crosshair",
          }}
        />
      )}

      {/* Output Handle */}
      {canHaveOutput && (
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="node-handle node-handle-output"
          style={{
            right: -8,
            width: 16,
            height: 16,
            border: `3px solid ${config.color}`,
            backgroundColor: "#fff",
            borderRadius: "50%",
            transition: dragging ? "none" : "all 0.2s ease",
            willChange: dragging ? "none" : "transform",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
            zIndex: 15,
            cursor: "crosshair",
          }}
        />
      )}

      {/* Top gradient accent */}
      <div
        className="node-accent"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "5px",
          borderRadius: "16px 16px 0 0",
          background: `linear-gradient(90deg, ${config.color}, ${config.color}80)`,
        }}
      />

      {/* Node type badge */}
      <div
        className="node-type-badge"
        style={{
          position: "absolute",
          top: "-10px",
          right: "-10px",
          background: config.color,
          color: "white",
          borderRadius: "14px",
          padding: "6px 10px",
          fontSize: "11px",
          fontWeight: "bold",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        {nodeType.toUpperCase()}
      </div>

      {/* Node header */}
      <header
        className="node-header"
        style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}
      >
        <div
          className="node-icon"
          style={{
            fontSize: "28px",
            marginRight: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: `${config.color}15`,
          }}
        >
          {ICON_MAP[nodeType]}
        </div>
        <div className="node-info" style={{ flex: 1 }}>
          <Text
            strong
            className="node-title"
            style={{
              fontSize: "16px",
              color: config.color,
              display: "block",
              lineHeight: "1.3",
            }}
          >
            {data.label}
          </Text>
          <Text
            className="node-code"
            style={{ fontSize: "12px", color: "#999" }}
          >
            {data.templateCode}
          </Text>
        </div>
      </header>

      {/* Node description */}
      {data.description && (
        <main className="node-description" style={{ marginBottom: "12px" }}>
          <Text
            style={{
              fontSize: "12px",
              color: "#666",
              display: "block",
              lineHeight: "1.4",
            }}
          >
            {data.description.length > 90
              ? `${data.description.substring(0, 90)}...`
              : data.description}
          </Text>
        </main>
      )}

      {/* Node metadata */}
      <footer className="node-footer">
        <div
          className="node-agent"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "11px",
            color: "#999",
            marginBottom: "8px",
          }}
        >
          <span>Agent: {data.agentCode || "N/A"}</span>
          <div
            className="node-status-indicator"
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: selected ? config.color : "#ccc",
              transition: "background-color 0.2s ease",
            }}
          />
        </div>

        {/* Connection info */}
        <div
          className="node-connection-info"
          style={{
            fontSize: "10px",
            color: config.color,
            fontWeight: "600",
            textAlign: "center",
            padding: "4px 8px",
            background: `${config.color}10`,
            borderRadius: "6px",
          }}
        >
          {!canHaveInput && "⭐ START NODE"}
          {!canHaveOutput && "🏁 END NODE"}
          {canHaveInput && canHaveOutput && "🔄 PROCESS NODE"}
        </div>
      </footer>
    </article>
  );
};

const nodeTypes = {
  workflowNode: WorkflowNode,
};

interface WorkflowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  onNodeClick: any;
  onPaneClick: any;
  onDrop: any;
  onDragOver: any;
  onDragLeave: any;
  isPlaying: boolean;
  isDragging: boolean;
  selectedNode: Node | null;
  onInit: (instance: ReactFlowInstance) => void;
}

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  onDrop,
  onDragOver,
  onDragLeave,
  isPlaying,
  isDragging,
  onInit,
}) => {
  const reactFlowInstance = useReactFlow();

  // Enhanced drop handler with React Flow positioning
  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      console.log("Canvas drop event triggered");

      const data = event.dataTransfer.getData("application/reactflow");
      if (!data) {
        console.log("No drag data found");
        return;
      }

      try {
        const { template, nodeType } = JSON.parse(data);

        // Use React Flow's screen to flow position for accurate placement
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        console.log("Calculated position:", position);

        // Call parent drop handler with enhanced data
        onDrop(event, { template, nodeType, position });
      } catch (error) {
        console.error("Error processing drop:", error);
        message.error("Failed to process template drop");
      }
    },
    [reactFlowInstance, onDrop]
  );

  return (
    <main
      className="workflow-canvas"
      style={{
        flex: 1,
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={handleDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onInit={onInit}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        attributionPosition="bottom-left"
        panOnDrag
        selectNodesOnDrag={false}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        style={{
          background: isDragging
            ? "linear-gradient(135deg, #e6f7ff, #f0f9ff)"
            : "linear-gradient(135deg, #fafafa, #f5f5f5)",
          transition: "background 0.3s ease",
        }}
      >
        {/* Enhanced Controls */}
        <Controls
          className="workflow-controls"
          style={{
            background: "rgba(255,255,255,0.95)",
            border: "1px solid #e8e8e8",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            backdropFilter: "blur(8px)",
          }}
        />

        {/* Enhanced MiniMap */}
        <MiniMap
          className="workflow-minimap"
          nodeColor={(node) => {
            const nodeType = getNodeTypeFromTemplate(node.data?.templateType);
            return getNodeTypeColor(nodeType);
          }}
          style={{
            backgroundColor: "rgba(255,255,255,0.95)",
            border: "1px solid #e8e8e8",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            backdropFilter: "blur(8px)",
          }}
        />

        {/* Grid Background */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={2}
          color="#e8e8e8"
        />

        {/* Empty State */}
        {nodes.length === 0 && (
          <Panel position="top-center">
            <div
              className="empty-state"
              style={{
                padding: "40px",
                background: "rgba(255,255,255,0.98)",
                borderRadius: "24px",
                border: "2px dashed #d9d9d9",
                textAlign: "center",
                maxWidth: "600px",
                boxShadow: "0 12px 48px rgba(0,0,0,0.08)",
                backdropFilter: "blur(16px)",
              }}
            >
              <ApartmentOutlined
                style={{
                  fontSize: "72px",
                  color: "#1890ff",
                  marginBottom: "24px",
                  display: "block",
                  opacity: 0.8,
                }}
              />
              <Title
                level={2}
                style={{ marginBottom: "16px", color: "#1890ff" }}
              >
                Welcome to Workflow Builder
              </Title>
              <div
                style={{
                  fontSize: "16px",
                  lineHeight: "1.7",
                  color: "#666",
                  maxWidth: "480px",
                  margin: "0 auto",
                }}
              >
                <p>
                  <strong>🎯 Step 1:</strong> Drag templates from the left
                  sidebar into this canvas
                </p>
                <p>
                  <strong>🔗 Step 2:</strong> Connect nodes: 🚀 TRIGGER → ⚙️
                  BEHAVIOR → 📤 OUTPUT
                </p>
                <p>
                  <strong>💾 Step 3:</strong> Configure node properties and save
                  your workflow
                </p>
              </div>
            </div>
          </Panel>
        )}

        {/* Drop Feedback */}
        {isDragging && (
          <Panel position="bottom-center">
            <div
              className="drop-feedback"
              style={{
                padding: "20px 40px",
                background: "linear-gradient(135deg, #1890ff, #40a9ff)",
                color: "white",
                borderRadius: "32px",
                fontSize: "18px",
                fontWeight: "600",
                boxShadow: "0 12px 48px rgba(24, 144, 255, 0.4)",
                backdropFilter: "blur(16px)",
                border: "2px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span style={{ fontSize: "24px" }}>✨</span>
              Drop here to create a new node
            </div>
          </Panel>
        )}
      </ReactFlow>
    </main>
  );
};

export default WorkflowCanvas;
