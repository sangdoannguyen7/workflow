import React, { useState, useEffect, useCallback } from "react";
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
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { ITemplate } from "../../interface/template.interface";
import { IWorkflow } from "../../interface/workflow.interface";
import { IWorkflowDesign } from "../../interface/workflow.interface";

import templateApi from "../../apis/template/api.template";
import workflowApi from "../../apis/workflow/api.workflow";

const { Option } = Select;
const { Text, Title } = Typography;

// Template type icons
const getTemplateIcon = (templateType: string) => {
  switch (templateType) {
    case "webhook":
      return <LinkOutlined style={{ color: "#52c41a" }} />;
    case "schedule":
      return <ScheduleOutlined style={{ color: "#1890ff" }} />;
    case "restapi":
      return <ApiOutlined style={{ color: "#fa8c16" }} />;
    default:
      return <ApartmentOutlined />;
  }
};

// Template type colors
const getTemplateColor = (templateType: string) => {
  switch (templateType) {
    case "webhook":
      return "#52c41a";
    case "schedule":
      return "#1890ff";
    case "restapi":
      return "#fa8c16";
    default:
      return "#666";
  }
};

// Custom Node Component
const CustomFlowNode = ({ data, selected }: any) => {
  const templateColor = getTemplateColor(data.templateType || "default");

  return (
    <div
      style={{
        padding: "12px",
        border: selected
          ? `2px solid ${templateColor}`
          : `1px solid ${templateColor}`,
        borderRadius: "8px",
        background: "#fff",
        minWidth: "180px",
        maxWidth: "200px",
        boxShadow: selected
          ? `0 4px 12px ${templateColor}40`
          : "0 2px 8px rgba(0,0,0,0.1)",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "6px",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        {getTemplateIcon(data.templateType)}
        <span style={{ marginLeft: "6px", color: templateColor }}>
          {data.label}
        </span>
      </div>

      {data.templateCode && (
        <div style={{ fontSize: "11px", color: "#666", marginBottom: "4px" }}>
          Template: {data.templateCode}
        </div>
      )}

      {data.description && (
        <div
          style={{
            fontSize: "10px",
            color: "#999",
            lineHeight: "1.3",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {data.description}
        </div>
      )}

      <Badge
        count={data.templateType?.toUpperCase()}
        style={{
          backgroundColor: templateColor,
          position: "absolute",
          top: "-8px",
          right: "-8px",
          fontSize: "10px",
        }}
      />
    </div>
  );
};

const nodeTypes = {
  custom: CustomFlowNode,
};

const NodeFlowPage: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflows, setWorkflows] = useState<IWorkflow[]>([]);
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [loading, setLoading] = useState(false);
  const [nodeCounter, setNodeCounter] = useState(1);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Fetch data functions
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

  const loadWorkflowDesign = async (code: string) => {
    if (!code) return;

    setLoading(true);
    try {
      const design = await workflowApi.getWorkflowDesign(code);

      const flowNodes: Node[] = design.nodes.map((node) => ({
        id: node.id,
        type: "custom",
        position: node.position,
        data: node.data,
      }));

      const flowEdges: Edge[] = design.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type || "default",
        animated: true,
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);

      // Update counter based on existing nodes
      const maxNumber = Math.max(
        0,
        ...flowNodes.map((node) => {
          const match = node.id.match(/node_(\d+)/);
          return match ? parseInt(match[1]) : 0;
        })
      );
      setNodeCounter(maxNumber + 1);

      message.success("Tải thiết kế workflow thành công");
    } catch (error) {
      message.info("Khởi tạo workflow mới");
      setNodes([]);
      setEdges([]);
      setNodeCounter(1);
    } finally {
      setLoading(false);
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
      message.success("Lưu thiết kế workflow thành công");
    } catch (error) {
      message.error("Không thể lưu thiết kế workflow");
    }
  };

  const addTemplateToFlow = (template: ITemplate) => {
    const newNodeId = `node_${nodeCounter}`;
    const newNode: Node = {
      id: newNodeId,
      type: "custom",
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
      },
      data: {
        label: template.templateName,
        templateCode: template.templateCode,
        templateType: template.templateType,
        agentCode: template.agentCode,
        description: template.description,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeCounter((prev) => prev + 1);
    message.success(`Đã thêm template "${template.templateName}" vào flow`);
  };

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
      message.success("Đã xóa node khỏi flow");
    }
  };

  const clearFlow = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setNodeCounter(1);
    message.success("Đã xóa toàn bộ flow");
  };

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

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
          padding: "24px",
          background: colorBgContainer,
        }}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
          <Col span={24}>
            <Card
              title={
                <Space>
                  <ApartmentOutlined />
                  Quản lý Node Flow
                </Space>
              }
              extra={
                <Space>
                  <Select
                    style={{ width: 300 }}
                    placeholder="Chọn workflow để thiết kế"
                    value={selectedWorkflow}
                    onChange={setSelectedWorkflow}
                    showSearch
                  >
                    {workflows.map((workflow) => (
                      <Option
                        key={workflow.workflowCode}
                        value={workflow.workflowCode}
                      >
                        {workflow.workflowName} ({workflow.workflowCode})
                      </Option>
                    ))}
                  </Select>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => setDrawerVisible(true)}
                    disabled={!selectedWorkflow}
                  >
                    Thêm Template
                  </Button>
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    onClick={deleteSelectedNode}
                    disabled={!selectedNode}
                  >
                    Xóa Node
                  </Button>
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={clearFlow}
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
                    disabled={!selectedWorkflow}
                  >
                    Lưu Flow
                  </Button>
                </Space>
              }
            />
          </Col>
        </Row>

        <Row gutter={[16, 0]} style={{ height: "calc(100vh - 180px)" }}>
          <Col span={24}>
            <Card style={{ height: "100%" }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-left"
              >
                <Controls />
                <MiniMap
                  nodeColor={(node) =>
                    getTemplateColor(node.data?.templateType || "default")
                  }
                />
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={12}
                  size={1}
                />
              </ReactFlow>
            </Card>
          </Col>
        </Row>

        {selectedNode && (
          <Card
            style={{
              position: "absolute",
              top: "120px",
              right: "24px",
              width: "320px",
              zIndex: 1000,
            }}
            title={
              <Space>
                {getTemplateIcon(selectedNode.data.templateType)}
                Chi tiết Node
              </Space>
            }
            extra={
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                onClick={() => setSelectedNode(null)}
              />
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
                <Tag color={getTemplateColor(selectedNode.data.templateType)}>
                  {selectedNode.data.templateType?.toUpperCase()}
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
            </Space>
          </Card>
        )}

        <Drawer
          title={
            <Space>
              <DragOutlined />
              Templates - Kéo thả để thêm vào Flow
            </Space>
          }
          placement="right"
          width={500}
          open={drawerVisible}
          onClose={() => setDrawerVisible(false)}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text type="secondary">
              Chọn template từ danh sách bên dưới để thêm vào workflow. Các
              template được phân loại theo loại: Webhook, Schedule, REST API.
            </Text>

            {Object.entries(groupedTemplates).map(([type, templateList]) => (
              <div key={type}>
                <Title level={5} style={{ marginBottom: "12px" }}>
                  <Space>
                    {getTemplateIcon(type)}
                    {type.toUpperCase()} Templates ({templateList.length})
                  </Space>
                </Title>

                <List
                  dataSource={templateList}
                  renderItem={(template) => (
                    <List.Item
                      style={{
                        border: `1px solid ${getTemplateColor(
                          template.templateType
                        )}20`,
                        borderRadius: "6px",
                        marginBottom: "8px",
                        padding: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onClick={() => addTemplateToFlow(template)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = getTemplateColor(
                          template.templateType
                        );
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow = `0 4px 12px ${getTemplateColor(
                          template.templateType
                        )}20`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = `${getTemplateColor(
                          template.templateType
                        )}20`;
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <List.Item.Meta
                        avatar={
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "6px",
                              background: `${getTemplateColor(
                                template.templateType
                              )}15`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "18px",
                            }}
                          >
                            {getTemplateIcon(template.templateType)}
                          </div>
                        }
                        title={
                          <Space>
                            <Text strong>{template.templateName}</Text>
                            <Tag
                              size="small"
                              color={
                                template.statusCode === "ACTIVE"
                                  ? "green"
                                  : "orange"
                              }
                            >
                              {template.statusName}
                            </Tag>
                          </Space>
                        }
                        description={
                          <Space direction="vertical" size={4}>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {template.templateCode} • Agent:{" "}
                              {template.agentName}
                            </Text>
                            <Text style={{ fontSize: "12px" }}>
                              {template.description}
                            </Text>
                          </Space>
                        }
                      />
                      <Tooltip title="Click để thêm vào flow">
                        <Button
                          type="primary"
                          size="small"
                          icon={<PlusOutlined />}
                          style={{
                            backgroundColor: getTemplateColor(
                              template.templateType
                            ),
                            borderColor: getTemplateColor(
                              template.templateType
                            ),
                          }}
                        >
                          Thêm
                        </Button>
                      </Tooltip>
                    </List.Item>
                  )}
                />
                {type !== Object.keys(groupedTemplates).pop() && <Divider />}
              </div>
            ))}
          </Space>
        </Drawer>
      </div>
    </ReactFlowProvider>
  );
};

export default NodeFlowPage;
