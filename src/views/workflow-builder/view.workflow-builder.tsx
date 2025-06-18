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
import {
  NodeType,
  getNodeTypeFromTemplate,
  canNodesConnect,
  getNodeTypeColor,
  getNodeTypeIcon,
} from "../../types/workflow-nodes.types";

const { Text, Title } = Typography;
const { Panel: CollapsePanel } = Collapse;

// Template configurations
const TEMPLATE_CONFIGS = {
  trigger: {
    icon: <LinkOutlined />,
    color: "#52c41a",
    bgColor: "#f6ffed",
    borderColor: "#b7eb8f",
  },
  behavior: {
    icon: <ApiOutlined />,
    color: "#1890ff",
    bgColor: "#e6f7ff",
    borderColor: "#91d5ff",
  },
  output: {
    icon: <ScheduleOutlined />,
    color: "#fa8c16",
    bgColor: "#fff7e6",
    borderColor: "#ffd591",
  },
};

// Draggable Template Component - SỬA LẠI HOÀN TOÀN
const DraggableTemplate: React.FC<{ template: ITemplate }> = ({ template }) => {
  const nodeType = getNodeTypeFromTemplate(template.templateType);
  const config = TEMPLATE_CONFIGS[nodeType];

  // SỬA LẠI HÀM DRAG START
  const onDragStart = (event: DragEvent<HTMLDivElement>) => {
    console.log("Drag started for template:", template.templateCode);

    const dragData = {
      type: "template",
      template: template,
      nodeType: nodeType,
    };

    // Set data với key đúng
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(dragData)
    );
    event.dataTransfer.setData("text/plain", template.templateCode);
    event.dataTransfer.effectAllowed = "copy";

    // Thêm visual feedback
    if (event.currentTarget) {
      event.currentTarget.style.opacity = "0.5";
    }
  };

  const onDragEnd = (event: DragEvent<HTMLDivElement>) => {
    if (event.currentTarget) {
      event.currentTarget.style.opacity = "1";
    }
  };

  return (
    <div
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{
        border: `2px solid ${config?.borderColor || "#d9d9d9"}`,
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "8px",
        cursor: "grab",
        backgroundColor: config?.bgColor || "#fafafa",
        transition: "all 0.2s ease",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 4px 12px ${
          config?.color || "#ccc"
        }30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.cursor = "grabbing";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.cursor = "grab";
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}
      >
        <div
          style={{
            color: config?.color || "#666",
            marginRight: "8px",
            fontSize: "16px",
          }}
        >
          {config?.icon}
        </div>
        <Text strong style={{ color: config?.color || "#666" }}>
          {template.templateName}
        </Text>
      </div>
      <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>
        {template.templateCode}
      </Text>
      <Text style={{ fontSize: "11px", color: "#999", lineHeight: "1.2" }}>
        {template.description && template.description.length > 50
          ? `${template.description.substring(0, 50)}...`
          : template.description}
      </Text>
      <div style={{ marginTop: "6px" }}>
        <Tag size="small" color={config?.color}>
          {nodeType.toUpperCase()}
        </Tag>
        <Tag
          size="small"
          color={template.statusCode === "ACTIVE" ? "green" : "orange"}
        >
          {template.statusName}
        </Tag>
      </div>
    </div>
  );
};

// Enhanced Custom Node Component với handles đúng
const WorkflowNode: React.FC<{ data: any; selected: boolean; id: string }> = ({
  data,
  selected,
  id,
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
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}
    >
      {/* Input Handle - chỉ hiển thị nếu node có thể nhận input */}
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
          }}
        />
      )}

      {/* Output Handle - chỉ hiển thị nếu node có thể tạo output */}
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
          }}
        />
      )}

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
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Validate connection based on node types
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

  // Handle node connections with validation
  const onConnect = useCallback(
    (params: Connection) => {
      console.log("Attempting to connect:", params);

      if (!isValidConnection(params)) {
        message.error(
          "Không thể kết nối các node này! Kiểm tra loại node và quy tắc kết nối."
        );
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
      };
      setEdges((eds) => addEdge(newEdge, eds));
      message.success("Đã kết nối nodes thành công!");
    },
    [setEdges, isPlaying, isValidConnection]
  );

  // SỬA LẠI HÀM DROP HOÀN TOÀN - Không dùng reactFlowInstance.project
  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      console.log("Drop event triggered");

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) {
        console.log("Missing bounds");
        return;
      }

      const data = event.dataTransfer.getData("application/reactflow");
      console.log("Dropped data:", data);

      if (!data) {
        console.log("No data in drop event");
        return;
      }

      try {
        const { template, nodeType } = JSON.parse(data);
        console.log("Parsed template:", template);

        // Tính toán vị trí trực tiếp mà không cần reactFlowInstance.project
        const dropX = event.clientX - reactFlowBounds.left;
        const dropY = event.clientY - reactFlowBounds.top;

        console.log("Drop position:", { x: dropX, y: dropY });

        const newNodeId = `node_${nodeCounter}`;
        const newNode: Node = {
          id: newNodeId,
          type: "workflowNode",
          position: {
            x: Math.max(0, dropX - 125), // Center the node, tránh âm
            y: Math.max(0, dropY - 50),
          },
          data: {
            label: template.templateName,
            templateCode: template.templateCode,
            templateType: template.templateType,
            agentCode: template.agentCode,
            description: template.description,
            template: template,
            nodeType: nodeType,
            timeout: 30000,
            retries: 3,
            priority: "normal",
          },
        };

        console.log("Creating new node:", newNode);
        setNodes((nds) => nds.concat(newNode));
        setNodeCounter((prev) => prev + 1);
        message.success(
          `Đã thêm node "${template.templateName}" (${nodeType.toUpperCase()})`
        );
        setIsDragging(false);
      } catch (error) {
        console.error("Error parsing drop data:", error);
        message.error("Không thể thêu node");
        setIsDragging(false);
      }
    },
    [nodeCounter, setNodes]
  );

  // SỬA LẠI HÀM DRAG OVER
  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    // Chỉ clear khi thực sự rời khỏi toàn bộ area
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragging(false);
    }
  }, []);

  // Fetch data
  const fetchWorkflows = async () => {
    try {
      const response = await workflowApi.getWorkflows({ size: 1000 });
      setWorkflows(response.content);
    } catch (error) {
      message.error("Không thể tải danh sách workflow");
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await templateApi.getTemplates({ size: 1000 });
      setTemplates(response.content);
      console.log("Loaded templates:", response.content.length);
    } catch (error) {
      message.error("Không thể tải danh sách template");
    }
  };

  // Load workflow design
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

      message.success("Tải workflow thành công");
    } catch (error) {
      message.info("Tạo workflow mới");
      setNodes([]);
      setEdges([]);
      setNodeCounter(1);
    }
  };

  // Save workflow design
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
      message.success("Lưu workflow thành công");
    } catch (error) {
      message.error("Không thể lưu workflow");
    }
  };

  // Node click handler
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Pane click handler
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Delete selected node
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
      message.success("Đã xóa node");
    }
  }, [selectedNode, setNodes, setEdges]);

  // Clear workflow
  const clearWorkflow = useCallback(() => {
    Modal.confirm({
      title: "Xóa tất cả workflow?",
      content: "Thao tác này sẽ xóa toàn bộ nodes và connections.",
      onOk: () => {
        setNodes([]);
        setEdges([]);
        setSelectedNode(null);
        setNodeCounter(1);
        message.success("Đã xóa toàn bộ workflow");
      },
    });
  }, [setNodes, setEdges]);

  // Toggle simulation
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
      newIsPlaying ? "Bắt đầu mô phỏng workflow" : "Dừng mô phỏng workflow"
    );
  }, [isPlaying, setEdges]);

  // Group templates by type
  const groupedTemplates = templates.reduce((acc, template) => {
    const nodeType = getNodeTypeFromTemplate(template.templateType);
    if (!acc[nodeType]) {
      acc[nodeType] = [];
    }
    acc[nodeType].push(template);
    return acc;
  }, {} as Record<string, ITemplate[]>);

  useEffect(() => {
    fetchWorkflows();
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (selectedWorkflow) {
      loadWorkflowDesign(selectedWorkflow);
    }
  }, [selectedWorkflow]);

  return (
    <ReactFlowProvider>
      <div
        style={{
          height: "100vh",
          display: "flex",
          background: colorBgContainer,
        }}
      >
        {/* Template Palette Sidebar */}
        <div
          style={{
            width: paletteVisible ? "320px" : "0px",
            transition: "width 0.3s ease",
            borderRight: paletteVisible ? "1px solid #d9d9d9" : "none",
            background: "#fafafa",
            overflow: "hidden",
          }}
        >
          <Card
            title={
              <Space>
                <DragOutlined />
                Template Palette
                <Badge count={templates.length} />
              </Space>
            }
            size="small"
            style={{ height: "100%", border: "none" }}
            bodyStyle={{
              padding: "12px",
              height: "calc(100% - 57px)",
              overflow: "auto",
            }}
          >
            <div style={{ marginBottom: "12px" }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
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

            <Collapse defaultActiveKey={Object.keys(groupedTemplates)} ghost>
              {Object.entries(groupedTemplates).map(([type, templateList]) => (
                <CollapsePanel
                  key={type}
                  header={
                    <Space>
                      <span style={{ fontSize: "16px" }}>
                        {getNodeTypeIcon(type as NodeType)}
                      </span>
                      <Text
                        strong
                        style={{ color: getNodeTypeColor(type as NodeType) }}
                      >
                        {type.toUpperCase()}
                      </Text>
                      <Badge count={templateList.length} />
                    </Space>
                  }
                >
                  {templateList.map((template) => (
                    <DraggableTemplate
                      key={template.templateId}
                      template={template}
                    />
                  ))}
                </CollapsePanel>
              ))}
            </Collapse>
          </Card>
        </div>

        {/* Main Canvas Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Toolbar */}
          <Card size="small" style={{ margin: "8px", marginBottom: 0 }}>
            <Row gutter={16} align="middle">
              <Col flex="auto">
                <Space>
                  <Select
                    style={{ width: 300 }}
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
                  <Button
                    icon={<DragOutlined />}
                    onClick={() => setPaletteVisible(!paletteVisible)}
                  >
                    {paletteVisible ? "Ẩn" : "Hiện"} Palette
                  </Button>
                </Space>
              </Col>
              <Col>
                <Space>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Nodes: {nodes.length} | Edges: {edges.length}
                  </Text>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() =>
                      selectedWorkflow && loadWorkflowDesign(selectedWorkflow)
                    }
                    disabled={!selectedWorkflow}
                  >
                    Tải lại
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
                    {isPlaying ? "Dừng" : "Chạy"} Mô phỏng
                  </Button>
                  <Button
                    danger
                    onClick={clearWorkflow}
                    disabled={nodes.length === 0}
                  >
                    Xóa tất cả
                  </Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={saveWorkflowDesign}
                    disabled={!selectedWorkflow}
                  >
                    Lưu Workflow
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Flow Canvas */}
          <div
            ref={reactFlowWrapper}
            style={{
              flex: 1,
              margin: "4px 8px 8px 8px",
              border: isDragging ? "3px dashed #1890ff" : "2px dashed #d9d9d9",
              borderRadius: "8px",
              transition: "border 0.2s ease",
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
              onDragLeave={onDragLeave}
              onInit={setReactFlowInstance}
              nodeTypes={nodeTypes}
              connectionMode={ConnectionMode.Loose}
              fitView
              attributionPosition="bottom-left"
              style={{
                background: isDragging ? "#e6f7ff" : "#fafafa",
                borderRadius: "8px",
              }}
            >
              <Controls />
              <MiniMap
                nodeColor={(node) => {
                  const nodeType = getNodeTypeFromTemplate(
                    node.data?.templateType
                  );
                  return getNodeTypeColor(nodeType);
                }}
                style={{
                  backgroundColor: "#fafafa",
                  border: "1px solid #d9d9d9",
                }}
              />
              <Background variant={BackgroundVariant.Dots} gap={16} size={1} />

              {/* Drop Zone Hint */}
              {nodes.length === 0 && (
                <Panel position="top-center">
                  <div
                    style={{
                      padding: "24px",
                      background: "rgba(255,255,255,0.95)",
                      borderRadius: "12px",
                      border: "2px dashed #d9d9d9",
                      textAlign: "center",
                      maxWidth: "450px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    <ApartmentOutlined
                      style={{
                        fontSize: "48px",
                        color: "#d9d9d9",
                        marginBottom: "16px",
                        display: "block",
                      }}
                    />
                    <Title
                      level={3}
                      type="secondary"
                      style={{ marginBottom: "8px" }}
                    >
                      Workflow Builder
                    </Title>
                    <Text type="secondary" style={{ fontSize: "14px" }}>
                      🎯 <strong>Bước 1:</strong> Kéo template từ sidebar trái
                      vào đây
                      <br />
                      🎯 <strong>Bước 2:</strong> Kết nối các node: 🚀 TRIGGER →
                      ⚙️ BEHAVIOR → 📤 OUTPUT
                      <br />
                      🎯 <strong>Bước 3:</strong> Lưu workflow và test
                    </Text>
                  </div>
                </Panel>
              )}

              {/* Drag Feedback */}
              {isDragging && (
                <Panel position="bottom-center">
                  <div
                    style={{
                      padding: "12px 24px",
                      background: "#1890ff",
                      color: "white",
                      borderRadius: "24px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    📍 Thả để tạo node mới
                  </div>
                </Panel>
              )}
            </ReactFlow>
          </div>
        </div>

        {/* Node Properties Panel */}
        {selectedNode && (
          <Card
            style={{
              position: "absolute",
              top: "80px",
              right: "24px",
              width: "320px",
              zIndex: 1000,
            }}
            title={
              <Space>
                <span style={{ fontSize: "16px" }}>
                  {getNodeTypeIcon(
                    getNodeTypeFromTemplate(selectedNode.data.templateType)
                  )}
                </span>
                Chi tiết Node
              </Space>
            }
            extra={
              <Button type="text" onClick={() => setSelectedNode(null)}>
                ✕
              </Button>
            }
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Text strong>Tên: </Text>
                <Text>{selectedNode.data.label}</Text>
              </div>
              <div>
                <Text strong>Template: </Text>
                <Text>{selectedNode.data.templateCode}</Text>
              </div>
              <div>
                <Text strong>Loại: </Text>
                <Tag
                  color={getNodeTypeColor(
                    getNodeTypeFromTemplate(selectedNode.data.templateType)
                  )}
                >
                  {getNodeTypeFromTemplate(
                    selectedNode.data.templateType
                  ).toUpperCase()}
                </Tag>
              </div>
              <div>
                <Text strong>Agent: </Text>
                <Text>{selectedNode.data.agentCode}</Text>
              </div>
              {selectedNode.data.description && (
                <div>
                  <Text strong>Mô tả: </Text>
                  <Text type="secondary">{selectedNode.data.description}</Text>
                </div>
              )}
              <div>
                <Text strong>Vị trí: </Text>
                <Text type="secondary">
                  x: {Math.round(selectedNode.position.x)}, y:{" "}
                  {Math.round(selectedNode.position.y)}
                </Text>
              </div>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={deleteSelectedNode}
                style={{ marginTop: "16px" }}
                block
              >
                Xóa Node
              </Button>
            </Space>
          </Card>
        )}
      </div>
    </ReactFlowProvider>
  );
};

export default WorkflowBuilderPage;
