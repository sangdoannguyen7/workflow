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
  Row,
  Col,
  Select,
  Drawer,
  theme,
  Typography,
  List,
  Tag,
  Divider,
  Badge,
  Tooltip,
  Modal,
  Collapse,
  Progress,
  Statistic,
  Avatar,
  Timeline,
  Input,
  Form,
  Switch,
  Spin,
} from "antd";
import {
  ApartmentOutlined,
  ApiOutlined,
  ScheduleOutlined,
  LinkOutlined,
  DragOutlined,
  DownloadOutlined,
  UploadOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  BugOutlined,
  RocketOutlined,
  SettingOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  PlusOutlined,
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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { ITemplate } from "../../interface/template.interface";
import { IWorkflow } from "../../interface/workflow.interface";
import { IWorkflowDesign } from "../../interface/workflow.interface";
import templateApi from "../../apis/template/api.template";
import workflowApi from "../../apis/workflow/api.workflow";
import { WorkflowMockAPI } from "../../mock/workflow-enhanced.mock";
import { NotificationComponent } from "../../shared/components/notification/notification.tsx";

// Import components
import WorkflowToolbar from "./components/WorkflowToolbar";
import NodePropertiesPanel from "./components/NodePropertiesPanel";

const { Text, Title } = Typography;
const { TextArea } = Input;

// Template configurations with enhanced styling
const TEMPLATE_CONFIGS = {
  trigger: {
    icon: <PlayCircleOutlined />,
    color: "#52c41a",
    bgColor: "#f6ffed",
    borderColor: "#b7eb8f",
    category: "TRIGGER",
    canConnectTo: ["intermediate"],
    canConnectFrom: [],
  },
  intermediate: {
    icon: <SettingOutlined />,
    color: "#1890ff",
    bgColor: "#e6f7ff",
    borderColor: "#91d5ff",
    category: "INTERMEDIATE",
    canConnectTo: ["intermediate", "exit"],
    canConnectFrom: ["trigger", "intermediate"],
  },
  exit: {
    icon: <CheckCircleOutlined />,
    color: "#fa8c16",
    bgColor: "#fff7e6",
    borderColor: "#ffd591",
    category: "EXIT",
    canConnectTo: [],
    canConnectFrom: ["intermediate"],
  },
  // Legacy support
  webhook: {
    icon: <LinkOutlined />,
    color: "#52c41a",
    bgColor: "#f6ffed",
    borderColor: "#b7eb8f",
    category: "TRIGGER",
    canConnectTo: ["intermediate"],
    canConnectFrom: [],
  },
  schedule: {
    icon: <ScheduleOutlined />,
    color: "#52c41a",
    bgColor: "#f6ffed",
    borderColor: "#b7eb8f",
    category: "TRIGGER",
    canConnectTo: ["intermediate"],
    canConnectFrom: [],
  },
  restapi: {
    icon: <ApiOutlined />,
    color: "#1890ff",
    bgColor: "#e6f7ff",
    borderColor: "#91d5ff",
    category: "INTERMEDIATE",
    canConnectTo: ["intermediate", "exit"],
    canConnectFrom: ["trigger", "intermediate"],
  },
  process: {
    icon: <SettingOutlined />,
    color: "#1890ff",
    bgColor: "#e6f7ff",
    borderColor: "#91d5ff",
    category: "INTERMEDIATE",
    canConnectTo: ["intermediate", "exit"],
    canConnectFrom: ["trigger", "intermediate"],
  },
};

// Enhanced Draggable Template Component with improved design
const DraggableTemplate: React.FC<{ template: ITemplate }> = ({ template }) => {
  const [isDragging, setIsDragging] = useState(false);
  const config =
    TEMPLATE_CONFIGS[template.templateType as keyof typeof TEMPLATE_CONFIGS] ||
    TEMPLATE_CONFIGS.process;

  const onDragStart = (
    event: DragEvent<HTMLDivElement>,
    template: ITemplate
  ) => {
    console.log("🚀 Starting drag for template:", template.templateName);
    setIsDragging(true);

    // Set the drag data
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({
        type: "template",
        template: template,
      })
    );
    event.dataTransfer.effectAllowed = "move";

    // Simple drag image without complex manipulation
    event.dataTransfer.setDragImage(event.currentTarget, 50, 25);
  };

  const onDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={(event) => onDragStart(event, template)}
      onDragEnd={onDragEnd}
      style={{
        border: `2px solid ${config?.borderColor || "#d9d9d9"}`,
        borderRadius: "12px",
        padding: "14px",
        marginBottom: "8px",
        cursor: isDragging ? "grabbing" : "grab",
        backgroundColor: config?.bgColor || "#fafafa",
        transition: "all 0.3s ease",
        userSelect: "none",
        position: "relative",
        overflow: "hidden",
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? "scale(0.95)" : "scale(1)",
        boxShadow: isDragging
          ? `0 8px 24px ${config?.color || "#ccc"}60`
          : "0 2px 8px rgba(0,0,0,0.1)",
      }}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
          e.currentTarget.style.boxShadow = `0 8px 24px ${
            config?.color || "#ccc"
          }40`;
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
        }
      }}
    >
      {/* Type indicator */}
      <div
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: config?.color,
          color: "white",
          borderRadius: "8px",
          padding: "2px 6px",
          fontSize: "10px",
          fontWeight: "bold",
        }}
      >
        {template.templateType?.toUpperCase()}
      </div>

      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
      >
        <div
          style={{
            color: config?.color || "#666",
            marginRight: "12px",
            fontSize: "20px",
          }}
        >
          {config?.icon}
        </div>
        <div style={{ flex: 1 }}>
          <Text strong style={{ color: config?.color || "#666", fontSize: 15 }}>
            {template.templateName}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {template.templateCode}
          </Text>
        </div>
      </div>

      {template.description && (
        <Text
          style={{
            fontSize: 12,
            color: "#666",
            display: "block",
            lineHeight: 1.4,
            marginBottom: "10px",
          }}
        >
          {template.description.length > 80
            ? `${template.description.substring(0, 80)}...`
            : template.description}
        </Text>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tag
          size="small"
          color={template.statusCode === "ACTIVE" ? "green" : "orange"}
        >
          {template.statusName}
        </Tag>
        <Text style={{ fontSize: 11, color: "#999" }}>
          {template.agentCode}
        </Text>
      </div>
    </div>
  );
};

// Stable Custom Node Component with proper event handling
const WorkflowNode: React.FC<{ data: any; selected: boolean }> = ({
  data,
  selected,
}) => {
  const config =
    TEMPLATE_CONFIGS[data.templateType as keyof typeof TEMPLATE_CONFIGS] ||
    TEMPLATE_CONFIGS.process;

  return (
    <div
      style={{
        padding: "16px",
        border: selected
          ? `2px solid ${config?.color || "#1890ff"}`
          : `1px solid ${config?.borderColor || "#d9d9d9"}`,
        borderRadius: "12px",
        background: "#fff",
        minWidth: "200px",
        maxWidth: "250px",
        boxShadow: selected
          ? `0 8px 20px ${config?.color || "#1890ff"}30`
          : "0 2px 8px rgba(0,0,0,0.06)",
        position: "relative",
        cursor: "move",
        userSelect: "none",
      }}
    >
      {/* Status indicator */}
      <div
        style={{
          position: "absolute",
          top: "-8px",
          right: "-8px",
          background: config?.color || "#666",
          color: "white",
          borderRadius: "16px",
          padding: "6px 10px",
          fontSize: "10px",
          fontWeight: "bold",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        {data.templateType?.toUpperCase()}
      </div>

      {/* Node Header */}
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}
      >
        <div
          style={{
            color: config?.color || "#666",
            marginRight: "12px",
            fontSize: "20px",
          }}
        >
          {config?.icon}
        </div>
        <div style={{ flex: 1 }}>
          <Text
            strong
            style={{
              fontSize: "15px",
              color: config?.color || "#666",
              display: "block",
              lineHeight: 1.2,
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
            fontSize: "12px",
            color: "#666",
            display: "block",
            lineHeight: "1.4",
            marginBottom: "12px",
            background: "#f8f9fa",
            padding: "8px",
            borderRadius: "8px",
          }}
        >
          {data.description.length > 100
            ? `${data.description.substring(0, 100)}...`
            : data.description}
        </Text>
      )}

      {/* Node Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "12px",
          fontSize: "11px",
          color: "#999",
        }}
      >
        <Space size="small">
          <Tag size="small" color={config?.color}>
            Agent
          </Tag>
          <Text style={{ fontSize: 11 }}>{data.agentCode}</Text>
        </Space>
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: selected ? config?.color : "#ccc",
            boxShadow: selected ? `0 0 8px ${config?.color}60` : "none",
          }}
        />
      </div>

      {/* Stable, Beautiful Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          border: `3px solid ${config?.color || "#1890ff"}`,
          backgroundColor: "#fff",
          boxShadow: `0 2px 8px rgba(0,0,0,0.1)`,
          opacity: 1,
          transition:
            "transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s ease",
          cursor: "crosshair",
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.15)";
          e.target.style.boxShadow = `0 4px 12px ${
            config?.color || "#1890ff"
          }60, 0 0 0 2px ${config?.color || "#1890ff"}30`;
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = `0 2px 8px rgba(0,0,0,0.1)`;
        }}
      />

      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          border: `3px solid ${config?.color || "#1890ff"}`,
          backgroundColor: "#fff",
          boxShadow: `0 2px 8px rgba(0,0,0,0.1)`,
          opacity: 1,
          transition:
            "transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s ease",
          cursor: "crosshair",
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.15)";
          e.target.style.boxShadow = `0 4px 12px ${
            config?.color || "#1890ff"
          }60, 0 0 0 2px ${config?.color || "#1890ff"}30`;
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = `0 2px 8px rgba(0,0,0,0.1)`;
        }}
      />
    </div>
  );
};

const AGENT_COLORS: Record<string, string> = {
  AGT_HTTP: "#52c41a",
  AGT_SCHEDULER: "#1890ff",
  AGT_FILE_SYSTEM: "#fa8c16",
  AGT_VALIDATION: "#722ed1",
  AGT_TRANSFORM: "#eb2f96",
  AGT_DATABASE: "#13c2c2",
  AGT_LOGIC: "#faad14",
  AGT_EMAIL: "#f5222d",
  AGT_LOGGING: "#2f54eb",
  AGT_SECURITY: "#52c41a",
  AGT_ANALYTICS: "#fa541c",
  AGT_NOTIFICATION: "#722ed1",
  unknown: "#d9d9d9",
};

const nodeTypes = {
  workflowNode: WorkflowNode,
};

const WorkflowBuilderPage: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflows, setWorkflows] = useState<IWorkflow[]>([]);
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("");
  const [currentWorkflow, setCurrentWorkflow] = useState<IWorkflow | null>(
    null
  );
  const [paletteVisible, setPaletteVisible] = useState(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeCounter, setNodeCounter] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [testResultsDrawerVisible, setTestResultsDrawerVisible] =
    useState(false);
  const [createWorkflowModalVisible, setCreateWorkflowModalVisible] =
    useState(false);
  const [createForm] = Form.useForm();
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const {
    token: {
      colorBgContainer,
      borderRadiusLG,
      colorPrimary,
      colorSuccess,
      colorWarning,
      colorError,
      colorText,
      colorTextSecondary,
      boxShadowSecondary,
    },
  } = theme.useToken();

  // Handle node connections with enhanced validation rules
  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;

      // Get source and target nodes
      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);

      if (!sourceNode || !targetNode) return;

      // Get template configurations
      const sourceConfig =
        TEMPLATE_CONFIGS[
          sourceNode.data.templateType as keyof typeof TEMPLATE_CONFIGS
        ];
      const targetConfig =
        TEMPLATE_CONFIGS[
          targetNode.data.templateType as keyof typeof TEMPLATE_CONFIGS
        ];

      if (!sourceConfig || !targetConfig) {
        NotificationComponent({
          type: "error",
          message: "Lỗi kết nối",
          description: "Không thể xác định loại node",
        });
        return;
      }

      // Enhanced connection validation rules
      const sourceCategory = sourceConfig.category;
      const targetCategory = targetConfig.category;

      let canConnect = false;
      let errorMessage = "";

      if (sourceCategory === "TRIGGER") {
        // Trigger nodes can only connect TO intermediate nodes
        if (targetCategory === "INTERMEDIATE") {
          canConnect = true;
        } else if (targetCategory === "EXIT") {
          errorMessage =
            "Trigger không thể kết nối trực tiếp với Exit. Hãy sử dụng node Intermediate làm trung gian.";
        } else if (targetCategory === "TRIGGER") {
          errorMessage = "Trigger không thể kết nối với Trigger khác.";
        }
      } else if (sourceCategory === "INTERMEDIATE") {
        // Intermediate nodes can connect to both intermediate and exit nodes
        if (targetCategory === "INTERMEDIATE" || targetCategory === "EXIT") {
          canConnect = true;
        } else if (targetCategory === "TRIGGER") {
          errorMessage = "Node Intermediate không thể kết nối với Trigger.";
        }
      } else if (sourceCategory === "EXIT") {
        // Exit nodes can only connect back to trigger nodes (for loops/callbacks)
        if (targetCategory === "TRIGGER") {
          canConnect = true;
        } else {
          errorMessage =
            "Exit chỉ có thể kết nối về Trigger (để tạo vòng lặp hoặc callback).";
        }
      }

      if (!canConnect) {
        NotificationComponent({
          type: "error",
          message: "Kết nối không hợp lệ",
          description:
            errorMessage ||
            `${sourceCategory} không thể kết nối với ${targetCategory}`,
        });
        return;
      }

      // Check for duplicate connections
      const existingEdge = edges.find(
        (edge) => edge.source === params.source && edge.target === params.target
      );

      if (existingEdge) {
        NotificationComponent({
          type: "warning",
          message: "Cảnh báo",
          description: "Kết nối này đã tồn tại",
        });
        return;
      }

      // Check for self-connections
      if (params.source === params.target) {
        NotificationComponent({
          type: "error",
          message: "Kết nối không hợp lệ",
          description: "Node không thể kết nối với chính nó",
        });
        return;
      }

      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        animated: isPlaying,
        style: {
          stroke: colorPrimary,
          strokeWidth: 3,
          strokeDasharray: isPlaying ? "8,8" : undefined,
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      NotificationComponent({
        type: "success",
        message: "Thành công",
        description: `Đã kết nối ${sourceCategory} với ${targetCategory}`,
      });
    },
    [setEdges, isPlaying, colorPrimary, nodes, edges]
  );

  // Simplified and reliable drop handler
  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) {
        console.log("ReactFlow bounds not available");
        return;
      }

      const data = event.dataTransfer.getData("application/reactflow");
      if (!data) {
        console.log("No drag data available");
        return;
      }

      try {
        const { template } = JSON.parse(data);
        if (!template) {
          console.log("No template in drag data");
          return;
        }

        // Simple position calculation - no complex projection needed
        const position = {
          x: event.clientX - reactFlowBounds.left - 100,
          y: event.clientY - reactFlowBounds.top - 50,
        };

        const newNodeId = `node_${Date.now()}_${nodeCounter}`;
        const newNode: Node = {
          id: newNodeId,
          type: "workflowNode",
          position: position,
          data: {
            label: template.templateName,
            templateCode: template.templateCode,
            templateType: template.templateType,
            agentCode: template.agentCode,
            description: template.description,
            template: template,
          },
        };

        setNodes((nds) => [...nds, newNode]);
        setNodeCounter((prev) => prev + 1);

        console.log("✅ Node added successfully:", newNode.id);

        NotificationComponent({
          type: "success",
          message: "Thành công",
          description: `Đã thêm node "${template.templateName}"`,
        });
      } catch (error) {
        console.error("❌ Drop error:", error);
        NotificationComponent({
          type: "error",
          message: "Lỗi",
          description: "Không thể thêm node",
        });
      }
    },
    [nodeCounter, setNodes]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Enhanced test workflow functionality with detailed step results
  const runWorkflowTest = async () => {
    if (!selectedWorkflow || !nodes || nodes.length === 0) {
      NotificationComponent({
        type: "warning",
        message: "Cảnh báo",
        description: "Vui lòng chọn workflow và thêm ít nhất một node",
      });
      return;
    }

    setIsTestRunning(true);
    try {
      // Mock test execution with detailed step results
      const stepResults = [];
      const totalNodes = (nodes || []).length;

      // Simulate step-by-step execution
      for (let i = 0; i < totalNodes; i++) {
        const node = nodes[i];
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate processing time

        const stepResult = {
          nodeId: node.id,
          nodeName: node.data.label,
          nodeType: node.data.templateType,
          agentCode: node.data.agentCode,
          status: Math.random() > 0.1 ? "success" : "error", // 90% success rate
          executionTime: Math.random() * 1000 + 200,
          startTime: new Date(),
          endTime: new Date(Date.now() + Math.random() * 1000 + 200),
          input: {
            data: `Input data for ${node.data.label}`,
            parameters: node.data.template || {},
          },
          output:
            Math.random() > 0.1
              ? {
                  data: `Processed output from ${node.data.label}`,
                  status: "completed",
                  recordsProcessed: Math.floor(Math.random() * 1000) + 1,
                }
              : {
                  error: "Processing failed",
                  details: "Mock error for demonstration",
                },
          logs: [
            {
              timestamp: new Date(),
              level: "info",
              message: `Starting ${node.data.label}`,
            },
            {
              timestamp: new Date(),
              level: "debug",
              message: "Processing input data",
            },
            Math.random() > 0.1
              ? {
                  timestamp: new Date(),
                  level: "success",
                  message: "Step completed successfully",
                }
              : {
                  timestamp: new Date(),
                  level: "error",
                  message: "Step failed with error",
                },
          ],
        };
        stepResults.push(stepResult);
      }

      const successfulSteps = stepResults.filter(
        (step) => step.status === "success"
      ).length;
      const failedSteps = stepResults.filter(
        (step) => step.status === "error"
      ).length;
      const totalExecutionTime = stepResults.reduce(
        (sum, step) => sum + step.executionTime,
        0
      );

      const enhancedResults = {
        status: failedSteps === 0 ? "success" : "partial",
        executionTime: totalExecutionTime,
        nodesExecuted: totalNodes,
        successfulNodes: successfulSteps,
        failedNodes: failedSteps,
        stepResults: stepResults,
        summary: {
          throughput: Math.floor(Math.random() * 1000) + 500,
          averageResponseTime: totalExecutionTime / totalNodes,
          errorRate: (failedSteps / totalNodes) * 100,
          peakMemoryUsage: Math.floor(Math.random() * 512) + 256,
        },
        logs: [
          {
            timestamp: new Date(),
            level: "info",
            message: "Workflow test started",
          },
          {
            timestamp: new Date(),
            level: "success",
            message: "Node validation passed",
          },
          {
            timestamp: new Date(),
            level: "info",
            message: "Executing node sequence",
          },
          {
            timestamp: new Date(),
            level: failedSteps === 0 ? "success" : "warning",
            message:
              failedSteps === 0
                ? "Workflow test completed successfully"
                : `Workflow completed with ${failedSteps} errors`,
          },
        ],
      };

      setTestResults(enhancedResults);
      setTestResultsDrawerVisible(true);
      NotificationComponent({
        type: enhancedResults.status === "success" ? "success" : "warning",
        message: "Test hoàn thành",
        description: `Workflow test ${
          enhancedResults.status === "success"
            ? "thành công"
            : `hoàn thành với ${failedSteps} lỗi`
        } trong ${(enhancedResults.executionTime / 1000).toFixed(2)}s`,
      });
    } catch (error) {
      NotificationComponent({
        type: "error",
        message: "Test thất bại",
        description: "Có lỗi xảy ra trong quá trình test workflow",
      });
    } finally {
      setIsTestRunning(false);
    }
  };

  // Fetch data functions
  const fetchWorkflows = async () => {
    try {
      const response = await WorkflowMockAPI.getWorkflows({ pageSize: 1000 });
      setWorkflows(response.data || []);
    } catch (error) {
      NotificationComponent({
        type: "error",
        message: "Lỗi",
        description: "Không thể tải danh sách workflow",
      });
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await WorkflowMockAPI.getAgentsForBuilder();
      console.log("Agents loaded:", response.data?.length || 0);
    } catch (error) {
      NotificationComponent({
        type: "error",
        message: "Lỗi",
        description: "Không thể tải danh sách agent",
      });
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await WorkflowMockAPI.getTemplatesForBuilder();
      setTemplates(response.data || []);
    } catch (error) {
      NotificationComponent({
        type: "error",
        message: "Lỗi",
        description: "Không thể tải danh sách template",
      });
    }
  };

  // Load workflow design
  const loadWorkflowDesign = async (code: string) => {
    if (!code) return;

    try {
      const design = await WorkflowMockAPI.getWorkflowDesign(code);
      const workflow = workflows.find((w) => w.workflowCode === code);
      setCurrentWorkflow(workflow || null);

      const flowNodes: Node[] = (design.nodes || []).map((node) => ({
        id: node.id,
        type: "workflowNode",
        position: node.position,
        data: node.data,
      }));

      const flowEdges: Edge[] = (design.edges || []).map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type || "default",
        animated: isPlaying,
        style: {
          stroke: colorPrimary,
          strokeWidth: 3,
          strokeDasharray: isPlaying ? "8,8" : undefined,
        },
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);

      const maxNumber = Math.max(
        0,
        ...(flowNodes || []).map((node) => {
          const match = node.id.match(/node_(\d+)/);
          return match ? parseInt(match[1]) : 0;
        })
      );
      setNodeCounter(maxNumber + 1);

      NotificationComponent({
        type: "success",
        message: "Thành công",
        description: "Tải workflow thành công",
      });
    } catch (error) {
      NotificationComponent({
        type: "info",
        message: "Thông báo",
        description: "Tạo workflow mới",
      });
      setNodes([]);
      setEdges([]);
      setNodeCounter(1);
      setCurrentWorkflow(
        workflows.find((w) => w.workflowCode === code) || null
      );
    }
  };

  // Save workflow design
  const saveWorkflowDesign = async () => {
    if (!selectedWorkflow) {
      NotificationComponent({
        type: "warning",
        message: "Cảnh báo",
        description: "Vui lòng chọn workflow",
      });
      return;
    }

    try {
      const design: IWorkflowDesign = {
        workflowCode: selectedWorkflow,
        nodes: (nodes || []).map((node) => ({
          id: node.id,
          position: node.position,
          data: node.data,
        })),
        edges: (edges || []).map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.type,
        })),
      };

      await WorkflowMockAPI.saveWorkflowDesign(selectedWorkflow, design);
      NotificationComponent({
        type: "success",
        message: "Thành công",
        description: "Lưu workflow thành công",
      });
    } catch (error) {
      NotificationComponent({
        type: "error",
        message: "Lỗi",
        description: "Không thể lưu workflow",
      });
    }
  };

  // Group templates by agent
  const groupedTemplates = React.useMemo(() => {
    if (!templates || !Array.isArray(templates)) {
      return {};
    }
    return templates.reduce((acc, template) => {
      const agent = template.agentCode || "unknown";
      if (!acc[agent]) {
        acc[agent] = [];
      }
      acc[agent].push(template);
      return acc;
    }, {} as Record<string, ITemplate[]>);
  }, [templates]);

  // Other handlers...
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateNodeData = useCallback(
    (nodeId: string, data: any) => {
      setNodes((nds) =>
        (nds || []).map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        )
      );
    },
    [setNodes]
  );

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
      NotificationComponent({
        type: "success",
        message: "Thành công",
        description: "Đã xóa node",
      });
    }
  }, [selectedNode, setNodes, setEdges]);

  const clearWorkflow = useCallback(() => {
    Modal.confirm({
      title: "Xóa tất cả workflow?",
      content: "Thao tác này sẽ xóa toàn bộ nodes và connections.",
      onOk: () => {
        setNodes([]);
        setEdges([]);
        setSelectedNode(null);
        setNodeCounter(1);
        setTestResults(null);
        NotificationComponent({
          type: "success",
          message: "Thành công",
          description: "Đã xóa toàn bộ workflow",
        });
      },
    });
  }, [setNodes, setEdges]);

  // Additional workflow builder functions
  const handleExportWorkflow = useCallback(() => {
    if (!selectedWorkflow || !nodes || nodes.length === 0) {
      NotificationComponent({
        type: "warning",
        message: "Cảnh báo",
        description: "Không có dữ liệu để xuất",
      });
      return;
    }

    const exportData = {
      workflowCode: selectedWorkflow,
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
      })),
      metadata: {
        exportedAt: new Date().toISOString(),
        version: "1.0.0",
        nodeCount: nodes.length,
        edgeCount: edges.length,
      },
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `workflow-${selectedWorkflow}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    NotificationComponent({
      type: "success",
      message: "Thành công",
      description: "Đã xuất workflow thành công",
    });
  }, [selectedWorkflow, nodes, edges]);

  const handleImportWorkflow = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target?.result as string);

          if (!importData.nodes || !importData.edges) {
            throw new Error("Invalid workflow file format");
          }

          const importedNodes = importData.nodes.map((node: any) => ({
            id: node.id,
            type: node.type || "workflowNode",
            position: node.position,
            data: node.data,
          }));

          const importedEdges = importData.edges.map((edge: any) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type || "default",
            animated: isPlaying,
            style: {
              stroke: colorPrimary,
              strokeWidth: 3,
              strokeDasharray: isPlaying ? "8,8" : undefined,
            },
          }));

          setNodes(importedNodes);
          setEdges(importedEdges);

          // Update node counter
          const maxNumber = Math.max(
            0,
            ...importedNodes.map((node: any) => {
              const match = node.id.match(/node_(\d+)/);
              return match ? parseInt(match[1]) : 0;
            })
          );
          setNodeCounter(maxNumber + 1);

          NotificationComponent({
            type: "success",
            message: "Thành công",
            description: `Đã nhập workflow với ${importedNodes.length} nodes và ${importedEdges.length} connections`,
          });
        } catch (error) {
          NotificationComponent({
            type: "error",
            message: "Lỗi",
            description: "File không đúng định dạng hoặc bị lỗi",
          });
        }
      };
      reader.readAsText(file);
    },
    [setNodes, setEdges, isPlaying, colorPrimary]
  );

  const handleFitView = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2 });
    }
  }, [reactFlowInstance]);

  const handleZoomIn = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomIn();
    }
  }, [reactFlowInstance]);

  const handleZoomOut = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomOut();
    }
  }, [reactFlowInstance]);

  const handleCreateNewWorkflow = async (values: any) => {
    try {
      const newWorkflow = {
        workflowCode: values.workflowCode,
        workflowName: values.workflowName,
        description: values.description || "",
        statusCode: "DRAFT",
        version: "v1.0.0",
      };

      const result = await WorkflowMockAPI.createWorkflow(newWorkflow);

      // Add to local workflows list
      setWorkflows((prev) => [...prev, result.data]);
      setSelectedWorkflow(result.data.workflowCode);
      setCreateWorkflowModalVisible(false);
      createForm.resetFields();

      NotificationComponent({
        type: "success",
        message: "Thành công",
        description: "Tạo workflow mới thành công",
      });
    } catch (error) {
      NotificationComponent({
        type: "error",
        message: "Lỗi",
        description: "Không thể tạo workflow mới",
      });
    }
  };

  const toggleSimulation = useCallback(() => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);

    setEdges((eds) =>
      (eds || []).map((edge) => ({
        ...edge,
        animated: newIsPlaying,
        style: {
          ...edge.style,
          strokeDasharray: newIsPlaying ? "8,8" : undefined,
        },
      }))
    );

    NotificationComponent({
      type: "info",
      message: "Thông báo",
      description: newIsPlaying
        ? "Bắt đầu mô phỏng workflow"
        : "Dừng mô phỏng workflow",
    });
  }, [isPlaying, setEdges]);

  useEffect(() => {
    fetchWorkflows();
    fetchTemplates();
    fetchAgents();
  }, []);

  useEffect(() => {
    if (selectedWorkflow) {
      loadWorkflowDesign(selectedWorkflow);
    }
  }, [selectedWorkflow, workflows]);

  // Initialize ReactFlow properly
  useEffect(() => {
    if (reactFlowInstance) {
      console.log("✅ ReactFlow instance ready");
      reactFlowInstance.fitView({ padding: 0.1 });
    }
  }, [reactFlowInstance]);

  return (
    <ReactFlowProvider>
      <div
        style={{ height: "100vh", display: "flex", background: "transparent" }}
      >
        {/* Template Palette Sidebar */}
        <div
          style={{
            width: paletteVisible ? "350px" : "0px",
            transition: "width 0.3s ease",
            borderRight: paletteVisible
              ? `1px solid ${colorPrimary}20`
              : "none",
            background: colorBgContainer,
            borderRadius: paletteVisible
              ? `${borderRadiusLG}px 0 0 ${borderRadiusLG}px`
              : 0,
            boxShadow: paletteVisible ? boxShadowSecondary : "none",
            overflow: "hidden",
            margin: "4px 0 4px 4px",
          }}
        >
          <Card
            title={
              <Space>
                <DragOutlined style={{ color: colorPrimary }} />
                <span>Template Palette</span>
                <Badge count={(templates || []).length} />
              </Space>
            }
            size="small"
            style={{
              height: "100%",
              border: "none",
              borderRadius: borderRadiusLG,
            }}
            bodyStyle={{
              padding: "16px",
              height: "calc(100% - 57px)",
              overflow: "auto",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <Input.Search
                placeholder="Tìm kiếm template..."
                style={{ marginBottom: 12 }}
              />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Kéo template vào canvas để tạo node workflow
              </Text>
            </div>

            <Collapse
              ghost
              size="small"
              defaultActiveKey={Object.keys(groupedTemplates || {})}
              items={Object.entries(groupedTemplates || {}).map(
                ([agent, agentTemplates]) => ({
                  key: agent,
                  label: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "8px 4px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            background: `linear-gradient(135deg, ${
                              AGENT_COLORS[agent] || colorPrimary
                            }, ${AGENT_COLORS[agent] || colorPrimary}cc)`,
                            boxShadow: `0 2px 8px ${
                              AGENT_COLORS[agent] || colorPrimary
                            }40`,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: "12px",
                              fontWeight: "bold",
                              color: "#fff",
                              textAlign: "center",
                            }}
                          >
                            {agent.replace("AGT_", "").charAt(0)}
                          </Text>
                        </div>
                        <div style={{ flex: 1 }}>
                          <Text
                            strong
                            style={{
                              fontSize: "13px",
                              color: AGENT_COLORS[agent] || colorPrimary,
                              display: "block",
                              lineHeight: 1.2,
                            }}
                          >
                            {agent.replace("AGT_", "").replace("_", " ")}
                          </Text>
                          <Text
                            type="secondary"
                            style={{
                              fontSize: "10px",
                              lineHeight: 1.1,
                            }}
                          >
                            {(agentTemplates || []).length} templates
                          </Text>
                        </div>
                      </div>
                      <Badge
                        count={(agentTemplates || []).length}
                        size="small"
                        style={{
                          backgroundColor: AGENT_COLORS[agent] || colorPrimary,
                          fontSize: "9px",
                          fontWeight: "bold",
                          minWidth: "20px",
                          height: "20px",
                          lineHeight: "18px",
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                  ),
                  children: (
                    <div style={{ paddingLeft: "8px", paddingTop: "8px" }}>
                      {(agentTemplates || []).map((template) => (
                        <DraggableTemplate
                          key={template.templateId}
                          template={template}
                        />
                      ))}
                    </div>
                  ),
                  style: {
                    background: `linear-gradient(135deg, ${
                      AGENT_COLORS[agent] || colorPrimary
                    }08, ${AGENT_COLORS[agent] || colorPrimary}02)`,
                    border: `1px solid ${
                      AGENT_COLORS[agent] || colorPrimary
                    }15`,
                    borderRadius: "12px",
                    marginBottom: "12px",
                  },
                })
              )}
            />
          </Card>
        </div>

        {/* Main Canvas Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Workflow Information Panel */}
          <Card
            size="small"
            style={{
              margin: "4px 4px 8px 4px",
              borderRadius: borderRadiusLG,
              boxShadow: boxShadowSecondary,
            }}
            bodyStyle={{ padding: "12px 16px" }}
          >
            <Collapse
              size="small"
              ghost
              items={[
                {
                  key: "workflow-info",
                  label: (
                    <Space>
                      <InfoCircleOutlined style={{ color: colorPrimary }} />
                      <Text strong>Thông tin Workflow</Text>
                      {currentWorkflow && (
                        <Tag
                          color={
                            currentWorkflow.statusCode === "ACTIVE"
                              ? "green"
                              : "orange"
                          }
                        >
                          {currentWorkflow.statusName}
                        </Tag>
                      )}
                    </Space>
                  ),
                  children: currentWorkflow ? (
                    <Row gutter={[16, 8]}>
                      <Col xs={24} sm={12} md={8}>
                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Mã Workflow:
                          </Text>
                          <br />
                          <Text strong>{currentWorkflow.workflowCode}</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Tên Workflow:
                          </Text>
                          <br />
                          <Text strong>{currentWorkflow.workflowName}</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Mô tả:
                          </Text>
                          <br />
                          <Text>
                            {currentWorkflow.description || "Không có mô tả"}
                          </Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={12} md={6}>
                        <Statistic
                          title="Tổng Nodes"
                          value={(nodes || []).length}
                          prefix={<ApartmentOutlined />}
                          valueStyle={{
                            color: colorSuccess,
                            fontSize: 16,
                            fontWeight: "bold",
                          }}
                        />
                      </Col>
                      <Col xs={24} sm={12} md={6}>
                        <Statistic
                          title="Connections"
                          value={(edges || []).length}
                          prefix={<LinkOutlined />}
                          valueStyle={{
                            color: colorPrimary,
                            fontSize: 16,
                            fontWeight: "bold",
                          }}
                        />
                      </Col>
                    </Row>
                  ) : (
                    <Text type="secondary">
                      Vui lòng chọn workflow để xem thông tin
                    </Text>
                  ),
                },
              ]}
            />
          </Card>

          {/* Toolbar */}
          <Card
            style={{
              marginBottom: 8,
              borderRadius: borderRadiusLG,
              boxShadow: boxShadowSecondary,
            }}
            bodyStyle={{ padding: "12px 16px" }}
          >
            <Row gutter={[16, 8]} align="middle">
              <Col xs={24} sm={12} md={10}>
                <Space>
                  <Text strong>Workflow:</Text>
                  <Select
                    style={{ minWidth: 180 }}
                    placeholder="Chọn workflow"
                    value={selectedWorkflow}
                    onChange={setSelectedWorkflow}
                    options={(workflows || []).map((w) => ({
                      value: w.workflowCode,
                      label: `${w.workflowName} (${w.workflowCode})`,
                    }))}
                  />
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => setCreateWorkflowModalVisible(true)}
                    size="small"
                  >
                    Tạo mới
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      const testNode: Node = {
                        id: `test_${Date.now()}`,
                        type: "workflowNode",
                        position: { x: 100, y: 100 },
                        data: {
                          label: "Test Node",
                          templateCode: "TEST",
                          templateType: "trigger",
                          agentCode: "AGT_TEST",
                          description: "Test node for verification",
                        },
                      };
                      setNodes((prev) => [...prev, testNode]);
                      console.log("✅ Test node added:", testNode.id);
                    }}
                  >
                    Test Node
                  </Button>
                </Space>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Space>
                  <Button
                    icon={<RocketOutlined />}
                    onClick={saveWorkflowDesign}
                    type="primary"
                  >
                    Lưu
                  </Button>
                  <Button
                    icon={
                      isPlaying ? (
                        <PauseCircleOutlined />
                      ) : (
                        <PlayCircleOutlined />
                      )
                    }
                    onClick={toggleSimulation}
                    type={isPlaying ? "primary" : "default"}
                  >
                    {isPlaying ? "Dừng" : "Mô phỏng"}
                  </Button>
                </Space>
              </Col>

              <Col xs={24} sm={24} md={8}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Space>
                    <Button
                      icon={<ThunderboltOutlined />}
                      onClick={runWorkflowTest}
                      loading={isTestRunning}
                      type="default"
                      style={{
                        background: `${colorSuccess}10`,
                        borderColor: colorSuccess,
                        color: colorSuccess,
                      }}
                    >
                      {isTestRunning ? "Đang test..." : "Run All Test"}
                    </Button>
                    <Button
                      icon={<EyeOutlined />}
                      onClick={() => setPaletteVisible(!paletteVisible)}
                    >
                      Templates
                    </Button>
                  </Space>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Flow Canvas */}
          <div
            ref={reactFlowWrapper}
            style={{
              flex: 1,
              borderRadius: borderRadiusLG,
              overflow: "hidden",
              boxShadow: boxShadowSecondary,
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
              onDrop={onDrop}
              onDragOver={onDragOver}
              onInit={setReactFlowInstance}
              nodeTypes={nodeTypes}
              connectionMode={ConnectionMode.Loose}
              fitView={false}
              attributionPosition="bottom-left"
              style={{
                background: colorBgContainer,
                width: "100%",
                height: "100%",
              }}
              defaultViewport={{ x: 50, y: 50, zoom: 1 }}
              selectNodesOnDrag={false}
              panOnDrag={true}
              elementsSelectable={true}
              nodesDraggable={true}
              nodesConnectable={true}
              edgesFocusable={true}
              edgesUpdatable={true}
              deleteKeyCode={["Backspace", "Delete"]}
              connectionLineStyle={{
                strokeWidth: 2,
                stroke: colorPrimary,
              }}
              proOptions={{ hideAttribution: true }}
            >
              <Controls
                style={{
                  background: colorBgContainer,
                  border: `1px solid ${colorPrimary}20`,
                  borderRadius: 8,
                }}
              />
              <MiniMap
                nodeColor={(node) => {
                  const config =
                    TEMPLATE_CONFIGS[
                      node.data?.templateType as keyof typeof TEMPLATE_CONFIGS
                    ] || TEMPLATE_CONFIGS.process;
                  return config?.color || "#666";
                }}
                style={{
                  backgroundColor: colorBgContainer,
                  border: `1px solid ${colorPrimary}20`,
                  borderRadius: 8,
                }}
              />
              <Background
                variant={BackgroundVariant.Dots}
                gap={20}
                size={2}
                color={`${colorPrimary}20`}
              />

              {/* Enhanced Drop Zone Hint */}
              {(!nodes || nodes.length === 0) && (
                <Panel position="top-center">
                  <div
                    style={{
                      padding: "40px",
                      background: `linear-gradient(135deg, ${colorBgContainer}, ${colorPrimary}08)`,
                      borderRadius: borderRadiusLG,
                      border: `3px dashed ${colorPrimary}60`,
                      textAlign: "center",
                      maxWidth: "600px",
                      boxShadow: `${boxShadowSecondary}, 0 0 0 1px ${colorPrimary}20`,
                      animation: "pulse 2s ease-in-out infinite alternate",
                    }}
                  >
                    <DragOutlined
                      style={{
                        fontSize: "64px",
                        color: colorPrimary,
                        marginBottom: "24px",
                        display: "block",
                        opacity: 0.8,
                      }}
                    />
                    <Title
                      level={2}
                      style={{
                        color: colorPrimary,
                        marginBottom: "16px",
                        fontWeight: 600,
                      }}
                    >
                      🚀 Workflow Builder
                    </Title>
                    <Text
                      style={{
                        fontSize: "16px",
                        lineHeight: 1.8,
                        color: colorText,
                        display: "block",
                        marginBottom: "20px",
                      }}
                    >
                      <strong>Bắt đầu xây dựng workflow của bạn:</strong>
                      <br />
                      📝 <strong>1.</strong> Kéo template từ sidebar bên trái
                      vào canvas
                      <br />
                      🔗 <strong>2.</strong> Kết nối các node bằng cách kéo từ
                      ⚪ handle này đến ⚪ handle khác
                      <br />⚡ <strong>3.</strong> Sử dụng nút "Run All Test" để
                      kiểm tra workflow
                    </Text>
                    <div
                      style={{
                        background: `${colorPrimary}15`,
                        padding: "12px 20px",
                        borderRadius: "8px",
                        border: `1px solid ${colorPrimary}30`,
                      }}
                    >
                      <Text style={{ fontSize: "14px", color: colorPrimary }}>
                        💡 <strong>Mẹo:</strong> Trigger → Intermediate → Exit
                        là flow chuẩn
                      </Text>
                    </div>
                  </div>
                </Panel>
              )}
            </ReactFlow>
          </div>
        </div>

        {/* Node Properties Panel - Only show when node is selected */}
        {selectedNode && (
          <NodePropertiesPanel
            node={selectedNode}
            onUpdate={updateNodeData}
            onDelete={deleteSelectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}

        {/* Show helper text when no node selected */}
        {!selectedNode && (
          <div
            style={{
              position: "fixed",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              background: colorBgContainer,
              border: `2px dashed ${colorPrimary}40`,
              borderRadius: borderRadiusLG,
              padding: "20px",
              textAlign: "center",
              maxWidth: "200px",
              boxShadow: boxShadowSecondary,
              zIndex: 1000,
            }}
          >
            <InfoCircleOutlined
              style={{
                fontSize: "24px",
                color: colorPrimary,
                marginBottom: "8px",
              }}
            />
            <Text
              style={{
                fontSize: "12px",
                display: "block",
                marginBottom: "4px",
              }}
            >
              <strong>Chọn một node</strong>
            </Text>
            <Text type="secondary" style={{ fontSize: "11px" }}>
              để xem và chỉnh sửa thuộc tính
            </Text>
          </div>
        )}

        {/* Create Workflow Modal */}
        <Modal
          title="Tạo Workflow Mới"
          open={createWorkflowModalVisible}
          onCancel={() => {
            setCreateWorkflowModalVisible(false);
            createForm.resetFields();
          }}
          footer={null}
          width={500}
        >
          <Form
            form={createForm}
            layout="vertical"
            onFinish={handleCreateNewWorkflow}
          >
            <Form.Item
              name="workflowCode"
              label="Mã Workflow"
              rules={[{ required: true, message: "Vui lòng nhập mã workflow" }]}
            >
              <Input placeholder="WF_001" />
            </Form.Item>

            <Form.Item
              name="workflowName"
              label="Tên Workflow"
              rules={[
                { required: true, message: "Vui lòng nhập tên workflow" },
              ]}
            >
              <Input placeholder="My Workflow" />
            </Form.Item>

            <Form.Item name="description" label="Mô tả">
              <Input.TextArea rows={3} placeholder="Mô tả workflow..." />
            </Form.Item>

            <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
              <Space>
                <Button
                  onClick={() => {
                    setCreateWorkflowModalVisible(false);
                    createForm.resetFields();
                  }}
                >
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  Tạo Workflow
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Enhanced Test Results Drawer */}
        <Drawer
          title={
            <Space>
              <RocketOutlined style={{ color: colorSuccess }} />
              <span>Kết quả Test Chi Tiết</span>
              {testResults && (
                <Tag
                  color={
                    testResults.status === "success"
                      ? "green"
                      : testResults.status === "partial"
                      ? "orange"
                      : "red"
                  }
                >
                  {testResults.status === "success"
                    ? "Thành công"
                    : testResults.status === "partial"
                    ? "Một phần"
                    : "Thất bại"}
                </Tag>
              )}
            </Space>
          }
          open={testResultsDrawerVisible}
          onClose={() => setTestResultsDrawerVisible(false)}
          width={600}
          extra={
            <Button onClick={() => setTestResultsDrawerVisible(false)}>
              Đóng
            </Button>
          }
        >
          {testResults && (
            <div>
              {/* Test Summary */}
              <Card
                title="Tóm tắt kết quả"
                size="small"
                style={{ marginBottom: 16 }}
              >
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <Statistic
                      title="Thời gian thực thi"
                      value={(testResults.executionTime / 1000).toFixed(2)}
                      suffix="s"
                      valueStyle={{ color: colorSuccess, fontSize: 16 }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Tỷ lệ thành công"
                      value={(
                        (testResults.successfulNodes /
                          testResults.nodesExecuted) *
                        100
                      ).toFixed(1)}
                      suffix="%"
                      valueStyle={{
                        color:
                          testResults.failedNodes === 0
                            ? colorSuccess
                            : colorWarning,
                        fontSize: 16,
                      }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Nodes thành công"
                      value={testResults.successfulNodes}
                      valueStyle={{ color: colorSuccess, fontSize: 14 }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Nodes thất bại"
                      value={testResults.failedNodes}
                      valueStyle={{ color: colorError, fontSize: 14 }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Tổng nodes"
                      value={testResults.nodesExecuted}
                      valueStyle={{ color: colorPrimary, fontSize: 14 }}
                    />
                  </Col>
                </Row>

                {testResults.summary && (
                  <div style={{ marginTop: 16 }}>
                    <Divider orientation="left" style={{ margin: "12px 0" }}>
                      Hiệu suất
                    </Divider>
                    <Row gutter={[12, 8]}>
                      <Col span={12}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Throughput:
                        </Text>
                        <br />
                        <Text strong>
                          {testResults.summary.throughput} req/s
                        </Text>
                      </Col>
                      <Col span={12}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Avg Response:
                        </Text>
                        <br />
                        <Text strong>
                          {testResults.summary.averageResponseTime.toFixed(0)}ms
                        </Text>
                      </Col>
                      <Col span={12}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Error Rate:
                        </Text>
                        <br />
                        <Text
                          strong
                          style={{
                            color:
                              testResults.summary.errorRate > 0
                                ? colorError
                                : colorSuccess,
                          }}
                        >
                          {testResults.summary.errorRate.toFixed(1)}%
                        </Text>
                      </Col>
                      <Col span={12}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Peak Memory:
                        </Text>
                        <br />
                        <Text strong>
                          {testResults.summary.peakMemoryUsage}MB
                        </Text>
                      </Col>
                    </Row>
                  </div>
                )}
              </Card>

              {/* Step-by-step Results */}
              {testResults.stepResults && (
                <Card
                  title="Chi tiết từng bước"
                  size="small"
                  style={{ marginBottom: 16 }}
                >
                  <Timeline
                    items={testResults.stepResults.map((step, index) => ({
                      color:
                        step.status === "success" ? colorSuccess : colorError,
                      children: (
                        <div key={step.nodeId}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: 8,
                            }}
                          >
                            <div>
                              <Text strong style={{ fontSize: 13 }}>
                                {step.nodeName}
                              </Text>
                              <br />
                              <Tag
                                size="small"
                                color={
                                  AGENT_COLORS[step.agentCode] || colorPrimary
                                }
                              >
                                {step.agentCode}
                              </Tag>
                              <Tag
                                size="small"
                                color={
                                  step.status === "success" ? "green" : "red"
                                }
                              >
                                {step.status === "success"
                                  ? "Thành công"
                                  : "Thất bại"}
                              </Tag>
                            </div>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              {step.executionTime.toFixed(0)}ms
                            </Text>
                          </div>

                          <Collapse
                            ghost
                            size="small"
                            items={[
                              {
                                key: `details-${index}`,
                                label: (
                                  <Text style={{ fontSize: 11 }}>Chi tiết</Text>
                                ),
                                children: (
                                  <div style={{ fontSize: 11 }}>
                                    <div style={{ marginBottom: 8 }}>
                                      <Text strong>Input:</Text>
                                      <div
                                        style={{
                                          background: "#f5f5f5",
                                          padding: 8,
                                          borderRadius: 4,
                                          marginTop: 4,
                                        }}
                                      >
                                        <pre
                                          style={{ margin: 0, fontSize: 10 }}
                                        >
                                          {JSON.stringify(step.input, null, 2)}
                                        </pre>
                                      </div>
                                    </div>

                                    <div style={{ marginBottom: 8 }}>
                                      <Text strong>Output:</Text>
                                      <div
                                        style={{
                                          background:
                                            step.status === "success"
                                              ? "#f6ffed"
                                              : "#fff2f0",
                                          padding: 8,
                                          borderRadius: 4,
                                          marginTop: 4,
                                          border: `1px solid ${
                                            step.status === "success"
                                              ? "#b7eb8f"
                                              : "#ffccc7"
                                          }`,
                                        }}
                                      >
                                        <pre
                                          style={{ margin: 0, fontSize: 10 }}
                                        >
                                          {JSON.stringify(step.output, null, 2)}
                                        </pre>
                                      </div>
                                    </div>

                                    <div>
                                      <Text strong>Logs:</Text>
                                      {step.logs.map((log, logIndex) => (
                                        <div
                                          key={logIndex}
                                          style={{
                                            fontSize: 10,
                                            color:
                                              log.level === "error"
                                                ? colorError
                                                : log.level === "success"
                                                ? colorSuccess
                                                : colorText,
                                            marginTop: 2,
                                          }}
                                        >
                                          [{log.timestamp.toLocaleTimeString()}]{" "}
                                          {log.level.toUpperCase()}:{" "}
                                          {log.message}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ),
                              },
                            ]}
                          />
                        </div>
                      ),
                    }))}
                  />
                </Card>
              )}

              {/* Overall Logs */}
              <Card title="System Logs" size="small">
                <div
                  style={{
                    maxHeight: 200,
                    overflowY: "auto",
                    fontFamily: "monospace",
                    fontSize: 11,
                  }}
                >
                  {testResults.logs.map((log, index) => (
                    <div
                      key={index}
                      style={{
                        color:
                          log.level === "error"
                            ? colorError
                            : log.level === "success"
                            ? colorSuccess
                            : colorText,
                        marginBottom: 4,
                      }}
                    >
                      [{log.timestamp.toLocaleTimeString()}]{" "}
                      {log.level.toUpperCase()}: {log.message}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </Drawer>
      </div>
    </ReactFlowProvider>
  );
};

export default WorkflowBuilderPage;
