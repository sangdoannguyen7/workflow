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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { ITemplate } from "../../interface/template.interface";
import { IWorkflow } from "../../interface/workflow.interface";
import { IWorkflowDesign } from "../../interface/workflow.interface";
import templateApi from "../../apis/template/api.template";
import workflowApi from "../../apis/workflow/api.workflow";
import { WorkflowMockAPI } from "../../mock/workflow-enhanced.mock";
import { NotificationComponent } from "../../shared/components/notification/notification";

// Import components
import WorkflowToolbar from "./components/WorkflowToolbar";
import NodePropertiesPanel from "./components/NodePropertiesPanel";

const { Text, Title } = Typography;
const { TextArea } = Input;

// Template configurations with enhanced styling
const TEMPLATE_CONFIGS = {
  webhook: {
    icon: <LinkOutlined />,
    color: "#52c41a",
    bgColor: "#f6ffed",
    borderColor: "#b7eb8f",
  },
  schedule: {
    icon: <ScheduleOutlined />,
    color: "#1890ff",
    bgColor: "#e6f7ff",
    borderColor: "#91d5ff",
  },
  restapi: {
    icon: <ApiOutlined />,
    color: "#fa8c16",
    bgColor: "#fff7e6",
    borderColor: "#ffd591",
  },
  process: {
    icon: <SettingOutlined />,
    color: "#722ed1",
    bgColor: "#f9f0ff",
    borderColor: "#d3adf7",
  },
};

// Draggable Template Component with enhanced design
const DraggableTemplate: React.FC<{ template: ITemplate }> = ({ template }) => {
  const config =
    TEMPLATE_CONFIGS[template.templateType as keyof typeof TEMPLATE_CONFIGS] ||
    TEMPLATE_CONFIGS.process;

  const onDragStart = (
    event: DragEvent<HTMLDivElement>,
    template: ITemplate
  ) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({
        type: "template",
        template: template,
      })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={(event) => onDragStart(event, template)}
      style={{
        border: `2px solid ${config?.borderColor || "#d9d9d9"}`,
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "12px",
        cursor: "grab",
        backgroundColor: config?.bgColor || "#fafafa",
        transition: "all 0.3s ease",
        userSelect: "none",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 8px 24px ${
          config?.color || "#ccc"
        }40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
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

// Enhanced Custom Node Component
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
        padding: "20px",
        border: selected
          ? `3px solid ${config?.color || "#1890ff"}`
          : `2px solid ${config?.borderColor || "#d9d9d9"}`,
        borderRadius: "16px",
        background: "#fff",
        minWidth: "220px",
        maxWidth: "280px",
        boxShadow: selected
          ? `0 12px 28px ${config?.color || "#1890ff"}40`
          : "0 4px 12px rgba(0,0,0,0.08)",
        position: "relative",
        transition: "all 0.3s ease",
        cursor: "pointer",
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

      {/* Connection Handles */}
      <div
        style={{
          position: "absolute",
          left: "-8px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          border: `3px solid ${config?.color || "#666"}`,
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
        className="react-flow__handle react-flow__handle-left"
      />

      <div
        style={{
          position: "absolute",
          right: "-8px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          border: `3px solid ${config?.color || "#666"}`,
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
        className="react-flow__handle react-flow__handle-right"
      />
    </div>
  );
};

const AGENT_COLORS: Record<string, string> = {
  AGT_VALIDATOR: "#52c41a",
  AGT_DATABASE: "#1890ff",
  AGT_EMAIL: "#fa8c16",
  AGT_SECURITY: "#722ed1",
  AGT_PAYMENT: "#eb2f96",
  AGT_ETL: "#13c2c2",
  AGT_ANALYTICS: "#faad14",
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
      colorTextSecondary,
      boxShadowSecondary,
    },
  } = theme.useToken();

  // Handle node connections
  const onConnect = useCallback(
    (params: Connection) => {
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
        description: "Đã kết nối nodes thành công",
      });
    },
    [setEdges, isPlaying, colorPrimary]
  );

  // Handle drop from template palette
  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds || !reactFlowInstance) return;

      const data = event.dataTransfer.getData("application/reactflow");
      if (!data) return;

      try {
        const { template } = JSON.parse(data);

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const newNodeId = `node_${nodeCounter}`;
        const newNode: Node = {
          id: newNodeId,
          type: "workflowNode",
          position: {
            x: position.x - 140,
            y: position.y - 60,
          },
          data: {
            label: template.templateName,
            templateCode: template.templateCode,
            templateType: template.templateType,
            agentCode: template.agentCode,
            description: template.description,
            template: template,
            timeout: 30000,
            retries: 3,
            priority: "normal",
          },
        };

        setNodes((nds) => nds.concat(newNode));
        setNodeCounter((prev) => prev + 1);
        NotificationComponent({
          type: "success",
          message: "Thành công",
          description: `Đã thêm node "${template.templateName}"`,
        });
      } catch (error) {
        NotificationComponent({
          type: "error",
          message: "Lỗi",
          description: "Không thể thêm node",
        });
      }
    },
    [nodeCounter, setNodes, reactFlowInstance]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Test workflow functionality
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
      // Mock test execution
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const mockResults = {
        status: "success",
        executionTime: Math.random() * 5000 + 1000,
        nodesExecuted: (nodes || []).length,
        successfulNodes: Math.floor((nodes || []).length * 0.9),
        failedNodes: Math.ceil((nodes || []).length * 0.1),
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
            level: "success",
            message: "Workflow test completed",
          },
        ],
      };

      setTestResults(mockResults);
      NotificationComponent({
        type: "success",
        message: "Test hoàn thành",
        description: `Workflow đã được test thành công trong ${(
          mockResults.executionTime / 1000
        ).toFixed(2)}s`,
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
      const response = await workflowApi.getWorkflows({ pageSize: 1000 });
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
      const design = await workflowApi.getWorkflowDesign(code);
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

      await workflowApi.saveWorkflowDesign(selectedWorkflow, design);
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
              defaultActiveKey={Object.keys(groupedTemplates || {})}
              ghost
              size="small"
              items={Object.entries(groupedTemplates || {}).map(
                ([agent, agentTemplates]) => ({
                  key: agent,
                  label: (
                    <Space>
                      <Avatar
                        size="small"
                        style={{
                          backgroundColor: AGENT_COLORS[agent] || colorPrimary,
                          fontSize: "10px",
                        }}
                      >
                        {agent.charAt(0).toUpperCase()}
                      </Avatar>
                      <Text strong>{agent}</Text>
                      <Badge count={(agentTemplates || []).length} />
                    </Space>
                  ),
                  children: (agentTemplates || []).map((template) => (
                    <DraggableTemplate
                      key={template.templateId}
                      template={template}
                    />
                  )),
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
              <Col xs={24} sm={12} md={8}>
                <Space>
                  <Text strong>Workflow:</Text>
                  <Select
                    style={{ minWidth: 200 }}
                    placeholder="Chọn workflow"
                    value={selectedWorkflow}
                    onChange={setSelectedWorkflow}
                    options={(workflows || []).map((w) => ({
                      value: w.workflowCode,
                      label: `${w.workflowName} (${w.workflowCode})`,
                    }))}
                  />
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
              fitView
              attributionPosition="bottom-left"
              style={{
                background: colorBgContainer,
              }}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
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

              {/* Drop Zone Hint */}
              {(!nodes || nodes.length === 0) && (
                <Panel position="top-center">
                  <div
                    style={{
                      padding: "32px",
                      background: colorBgContainer,
                      borderRadius: borderRadiusLG,
                      border: `2px dashed ${colorPrimary}40`,
                      textAlign: "center",
                      maxWidth: "500px",
                      boxShadow: boxShadowSecondary,
                    }}
                  >
                    <ApartmentOutlined
                      style={{
                        fontSize: "56px",
                        color: colorPrimary,
                        marginBottom: "20px",
                        display: "block",
                      }}
                    />
                    <Title
                      level={3}
                      style={{ color: colorPrimary, marginBottom: "12px" }}
                    >
                      Workflow Builder
                    </Title>
                    <Text
                      type="secondary"
                      style={{ fontSize: "15px", lineHeight: 1.6 }}
                    >
                      Kéo thả template từ sidebar để tạo workflow nodes.
                      <br />
                      Kết nối các node bằng cách kéo từ handle này đến handle
                      khác.
                      <br />
                      Sử dụng nút "Run All Test" để kiểm tra workflow.
                    </Text>
                  </div>
                </Panel>
              )}
            </ReactFlow>
          </div>

          {/* Test Results */}
          {testResults && (
            <Card
              title={
                <Space>
                  <CheckCircleOutlined style={{ color: colorSuccess }} />
                  <span>Kết quả Test</span>
                </Space>
              }
              style={{
                marginTop: 8,
                borderRadius: borderRadiusLG,
                boxShadow: boxShadowSecondary,
              }}
              bodyStyle={{ padding: "16px" }}
            >
              <Row gutter={[16, 8]}>
                <Col xs={24} sm={6}>
                  <Statistic
                    title="Thời gian thực thi"
                    value={(testResults.executionTime / 1000).toFixed(2)}
                    suffix="s"
                    valueStyle={{ color: colorSuccess }}
                  />
                </Col>
                <Col xs={24} sm={6}>
                  <Statistic
                    title="Nodes thành công"
                    value={testResults.successfulNodes}
                    suffix={`/${testResults.nodesExecuted}`}
                    valueStyle={{ color: colorSuccess }}
                  />
                </Col>
                <Col xs={24} sm={6}>
                  <Statistic
                    title="Nodes thất bại"
                    value={testResults.failedNodes}
                    suffix={`/${testResults.nodesExecuted}`}
                    valueStyle={{
                      color:
                        testResults.failedNodes > 0 ? colorError : colorSuccess,
                    }}
                  />
                </Col>
                <Col xs={24} sm={6}>
                  <Progress
                    type="circle"
                    size={60}
                    percent={Math.round(
                      (testResults.successfulNodes /
                        testResults.nodesExecuted) *
                        100
                    )}
                    strokeColor={colorSuccess}
                  />
                </Col>
              </Row>
            </Card>
          )}
        </div>

        {/* Node Properties Panel */}
        <NodePropertiesPanel
          node={selectedNode}
          onUpdate={updateNodeData}
          onDelete={deleteSelectedNode}
          onClose={() => setSelectedNode(null)}
        />
      </div>
    </ReactFlowProvider>
  );
};

export default WorkflowBuilderPage;
