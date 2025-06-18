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
  Drawer,
  Form,
  Input,
  theme,
  Typography,
  List,
  Tag,
  Divider,
  Badge,
  Tooltip,
  Modal,
  Tabs,
  Collapse,
} from "antd";
import {
  SaveOutlined,
  ReloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  ApartmentOutlined,
  ApiOutlined,
  ScheduleOutlined,
  LinkOutlined,
  DragOutlined,
  SettingOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  EditOutlined,
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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { ITemplate } from "../../interface/template.interface";
import { IWorkflow } from "../../interface/workflow.interface";
import { IWorkflowDesign } from "../../interface/workflow.interface";

import templateApi from "../../apis/template/api.template";
import workflowApi from "../../apis/workflow/api.workflow";

const { Option } = Select;
const { Text, Title } = Typography;
const { TabPane } = Tabs;
const { Panel: CollapsePanel } = Collapse;

// Template type configurations
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
};

// Draggable Template Item Component
const DraggableTemplate: React.FC<{ template: ITemplate }> = ({ template }) => {
  const config =
    TEMPLATE_CONFIGS[template.templateType as keyof typeof TEMPLATE_CONFIGS];

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
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "8px",
        cursor: "grab",
        backgroundColor: config?.bgColor || "#fafafa",
        transition: "all 0.2s ease",
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
        {template.description}
      </Text>
      <div style={{ marginTop: "6px" }}>
        <Tag size="small" color={config?.color}>
          {template.templateType?.toUpperCase()}
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

// Custom Node Component with enhanced styling
const WorkflowNode: React.FC<{ data: any; selected: boolean }> = ({
  data,
  selected,
}) => {
  const config =
    TEMPLATE_CONFIGS[data.templateType as keyof typeof TEMPLATE_CONFIGS];

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
      }}
    >
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
        {data.templateType?.toUpperCase()}
      </div>

      {/* Node Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "8px",
        }}
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
        <div>
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
          {data.description}
        </Text>
      )}

      {/* Node Footer */}
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
            backgroundColor: config?.color || "#666",
          }}
        />
      </div>

      {/* Connection Points */}
      <div
        style={{
          position: "absolute",
          left: "-6px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          border: `2px solid ${config?.color || "#666"}`,
          backgroundColor: "#fff",
        }}
        className="react-flow__handle react-flow__handle-left"
      />

      <div
        style={{
          position: "absolute",
          right: "-6px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          border: `2px solid ${config?.color || "#666"}`,
          backgroundColor: "#fff",
        }}
        className="react-flow__handle react-flow__handle-right"
      />
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
  const [nodePropertiesVisible, setNodePropertiesVisible] = useState(false);
  const [form] = Form.useForm();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Handle node connections
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        animated: true,
        style: { stroke: "#1890ff", strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      message.success("Đã kết nối nodes");
    },
    [setEdges]
  );

  // Handle drop from template palette
  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const data = event.dataTransfer.getData("application/reactflow");
      if (!data) return;

      try {
        const { template } = JSON.parse(data);
        const position = {
          x: event.clientX - reactFlowBounds.left - 125, // Center the node
          y: event.clientY - reactFlowBounds.top - 50,
        };

        const newNodeId = `node_${nodeCounter}`;
        const newNode: Node = {
          id: newNodeId,
          type: "workflowNode",
          position,
          data: {
            label: template.templateName,
            templateCode: template.templateCode,
            templateType: template.templateType,
            agentCode: template.agentCode,
            description: template.description,
            template: template,
          },
        };

        setNodes((nds) => nds.concat(newNode));
        setNodeCounter((prev) => prev + 1);
        message.success(`Đã thêm node "${template.templateName}"`);
      } catch (error) {
        message.error("Không thể thêm node");
      }
    },
    [nodeCounter, setNodes]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Fetch workflows and templates
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
        animated: true,
        style: { stroke: "#1890ff", strokeWidth: 2 },
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
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
      form.setFieldsValue(node.data);
    },
    [form]
  );

  // Delete selected node
  const deleteSelectedNode = () => {
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
  };

  // Clear all workflow
  const clearWorkflow = () => {
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
  };

  // Toggle workflow simulation
  const toggleSimulation = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Animate edges when playing
      setEdges((eds) =>
        eds.map((edge) => ({
          ...edge,
          animated: true,
          style: { ...edge.style, strokeDasharray: "5,5" },
        }))
      );
      message.info("Bắt đầu mô phỏng workflow");
    } else {
      setEdges((eds) =>
        eds.map((edge) => ({
          ...edge,
          animated: true,
          style: { ...edge.style, strokeDasharray: undefined },
        }))
      );
      message.info("Dừng mô phỏng workflow");
    }
  };

  // Group templates by type
  const groupedTemplates = templates.reduce((acc, template) => {
    const type = template.templateType || "other";
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(template);
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
            width: paletteVisible ? "300px" : "0px",
            transition: "width 0.3s ease",
            borderRight: "1px solid #d9d9d9",
            background: "#fafafa",
            overflow: "hidden",
          }}
        >
          <Card
            title={
              <Space>
                <DragOutlined />
                Template Palette
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
            <Collapse defaultActiveKey={Object.keys(groupedTemplates)} ghost>
              {Object.entries(groupedTemplates).map(([type, templateList]) => (
                <CollapsePanel
                  key={type}
                  header={
                    <Space>
                      {
                        TEMPLATE_CONFIGS[type as keyof typeof TEMPLATE_CONFIGS]
                          ?.icon
                      }
                      <Text strong>{type.toUpperCase()}</Text>
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

        {/* Main Flow Canvas */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Toolbar */}
          <Card size="small" style={{ margin: "8px", marginBottom: "4px" }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Space>
                  <Button
                    icon={<DragOutlined />}
                    onClick={() => setPaletteVisible(!paletteVisible)}
                  >
                    Template
                  </Button>
                  <Select
                    style={{ width: 250 }}
                    placeholder="Chọn workflow"
                    value={selectedWorkflow}
                    onChange={setSelectedWorkflow}
                    showSearch
                  >
                    {workflows.map((workflow) => (
                      <Option
                        key={workflow.workflowCode}
                        value={workflow.workflowCode}
                      >
                        {workflow.workflowName}
                      </Option>
                    ))}
                  </Select>
                  <Button
                    type={isPlaying ? "primary" : "default"}
                    icon={
                      isPlaying ? (
                        <PauseCircleOutlined />
                      ) : (
                        <PlayCircleOutlined />
                      )
                    }
                    onClick={toggleSimulation}
                    disabled={nodes.length === 0}
                  >
                    {isPlaying ? "Dừng" : "Chạy"}
                  </Button>
                </Space>
              </Col>
              <Col>
                <Space>
                  <Button
                    icon={<SettingOutlined />}
                    onClick={() => setNodePropertiesVisible(true)}
                    disabled={!selectedNode}
                  >
                    Thuộc tính
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={deleteSelectedNode}
                    disabled={!selectedNode}
                  >
                    Xóa Node
                  </Button>
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={clearWorkflow}
                    disabled={nodes.length === 0}
                  >
                    Xóa tất cả
                  </Button>
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
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={saveWorkflowDesign}
                    disabled={!selectedWorkflow || nodes.length === 0}
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
            style={{ flex: 1, margin: "4px 8px 8px 8px" }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              connectionMode={ConnectionMode.Loose}
              fitView
              attributionPosition="bottom-left"
              style={{
                background: "#f9f9f9",
                borderRadius: "8px",
                border: "2px dashed #d9d9d9",
              }}
            >
              <Controls />
              <MiniMap
                nodeColor={(node) => {
                  const config =
                    TEMPLATE_CONFIGS[
                      node.data?.templateType as keyof typeof TEMPLATE_CONFIGS
                    ];
                  return config?.color || "#666";
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
                      padding: "20px",
                      background: "rgba(255,255,255,0.9)",
                      borderRadius: "8px",
                      border: "2px dashed #d9d9d9",
                      textAlign: "center",
                      maxWidth: "400px",
                    }}
                  >
                    <ApartmentOutlined
                      style={{
                        fontSize: "32px",
                        color: "#d9d9d9",
                        marginBottom: "12px",
                      }}
                    />
                    <Title level={4} type="secondary">
                      Kéo thả template từ bên trái để tạo workflow
                    </Title>
                    <Text type="secondary">
                      Chọn workflow từ dropdown trên, sau đó kéo các template từ
                      palette để xây dựng flow
                    </Text>
                  </div>
                </Panel>
              )}
            </ReactFlow>
          </div>
        </div>

        {/* Node Properties Modal */}
        <Modal
          title={
            <Space>
              <EditOutlined />
              Thuộc tính Node
            </Space>
          }
          open={nodePropertiesVisible}
          onCancel={() => setNodePropertiesVisible(false)}
          onOk={() => {
            const values = form.getFieldsValue();
            if (selectedNode) {
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === selectedNode.id
                    ? { ...node, data: { ...node.data, ...values } }
                    : node
                )
              );
              message.success("Cập nhật thuộc tính node thành công");
              setNodePropertiesVisible(false);
            }
          }}
          width={600}
        >
          {selectedNode && (
            <Form form={form} layout="vertical">
              <Tabs defaultActiveKey="1">
                <TabPane tab="Thông tin cơ bản" key="1">
                  <Form.Item name="label" label="Tên Node">
                    <Input />
                  </Form.Item>
                  <Form.Item name="description" label="Mô tả">
                    <Input.TextArea rows={3} />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="templateCode" label="Template Code">
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="templateType" label="Template Type">
                        <Input disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab="Cấu hình nâng cao" key="2">
                  <Form.Item name="timeout" label="Timeout (ms)">
                    <Input type="number" placeholder="30000" />
                  </Form.Item>
                  <Form.Item name="retries" label="Số lần thử lại">
                    <Input type="number" placeholder="3" />
                  </Form.Item>
                  <Form.Item name="condition" label="Điều kiện thực thi">
                    <Input.TextArea
                      rows={2}
                      placeholder="Nhập điều kiện logic"
                    />
                  </Form.Item>
                </TabPane>
              </Tabs>
            </Form>
          )}
        </Modal>
      </div>
    </ReactFlowProvider>
  );
};

export default WorkflowBuilderPage;
