import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  DragEvent,
} from "react";
import {
  Card,
  Button,
  Space,
  message,
  Row,
  Col,
  Select,
  theme,
  Typography,
  Tag,
  Collapse,
  Badge,
  Modal,
  Descriptions,
  Statistic,
} from "antd";
import {
  ApartmentOutlined,
  ApiOutlined,
  ScheduleOutlined,
  LinkOutlined,
  DragOutlined,
  SaveOutlined,
  ReloadOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  DeleteOutlined,
  FullscreenOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  NodeIndexOutlined,
} from "@ant-design/icons";
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ReactFlowProvider,
  BackgroundVariant,
  ConnectionMode,
  Panel,
  useReactFlow,
  ReactFlowInstance,
  Handle,
  Position,
  NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "../../styles/workflow-edges.css";

import { ITemplate } from "../../interface/template.interface";
import { IWorkflow } from "../../interface/workflow.interface";
import { IWorkflowDesign } from "../../interface/workflow.interface";
import templateApi from "../../apis/template/api.template";
import workflowApi from "../../apis/workflow/api.workflow";
import NodePropertiesPanel from "./components/NodePropertiesPanel";
import {
  NodeType,
  getNodeTypeFromTemplate,
  canNodesConnect,
  getNodeTypeColor,
  getNodeTypeIconName,
} from "../../types/workflow-nodes.types";
import { useDragSync } from "../../hooks/useDragSync";

const { Text, Title } = Typography;
const { Panel: CollapsePanel } = Collapse;

// Template configurations với enhanced styling
const TEMPLATE_CONFIGS = {
  [NodeType.TRIGGER]: {
    icon: <LinkOutlined />,
    color: "#52c41a",
    bgColor: "#f6ffed",
    borderColor: "#b7eb8f",
    emoji: "🚀",
  },
  [NodeType.BEHAVIOR]: {
    icon: <ApiOutlined />,
    color: "#1890ff",
    bgColor: "#e6f7ff",
    borderColor: "#91d5ff",
    emoji: "⚙️",
  },
  [NodeType.OUTPUT]: {
    icon: <ScheduleOutlined />,
    color: "#fa8c16",
    bgColor: "#fff7e6",
    borderColor: "#ffd591",
    emoji: "📤",
  },
};

// Enhanced Draggable Template Component
const DraggableTemplate: React.FC<{ template: ITemplate }> = ({ template }) => {
  const nodeType = getNodeTypeFromTemplate(
    template.templateType || template.typeCode || "behavior"
  );
  const config = TEMPLATE_CONFIGS[nodeType];

  const onDragStart = (event: DragEvent<HTMLDivElement>) => {
    console.log("Drag started for template:", template.templateCode);

    const dragData = {
      type: "template",
      template: template,
      nodeType: nodeType,
    };

    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(dragData)
    );
    event.dataTransfer.setData("text/plain", template.templateCode);
    event.dataTransfer.effectAllowed = "copy";

    // Visual feedback với smooth animation
    if (event.currentTarget) {
      event.currentTarget.style.opacity = "0.6";
      event.currentTarget.style.transform = "scale(0.95)";
    }
  };

  const onDragEnd = (event: DragEvent<HTMLDivElement>) => {
    if (event.currentTarget) {
      event.currentTarget.style.opacity = "1";
      event.currentTarget.style.transform = "scale(1)";
    }
  };

  return (
    <div
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{
        border: `2px solid ${config?.borderColor || "#d9d9d9"}`,
        borderRadius: "12px",
        padding: "14px",
        marginBottom: "10px",
        cursor: "grab",
        backgroundColor: config?.bgColor || "#fafafa",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        userSelect: "none",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 8px 25px ${
          config?.color || "#ccc"
        }25`;
        e.currentTarget.style.borderColor = config?.color || "#d9d9d9";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
        e.currentTarget.style.borderColor = config?.borderColor || "#d9d9d9";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.cursor = "grabbing";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.cursor = "grab";
      }}
    >
      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, ${config?.color}, ${config?.color}80)`,
        }}
      />

      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
      >
        <div
          style={{
            color: config?.color || "#666",
            marginRight: "10px",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: `${config?.color}15`,
          }}
        >
          {config?.icon}
        </div>
        <div style={{ flex: 1 }}>
          <Text
            strong
            style={{ color: config?.color || "#666", fontSize: "14px" }}
          >
            {template.templateName}
          </Text>
          <div style={{ fontSize: "20px", marginTop: "2px" }}>
            {config?.emoji}
          </div>
        </div>
      </div>

      <Text
        type="secondary"
        style={{ fontSize: "12px", display: "block", marginBottom: "6px" }}
      >
        {template.templateCode}
      </Text>

      <Text style={{ fontSize: "11px", color: "#999", lineHeight: "1.4" }}>
        {template.description && template.description.length > 60
          ? `${template.description.substring(0, 60)}...`
          : template.description || "No description"}
      </Text>

      <div
        style={{
          marginTop: "10px",
          display: "flex",
          gap: "6px",
          alignItems: "center",
        }}
      >
        <Tag size="small" color={config?.color} style={{ margin: 0 }}>
          {nodeType.toUpperCase()}
        </Tag>
        <Tag
          size="small"
          color={template.statusCode === "ACTIVE" ? "green" : "orange"}
          style={{ margin: 0 }}
        >
          {template.statusName || template.statusCode}
        </Tag>
      </div>
    </div>
  );
};

// FIXED: Enhanced Custom Node Component với SYNCHRONIZED drag performance
const WorkflowNode: React.FC<NodeProps> = ({
  data,
  selected,
  id,
  dragging,
}) => {
  const nodeType = getNodeTypeFromTemplate(data.templateType);
  const config = TEMPLATE_CONFIGS[nodeType];
  const canHaveInput = nodeType !== NodeType.TRIGGER;
  const canHaveOutput = nodeType !== NodeType.OUTPUT;

  return (
    <div
      style={{
        padding: "16px",
        border: selected
          ? `3px solid ${config?.color || "#1890ff"}`
          : `2px solid ${config?.borderColor || "#d9d9d9"}`,
        borderRadius: "12px",
        background: "#fff",
        minWidth: "200px",
        maxWidth: "250px",
        boxShadow: selected
          ? `0 8px 20px ${config?.color || "#1890ff"}30`
          : "0 2px 8px rgba(0,0,0,0.1)",
        position: "relative",
        // CRITICAL FIX: Disable transitions when dragging to sync with edges
        transition: dragging ? "none" : "all 0.2s ease",
        cursor: dragging ? "grabbing" : "pointer",
        // Hardware acceleration optimizations
        willChange: dragging ? "transform" : "auto",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)",
        // Enhanced visual feedback while dragging
        filter: dragging ? "drop-shadow(0 12px 24px rgba(0,0,0,0.2))" : "none",
        zIndex: dragging ? 1000 : "auto",
      }}
    >
      {/* Enhanced Input Handle - SYNCHRONIZED with node movement */}
      {canHaveInput && (
        <Handle
          type="target"
          position={Position.Left}
          id="input"
          style={{
            left: -6,
            width: 12,
            height: 12,
            border: `2px solid ${config?.color || "#666"}`,
            backgroundColor: "#fff",
            borderRadius: "50%",
            // CRITICAL FIX: No transitions during drag for sync
            transition: dragging ? "none" : "all 0.15s ease",
            willChange: dragging ? "none" : "transform",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
            zIndex: 10,
          }}
        />
      )}

      {/* Enhanced Output Handle - SYNCHRONIZED with node movement */}
      {canHaveOutput && (
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          style={{
            right: -6,
            width: 12,
            height: 12,
            border: `2px solid ${config?.color || "#666"}`,
            backgroundColor: "#fff",
            borderRadius: "50%",
            // CRITICAL FIX: No transitions during drag for sync
            transition: dragging ? "none" : "all 0.15s ease",
            willChange: dragging ? "none" : "transform",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
            zIndex: 10,
          }}
        />
      )}

      {/* Top gradient bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          borderRadius: "12px 12px 0 0",
          background: `linear-gradient(90deg, ${config?.color}, ${config?.color}80)`,
        }}
      />

      {/* Node Type Badge */}
      <div
        style={{
          position: "absolute",
          top: "-8px",
          right: "-8px",
          background: config?.color || "#666",
          color: "white",
          borderRadius: "12px",
          padding: "4px 8px",
          fontSize: "10px",
          fontWeight: "bold",
        }}
      >
        {nodeType.toUpperCase()}
      </div>

      {/* Node Header */}
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
      >
        <div
          style={{
            color: config?.color || "#666",
            marginRight: "8px",
            fontSize: "18px",
          }}
        >
          {config?.icon}
        </div>
        <div style={{ flex: 1 }}>
          <Text
            strong
            style={{
              fontSize: "14px",
              color: config?.color || "#666",
              display: "block",
            }}
          >
            {data.label}
          </Text>
          <Text type="secondary" style={{ fontSize: "11px" }}>
            {data.templateCode}
          </Text>
        </div>
      </div>

      {/* Node Content */}
      {data.description && (
        <Text
          style={{
            fontSize: "11px",
            color: "#666",
            display: "block",
            lineHeight: "1.3",
            marginBottom: "8px",
          }}
        >
          {data.description.length > 80
            ? `${data.description.substring(0, 80)}...`
            : data.description}
        </Text>
      )}

      {/* Node Status */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "10px",
          color: "#999",
        }}
      >
        <span>Agent: {data.agentCode}</span>
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: selected ? config?.color : "#ccc",
          }}
        />
      </div>

      {/* Connection Info */}
      <div style={{ fontSize: "9px", color: "#999", marginTop: "4px" }}>
        {!canHaveInput && "⭐ START"}
        {!canHaveOutput && "🏁 END"}
        {canHaveInput && canHaveOutput && "🔄 PROCESS"}
      </div>
    </div>
  );
};

const nodeTypes = {
  workflowNode: WorkflowNode,
};

// REORGANIZED: WorkflowCanvas component với fixed synchronization
const WorkflowCanvas: React.FC<{
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
  nodeTypes: any;
  isPlaying: boolean;
  isDragging: boolean;
  selectedNode: Node | null;
  reactFlowInstance: ReactFlowInstance | null;
  onInit: (instance: ReactFlowInstance) => void;
}> = ({
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
  nodeTypes,
  isPlaying,
  isDragging,
  selectedNode,
  onInit,
}) => {
  const reactFlowInstance = useReactFlow();

  // Enhanced onDrop với useReactFlow
  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      console.log("Drop event with optimized performance");

      const data = event.dataTransfer.getData("application/reactflow");
      if (!data) return;

      try {
        const { template, nodeType } = JSON.parse(data);

        // Sử dụng screenToFlowPosition để tính toán chính xác
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        // Trigger parent component để tạo node
        onDrop(event, { template, nodeType, position });
      } catch (error) {
        console.error("Error in enhanced handleDrop:", error);
      }
    },
    [reactFlowInstance, onDrop]
  );

  return (
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
      // CRITICAL performance optimizations for sync
      minZoom={0.1}
      maxZoom={2}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      proOptions={{ hideAttribution: true }}
      // CRITICAL: Disable animation frame for better sync
      nodesDraggable={true}
      nodesConnectable={true}
      elementsSelectable={true}
      style={{
        background: isDragging
          ? "linear-gradient(135deg, #e6f7ff, #f0f9ff)"
          : "linear-gradient(135deg, #fafafa, #f5f5f5)",
        borderRadius: "12px",
        transition: "background 0.3s ease",
      }}
    >
      <Controls
        style={{
          background: "rgba(255,255,255,0.9)",
          border: "1px solid #e8e8e8",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      />
      <MiniMap
        nodeColor={(node) => {
          const nodeType = getNodeTypeFromTemplate(node.data?.templateType);
          return getNodeTypeColor(nodeType);
        }}
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          border: "1px solid #e8e8e8",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      />
      <Background
        variant={BackgroundVariant.Dots}
        gap={20}
        size={1.5}
        color="#e8e8e8"
      />

      {/* Enhanced Drop Zone Hint */}
      {nodes.length === 0 && (
        <Panel position="top-center">
          <div
            style={{
              padding: "32px",
              background: "rgba(255,255,255,0.98)",
              borderRadius: "20px",
              border: "2px dashed #d9d9d9",
              textAlign: "center",
              maxWidth: "520px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              backdropFilter: "blur(10px)",
            }}
          >
            <ApartmentOutlined
              style={{
                fontSize: "64px",
                color: "#1890ff",
                marginBottom: "20px",
                display: "block",
                opacity: 0.7,
              }}
            />
            <Title level={2} style={{ marginBottom: "12px", color: "#1890ff" }}>
              Workflow Builder
            </Title>
            <Text
              style={{ fontSize: "16px", lineHeight: "1.6", color: "#666" }}
            >
              🎯 <strong>Bước 1:</strong> Kéo template từ sidebar trái vào đây
              <br />
              🎯 <strong>Bước 2:</strong> Kết nối các node: 🚀 TRIGGER → ⚙️
              BEHAVIOR → 📤 OUTPUT
              <br />
              🎯 <strong>Bước 3:</strong> Lưu workflow và test
            </Text>
          </div>
        </Panel>
      )}

      {/* Enhanced Drag Feedback */}
      {isDragging && (
        <Panel position="bottom-center">
          <div
            style={{
              padding: "16px 32px",
              background: "linear-gradient(135deg, #1890ff, #40a9ff)",
              color: "white",
              borderRadius: "32px",
              fontSize: "16px",
              fontWeight: "600",
              boxShadow: "0 8px 32px rgba(24, 144, 255, 0.4)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            ✨ Thả để tạo node mới tại đây
          </div>
        </Panel>
      )}
    </ReactFlow>
  );
};

const WorkflowBuilderPage: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflows, setWorkflows] = useState<IWorkflow[]>([]);
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("");
  const [paletteVisible, setPaletteVisible] = useState(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeCounter, setNodeCounter] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Enhanced connection validation
  const isValidConnection = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return false;

      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (!sourceNode || !targetNode) return false;

      const sourceType = getNodeTypeFromTemplate(sourceNode.data.templateType);
      const targetType = getNodeTypeFromTemplate(targetNode.data.templateType);

      return canNodesConnect(sourceType, targetType);
    },
    [nodes]
  );

  // FIXED: Enhanced node connections với synchronized edge rendering
  const onConnect = useCallback(
    (params: Connection) => {
      console.log("Attempting to connect:", params);

      if (!isValidConnection(params)) {
        message.error({
          content:
            "⚠️ Không thể kết nối! Kiểm tra loại node và quy tắc kết nối.",
          duration: 3,
        });
        return;
      }

      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        animated: isPlaying,
        style: {
          stroke: "#1890ff",
          strokeWidth: 2,
          strokeDasharray: isPlaying ? "5,5" : undefined,
        },
        markerEnd: {
          type: "arrowclosed" as const,
          color: "#1890ff",
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      message.success({
        content: "✅ Đã kết nối nodes thành công!",
        duration: 2,
      });
    },
    [setEdges, isPlaying, isValidConnection]
  );

  // Enhanced drop handler với position optimization
  const onDrop = useCallback(
    (
      event: DragEvent<HTMLDivElement>,
      dropData?: {
        template: any;
        nodeType: string;
        position: { x: number; y: number };
      }
    ) => {
      console.log("Enhanced drop handler called");

      try {
        let template, nodeType, position;

        if (dropData) {
          template = dropData.template;
          nodeType = dropData.nodeType;
          position = dropData.position;
        } else {
          const data = event.dataTransfer.getData("application/reactflow");
          if (!data) return;

          const parsed = JSON.parse(data);
          template = parsed.template;
          nodeType = parsed.nodeType;

          const reactFlowBounds =
            reactFlowWrapper.current?.getBoundingClientRect();
          if (!reactFlowBounds) return;

          position = {
            x: Math.max(0, event.clientX - reactFlowBounds.left - 140),
            y: Math.max(0, event.clientY - reactFlowBounds.top - 60),
          };
        }

        const newNodeId = `node_${nodeCounter}`;
        const newNode: Node = {
          id: newNodeId,
          type: "workflowNode",
          position: {
            x: position.x - 100,
            y: position.y - 40,
          },
          data: {
            label: template.templateName,
            templateCode: template.templateCode,
            templateType:
              template.templateType || template.typeCode || nodeType,
            agentCode: template.agentCode,
            description: template.description,
            template: template,
            nodeType: nodeType,
            timeout: 30000,
            retries: 3,
            priority: "normal",
          },
        };

        setNodes((nds) => nds.concat(newNode));
        setNodeCounter((prev) => prev + 1);
        message.success({
          content: `🎉 Đã thêm node "${
            template.templateName
          }" (${nodeType.toUpperCase()})`,
          duration: 2,
        });
        setIsDragging(false);
      } catch (error) {
        console.error("Error in enhanced onDrop:", error);
        message.error("❌ Không thể tạo node");
        setIsDragging(false);
      }
    },
    [nodeCounter, setNodes]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragging(false);
    }
  }, []);

  // Enhanced fetch functions
  const fetchWorkflows = async () => {
    try {
      const response = await workflowApi.getWorkflows({ size: 1000 });
      setWorkflows(response.content || []);
    } catch (error) {
      message.error("Không thể tải danh sách workflow");
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await templateApi.getTemplates({ size: 1000 });
      setTemplates(response.content || []);
      console.log("Loaded templates:", response.content?.length || 0);
    } catch (error) {
      message.error("Không thể tải danh sách template");
    }
  };

  // Enhanced workflow design operations
  const loadWorkflowDesign = async (code: string) => {
    if (!code) return;

    try {
      const design = await workflowApi.getWorkflowDesign(code);

      const flowNodes: Node[] = design.nodes.map((node) => ({
        id: node.id,
        type: "workflowNode",
        position: node.position,
        data: node.data,
      }));

      const flowEdges: Edge[] = design.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type || "default",
        animated: isPlaying,
        style: {
          stroke: "#1890ff",
          strokeWidth: 2,
          strokeDasharray: isPlaying ? "5,5" : undefined,
        },
        markerEnd: {
          type: "arrowclosed" as const,
          color: "#1890ff",
        },
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);

      const maxNumber = Math.max(
        0,
        ...flowNodes.map((node) => {
          const match = node.id.match(/node_(\d+)/);
          return match ? parseInt(match[1]) : 0;
        })
      );
      setNodeCounter(maxNumber + 1);

      message.success("✅ Tải workflow thành công");
    } catch (error) {
      message.info("Tạo workflow mới");
      setNodes([]);
      setEdges([]);
      setNodeCounter(1);
    }
  };

  const saveWorkflowDesign = async () => {
    if (!selectedWorkflow) {
      message.error("Vui lòng chọn workflow");
      return;
    }

    try {
      const design: IWorkflowDesign = {
        workflowCode: selectedWorkflow,
        nodes: nodes.map((node) => ({
          id: node.id,
          position: node.position,
          data: node.data,
        })),
        edges: edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.type,
        })),
      };

      await workflowApi.saveWorkflowDesign(selectedWorkflow, design);
      message.success("✅ Lưu workflow thành công");
    } catch (error) {
      message.error("❌ Không thể lưu workflow");
    }
  };

  // Enhanced event handlers
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const deleteSelectedNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            edge.source !== selectedNode.id && edge.target !== selectedNode.id
        )
      );
      setSelectedNode(null);
      message.success("✅ Đã xóa node");
    }
  }, [selectedNode, setNodes, setEdges]);

  const clearWorkflow = useCallback(() => {
    Modal.confirm({
      title: "⚠️ Xóa tất cả workflow?",
      content: "Thao tác này sẽ xóa toàn bộ nodes và connections.",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => {
        setNodes([]);
        setEdges([]);
        setSelectedNode(null);
        setNodeCounter(1);
        message.success("✅ Đã xóa toàn bộ workflow");
      },
    });
  }, [setNodes, setEdges]);

  const toggleSimulation = useCallback(() => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);

    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        animated: newIsPlaying,
        style: {
          ...edge.style,
          strokeDasharray: newIsPlaying ? "5,5" : undefined,
        },
      }))
    );

    message.info(
      newIsPlaying
        ? "▶️ Bắt đầu mô phỏng workflow"
        : "⏸️ Dừng mô phỏng workflow"
    );
  }, [isPlaying, setEdges]);

  // Enhanced template grouping
  const groupedTemplates = templates.reduce((acc, template) => {
    const nodeType = getNodeTypeFromTemplate(
      template.templateType || template.typeCode
    );
    if (!acc[nodeType]) {
      acc[nodeType] = [];
    }
    acc[nodeType].push(template);
    return acc;
  }, {} as Record<string, ITemplate[]>);

  // Enhanced ReactFlow instance initialization
  const onInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  }, []);

  // FIXED: Optimized event handlers để đảm bảo sync
  const handleNodesChange = useCallback(
    (changes: any[]) => {
      // Apply changes immediately for better sync
      onNodesChange(changes);
    },
    [onNodesChange]
  );

  const handleEdgesChange = useCallback(
    (changes: any[]) => {
      // Apply changes immediately for better sync
      onEdgesChange(changes);
    },
    [onEdgesChange]
  );

  useEffect(() => {
    fetchWorkflows();
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (selectedWorkflow) {
      loadWorkflowDesign(selectedWorkflow);
    }
  }, [selectedWorkflow]);

  // Enhanced node update handler
  const handleNodeUpdate = useCallback(
    (nodeId: string, data: any) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        )
      );
    },
    [setNodes]
  );

  // Get current workflow info
  const currentWorkflow = workflows.find(
    (w) => w.workflowCode === selectedWorkflow
  );

  // Calculate workflow statistics
  const triggerNodes = nodes.filter(
    (n) => getNodeTypeFromTemplate(n.data.templateType) === NodeType.TRIGGER
  );
  const behaviorNodes = nodes.filter(
    (n) => getNodeTypeFromTemplate(n.data.templateType) === NodeType.BEHAVIOR
  );
  const outputNodes = nodes.filter(
    (n) => getNodeTypeFromTemplate(n.data.templateType) === NodeType.OUTPUT
  );

  return (
    <ReactFlowProvider>
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          background: colorBgContainer,
        }}
      >
        {/* REORGANIZED: Top Controls và Toolbar */}
        <Card
          size="small"
          style={{
            margin: "8px",
            marginBottom: "4px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            border: "1px solid #e8e8e8",
          }}
          bodyStyle={{ padding: "12px 20px" }}
        >
          <Row justify="space-between" align="middle">
            {/* Left Section */}
            <Col>
              <Space size="middle">
                <Tooltip title="Toggle template palette">
                  <Button
                    icon={<DragOutlined />}
                    onClick={() => setPaletteVisible(!paletteVisible)}
                    type={paletteVisible ? "primary" : "default"}
                    style={{ borderRadius: "8px" }}
                  >
                    Templates
                  </Button>
                </Tooltip>

                <div>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    Workflow:
                  </Text>
                  <Select
                    style={{ width: 300, marginLeft: "8px" }}
                    placeholder="Chọn workflow để thiết kế"
                    value={selectedWorkflow}
                    onChange={setSelectedWorkflow}
                    showSearch
                  >
                    {workflows.map((workflow) => (
                      <Select.Option
                        key={workflow.workflowCode}
                        value={workflow.workflowCode}
                      >
                        {workflow.workflowName} ({workflow.workflowCode})
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </Space>
            </Col>

            {/* Center Section - View Controls */}
            <Col>
              <Space>
                <div
                  style={{
                    padding: "4px",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <Tooltip title="Fit view">
                    <Button
                      icon={<FullscreenOutlined />}
                      onClick={() => reactFlowInstance?.fitView()}
                      type="text"
                      size="small"
                    />
                  </Tooltip>
                  <Tooltip title="Zoom in">
                    <Button
                      icon={<ZoomInOutlined />}
                      onClick={() => reactFlowInstance?.zoomIn()}
                      type="text"
                      size="small"
                    />
                  </Tooltip>
                  <Tooltip title="Zoom out">
                    <Button
                      icon={<ZoomOutOutlined />}
                      onClick={() => reactFlowInstance?.zoomOut()}
                      type="text"
                      size="small"
                    />
                  </Tooltip>
                </div>
              </Space>
            </Col>

            {/* Right Section */}
            <Col>
              <Space>
                <Button
                  type={isPlaying ? "primary" : "default"}
                  icon={
                    isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />
                  }
                  onClick={toggleSimulation}
                  disabled={nodes.length === 0}
                  style={{ borderRadius: "8px" }}
                >
                  {isPlaying ? "Dừng" : "Chạy"}
                </Button>

                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={clearWorkflow}
                  disabled={nodes.length === 0}
                  style={{ borderRadius: "8px" }}
                >
                  Xóa tất cả
                </Button>

                <Button
                  icon={<ReloadOutlined />}
                  onClick={() =>
                    selectedWorkflow && loadWorkflowDesign(selectedWorkflow)
                  }
                  disabled={!selectedWorkflow}
                  style={{ borderRadius: "8px" }}
                >
                  Tải lại
                </Button>

                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={saveWorkflowDesign}
                  disabled={!selectedWorkflow || nodes.length === 0}
                  style={{
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #1890ff, #40a9ff)",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                  }}
                >
                  Lưu Workflow
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* REORGANIZED: Main Content Area */}
        <div style={{ flex: 1, display: "flex" }}>
          {/* Enhanced Template Palette Sidebar */}
          <div
            style={{
              width: paletteVisible ? "340px" : "0px",
              transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              borderRight: paletteVisible ? "1px solid #e8e8e8" : "none",
              background: "linear-gradient(180deg, #fafafa, #f5f5f5)",
              overflow: "hidden",
              boxShadow: paletteVisible
                ? "2px 0 12px rgba(0,0,0,0.08)"
                : "none",
            }}
          >
            <Card
              title={
                <Space>
                  <DragOutlined style={{ color: "#1890ff" }} />
                  <span style={{ fontWeight: 600 }}>Template Palette</span>
                  <Badge
                    count={templates.length}
                    style={{ backgroundColor: "#1890ff" }}
                  />
                </Space>
              }
              size="small"
              style={{ height: "100%", border: "none" }}
              bodyStyle={{
                padding: "16px",
                height: "calc(100% - 57px)",
                overflow: "auto",
              }}
            >
              <div style={{ marginBottom: "16px" }}>
                <Text
                  style={{ fontSize: "13px", color: "#666", lineHeight: "1.5" }}
                >
                  🎯 <strong>Cách sử dụng:</strong>
                  <br />
                  1. Kéo template từ đây vào canvas bên phải
                  <br />
                  2. Kết nối các node bằng cách kéo handle
                  <br />
                  <br />
                  <Text strong style={{ color: "#52c41a" }}>
                    🚀 TRIGGER
                  </Text>
                  : Chỉ có output
                  <br />
                  <Text strong style={{ color: "#1890ff" }}>
                    ⚙️ BEHAVIOR
                  </Text>
                  : Có input & output
                  <br />
                  <Text strong style={{ color: "#fa8c16" }}>
                    📤 OUTPUT
                  </Text>
                  : Chỉ có input
                </Text>
              </div>

              <Collapse
                defaultActiveKey={Object.keys(groupedTemplates)}
                ghost
                size="small"
                style={{ background: "transparent" }}
              >
                {Object.entries(groupedTemplates).map(
                  ([type, templateList]) => (
                    <CollapsePanel
                      key={type}
                      header={
                        <Space>
                          <span style={{ fontSize: "18px" }}>
                            {TEMPLATE_CONFIGS[type as NodeType]?.icon}
                          </span>
                          <Text
                            strong
                            style={{
                              color: getNodeTypeColor(type as NodeType),
                              fontSize: "14px",
                            }}
                          >
                            {type.toUpperCase()}
                          </Text>
                          <Badge
                            count={templateList.length}
                            style={{
                              backgroundColor: getNodeTypeColor(
                                type as NodeType
                              ),
                            }}
                          />
                        </Space>
                      }
                    >
                      {templateList.map((template) => (
                        <DraggableTemplate
                          key={template.templateId || template.templateCode}
                          template={template}
                        />
                      ))}
                    </CollapsePanel>
                  )
                )}
              </Collapse>
            </Card>
          </div>

          {/* REORGANIZED: Canvas và Info Layout */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Enhanced Flow Canvas */}
            <div
              ref={reactFlowWrapper}
              style={{
                flex: 1,
                margin: "6px 12px 6px 12px",
                border: isDragging
                  ? "3px dashed #1890ff"
                  : "2px dashed #e8e8e8",
                borderRadius: "16px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: isDragging
                  ? "0 8px 32px rgba(24, 144, 255, 0.2)"
                  : "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <WorkflowCanvas
                nodes={nodes}
                edges={edges}
                onNodesChange={handleNodesChange}
                onEdgesChange={handleEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                nodeTypes={nodeTypes}
                isPlaying={isPlaying}
                isDragging={isDragging}
                selectedNode={selectedNode}
                reactFlowInstance={reactFlowInstance}
                onInit={onInit}
              />
            </div>

            {/* NEW: Bottom Workflow Information Panel */}
            <Card
              size="small"
              style={{
                margin: "0 12px 12px 12px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "1px solid #e8e8e8",
              }}
              title={
                <Space>
                  <InfoCircleOutlined style={{ color: "#1890ff" }} />
                  <span>Thông tin Workflow</span>
                  {currentWorkflow && (
                    <Tag color="blue">
                      {currentWorkflow.statusName || "ACTIVE"}
                    </Tag>
                  )}
                </Space>
              }
            >
              <Row gutter={24}>
                <Col span={8}>
                  <Descriptions size="small" column={1} bordered>
                    <Descriptions.Item label="Workflow">
                      {currentWorkflow?.workflowName || "Chưa chọn"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Code">
                      {currentWorkflow?.workflowCode || "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mô tả">
                      {currentWorkflow?.description || "Không có mô tả"}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>

                <Col span={8}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Statistic
                        title="🚀 Trigger"
                        value={triggerNodes.length}
                        valueStyle={{ color: "#52c41a", fontSize: "24px" }}
                        prefix={<LinkOutlined />}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="⚙️ Behavior"
                        value={behaviorNodes.length}
                        valueStyle={{ color: "#1890ff", fontSize: "24px" }}
                        prefix={<ApiOutlined />}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="📤 Output"
                        value={outputNodes.length}
                        valueStyle={{ color: "#fa8c16", fontSize: "24px" }}
                        prefix={<ScheduleOutlined />}
                      />
                    </Col>
                  </Row>
                </Col>

                <Col span={8}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="Total Nodes"
                        value={nodes.length}
                        valueStyle={{ fontSize: "24px" }}
                        prefix={<NodeIndexOutlined />}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Connections"
                        value={edges.length}
                        valueStyle={{ fontSize: "24px" }}
                        prefix={<ApartmentOutlined />}
                      />
                    </Col>
                  </Row>

                  <div style={{ marginTop: "16px" }}>
                    <Space>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        <ClockCircleOutlined /> Cập nhật lúc:{" "}
                        {new Date().toLocaleTimeString("vi-VN")}
                      </Text>
                      {selectedNode && (
                        <Tag color="orange">
                          Node: {selectedNode.data.label}
                        </Tag>
                      )}
                    </Space>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        </div>

        {/* Enhanced Node Properties Panel - Positioned on right */}
        {selectedNode && (
          <NodePropertiesPanel
            node={selectedNode}
            onUpdate={handleNodeUpdate}
            onDelete={deleteSelectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </ReactFlowProvider>
  );
};

export default WorkflowBuilderPage;
