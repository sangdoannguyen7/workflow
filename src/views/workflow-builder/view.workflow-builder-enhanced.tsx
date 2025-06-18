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
  Collapse,
  Modal,
  Form,
  Input,
  Badge,
  Tooltip,
  Spin,
} from "antd";
import {
  ApartmentOutlined,
  ApiOutlined,
  ScheduleOutlined,
  LinkOutlined,
  DragOutlined,
  SaveOutlined,
  ReloadOutlined,
  DeleteOutlined,
  PlusOutlined,
  SettingOutlined,
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
  ReactFlowInstance,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { ITemplate } from "../../interface/template.interface";
import {
  IWorkflow,
  IWorkflowRequest,
} from "../../interface/workflow.interface";
import templateApi from "../../apis/template/api.template";
import workflowApi from "../../apis/workflow/api.workflow";

const { Text, Title } = Typography;
const { Panel: CollapsePanel } = Collapse;
const { Option } = Select;

// Template type configurations
const TEMPLATE_CONFIGS = {
  webhook: {
    icon: <LinkOutlined />,
    color: "#52c41a",
    bgColor: "#f6ffed",
    borderColor: "#b7eb8f",
    type: "webhook",
  },
  schedule: {
    icon: <ScheduleOutlined />,
    color: "#1890ff",
    bgColor: "#e6f7ff",
    borderColor: "#91d5ff",
    type: "schedule",
  },
  restapi: {
    icon: <ApiOutlined />,
    color: "#fa8c16",
    bgColor: "#fff7e6",
    borderColor: "#ffd591",
    type: "restapi",
  },
  process: {
    icon: <SettingOutlined />,
    color: "#722ed1",
    bgColor: "#f9f0ff",
    borderColor: "#d3adf7",
    type: "process",
  },
};

// Get template type from template
const getTemplateType = (template: ITemplate): string => {
  // First check typeCode field
  if (template.typeCode) {
    return template.typeCode.toLowerCase();
  }

  // Fallback to code/name analysis
  const code = template.templateCode.toLowerCase();
  const name = template.templateName.toLowerCase();

  if (code.includes("webhook") || name.includes("webhook")) return "webhook";
  if (code.includes("schedule") || name.includes("schedule")) return "schedule";
  if (code.includes("api") || name.includes("api")) return "restapi";
  if (code.includes("process") || name.includes("process")) return "process";

  return "restapi"; // default
};

// Draggable Template Component
const DraggableTemplate: React.FC<{ template: ITemplate }> = ({ template }) => {
  const templateType = getTemplateType(template);
  const config =
    TEMPLATE_CONFIGS[templateType as keyof typeof TEMPLATE_CONFIGS] ||
    TEMPLATE_CONFIGS.restapi;

  const onDragStart = (
    event: DragEvent<HTMLDivElement>,
    template: ITemplate
  ) => {
    const templateData = {
      ...template,
      templateType: templateType,
    };

    console.log("Dragging template:", templateData);

    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({
        type: "template",
        template: templateData,
      })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={(event) => onDragStart(event, template)}
      style={{
        border: `2px solid ${config.borderColor}`,
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "8px",
        cursor: "grab",
        backgroundColor: config.bgColor,
        transition: "all 0.2s ease",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 4px 12px ${config.color}30`;
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
            color: config.color,
            marginRight: "8px",
            fontSize: "16px",
          }}
        >
          {config.icon}
        </div>
        <Text strong style={{ color: config.color, fontSize: "13px" }}>
          {template.templateName}
        </Text>
      </div>
      <Text type="secondary" style={{ fontSize: "11px", display: "block" }}>
        {template.templateCode}
      </Text>
      <Text style={{ fontSize: "10px", color: "#999", lineHeight: "1.2" }}>
        {template.description || "No description"}
      </Text>
      <div style={{ marginTop: "6px" }}>
        <Tag color={config.color} size="small">
          {templateType.toUpperCase()}
        </Tag>
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
    TEMPLATE_CONFIGS.restapi;

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: config.color,
          width: "10px",
          height: "10px",
          border: "2px solid #fff",
        }}
      />

      <div
        style={{
          padding: "12px 16px",
          border: selected
            ? `3px solid ${config.color}`
            : `2px solid ${config.borderColor}`,
          borderRadius: "8px",
          background: "#fff",
          minWidth: "180px",
          maxWidth: "220px",
          boxShadow: selected
            ? `0 4px 12px ${config.color}40`
            : "0 2px 8px rgba(0,0,0,0.1)",
          position: "relative",
          transition: "all 0.2s ease",
          cursor: "pointer",
        }}
      >
        {/* Type Badge */}
        <div
          style={{
            position: "absolute",
            top: "-8px",
            right: "-8px",
            background: config.color,
            color: "white",
            borderRadius: "12px",
            padding: "2px 6px",
            fontSize: "9px",
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
            marginBottom: "6px",
          }}
        >
          <div
            style={{
              color: config.color,
              marginRight: "6px",
              fontSize: "14px",
            }}
          >
            {config.icon}
          </div>
          <Text
            strong
            style={{
              fontSize: "12px",
              color: config.color,
              lineHeight: "1.2",
            }}
          >
            {data.label}
          </Text>
        </div>

        {/* Node Content */}
        <Text
          type="secondary"
          style={{
            fontSize: "10px",
            display: "block",
            marginBottom: "4px",
          }}
        >
          {data.templateCode}
        </Text>

        {data.description && (
          <Text
            style={{
              fontSize: "9px",
              color: "#999",
              display: "block",
              lineHeight: "1.2",
            }}
          >
            {data.description.length > 60
              ? `${data.description.substring(0, 60)}...`
              : data.description}
          </Text>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: config.color,
          width: "10px",
          height: "10px",
          border: "2px solid #fff",
        }}
      />
    </>
  );
};

const nodeTypes = {
  workflowNode: WorkflowNode,
};

const WorkflowBuilderEnhanced: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflows, setWorkflows] = useState<IWorkflow[]>([]);
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("");
  const [paletteVisible, setPaletteVisible] = useState(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeCounter, setNodeCounter] = useState(1);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Handle node connections
  const onConnect = useCallback(
    (params: Connection) => {
      console.log("Connecting nodes:", params);
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        animated: true,
        style: {
          stroke: "#1890ff",
          strokeWidth: 2,
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      message.success("Connected nodes successfully");
    },
    [setEdges]
  );

  // Handle drop from template palette
  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      console.log("Drop event triggered");

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds || !reactFlowInstance) {
        console.log("Missing bounds or flow instance");
        return;
      }

      const data = event.dataTransfer.getData("application/reactflow");
      if (!data) {
        console.log("No drag data found");
        return;
      }

      try {
        const { template } = JSON.parse(data);
        console.log("Dropped template:", template);

        // Convert screen coordinates to flow coordinates
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const newNodeId = `node_${nodeCounter}`;
        const newNode: Node = {
          id: newNodeId,
          type: "workflowNode",
          position: {
            x: position.x - 90, // Center the node
            y: position.y - 30,
          },
          data: {
            label: template.templateName,
            templateCode: template.templateCode,
            templateType: getTemplateType(template),
            agentCode: template.agentCode,
            description: template.description,
            template: template,
            // Store additional properties in info field
            info: JSON.stringify({
              timeout: 30000,
              retries: 3,
              priority: "normal",
              properties: {},
              metadata: template.metadata || "",
              schema: template.schema || "",
              body: template.body || "",
              rule: template.rule || "",
              configuration: template.configuration || "",
            }),
          },
        };

        console.log("Creating new node:", newNode);
        setNodes((nds) => nds.concat(newNode));
        setNodeCounter((prev) => prev + 1);
        message.success(`Added node "${template.templateName}"`);
      } catch (error) {
        console.error("Drop error:", error);
        message.error("Failed to add node");
      }
    },
    [nodeCounter, setNodes, reactFlowInstance]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Fetch data
  const fetchWorkflows = async () => {
    try {
      console.log("Fetching workflows...");
      const response = await workflowApi.getWorkflows({ pageSize: 100 });
      console.log("Workflows response:", response);

      if (response.success && response.data) {
        setWorkflows(response.data);
      } else {
        console.warn("Invalid workflows response:", response);
        setWorkflows([]);
      }
    } catch (error) {
      console.error("Error fetching workflows:", error);
      message.error("Failed to load workflows");
      setWorkflows([]);
    }
  };

  const fetchTemplates = async () => {
    try {
      console.log("Fetching templates...");
      const response = await templateApi.getTemplates({ pageSize: 100 });
      console.log("Templates response:", response);

      if (response.success && response.data) {
        setTemplates(response.data);
      } else {
        console.warn("Invalid templates response:", response);
        setTemplates([]);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      message.error("Failed to load templates");
      setTemplates([]);
    }
  };

  // Save workflow
  const saveWorkflow = async () => {
    if (!selectedWorkflow) {
      message.error("Please select a workflow");
      return;
    }

    if (nodes.length === 0) {
      message.error("Please add some nodes to the workflow");
      return;
    }

    setLoading(true);
    try {
      console.log("Saving workflow:", selectedWorkflow);
      console.log("Current nodes:", nodes);
      console.log("Current edges:", edges);

      // Convert nodes to workflow format
      const workflowNodes = nodes.map((node) => ({
        nodeCode: node.id,
        nodeName: node.data.label,
        templateCode: node.data.templateCode,
        templateName: node.data.template?.templateName || node.data.label,
        typeCode: node.data.templateType || "restapi",
        typeName: node.data.templateType || "restapi",
        agentCode: node.data.agentCode,
        agentName: node.data.template?.agentName || "Default Agent",
        description: node.data.description || "",
        search: `${node.data.label} ${node.data.templateCode}`.toLowerCase(),
        metadata: JSON.stringify({
          position: node.position,
          nodeType: node.data.templateType,
          originalTemplate: node.data.template,
        }),
        info:
          node.data.info ||
          JSON.stringify({
            timeout: 30000,
            retries: 3,
            priority: "normal",
          }),
        schema: node.data.template?.schema || "",
        body: node.data.template?.body || "",
        rule: JSON.stringify({
          edges: edges.filter(
            (e) => e.source === node.id || e.target === node.id
          ),
          nodeConnections: {
            inputs: edges
              .filter((e) => e.target === node.id)
              .map((e) => e.source),
            outputs: edges
              .filter((e) => e.source === node.id)
              .map((e) => e.target),
          },
        }),
        configuration: node.data.template?.configuration || "",
        outputCode: node.data.template?.outputCode || "",
      }));

      const workflow = workflows.find(
        (w) => w.workflowCode === selectedWorkflow
      );
      if (workflow) {
        const workflowRequest: IWorkflowRequest = {
          workflowName: workflow.workflowName,
          statusCode: workflow.statusCode,
          statusName: workflow.statusName,
          description: workflow.description || "",
          nodes: workflowNodes,
        };

        console.log("Workflow request:", workflowRequest);
        await workflowApi.updateWorkflow(selectedWorkflow, workflowRequest);
        message.success("Workflow saved successfully");
      }
    } catch (error) {
      console.error("Save error:", error);
      message.error("Failed to save workflow");
    } finally {
      setLoading(false);
    }
  };

  // Load workflow
  const loadWorkflow = async (workflowCode: string) => {
    if (!workflowCode) return;

    setLoading(true);
    try {
      console.log("Loading workflow:", workflowCode);
      const workflow = await workflowApi.getWorkflowByCode(workflowCode);
      console.log("Loaded workflow:", workflow);

      if (workflow.nodes && workflow.nodes.length > 0) {
        const flowNodes: Node[] = workflow.nodes.map((node, index) => {
          let position = {
            x: 100 + (index % 3) * 250,
            y: 100 + Math.floor(index / 3) * 150,
          };

          // Try to parse position from metadata
          try {
            if (node.metadata) {
              const metadata = JSON.parse(node.metadata);
              if (metadata.position) {
                position = metadata.position;
              }
            }
          } catch (e) {
            console.warn("Failed to parse node metadata:", e);
          }

          return {
            id: node.nodeCode,
            type: "workflowNode",
            position,
            data: {
              label: node.nodeName,
              templateCode: node.templateCode,
              templateType: node.typeCode || "restapi",
              agentCode: node.agentCode,
              description: node.description,
              info: node.info || JSON.stringify({}),
            },
          };
        });

        // Try to restore edges from rule field
        const flowEdges: Edge[] = [];
        workflow.nodes.forEach((node) => {
          try {
            if (node.rule) {
              const rule = JSON.parse(node.rule);
              if (rule.edges) {
                rule.edges.forEach((edge: any) => {
                  if (edge.source && edge.target) {
                    flowEdges.push({
                      id: edge.id || `edge-${edge.source}-${edge.target}`,
                      source: edge.source,
                      target: edge.target,
                      animated: true,
                      style: { stroke: "#1890ff", strokeWidth: 2 },
                    });
                  }
                });
              }
            }
          } catch (e) {
            console.warn("Failed to parse node rule:", e);
          }
        });

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

        message.success("Workflow loaded successfully");
      } else {
        setNodes([]);
        setEdges([]);
        setNodeCounter(1);
        message.info("Empty workflow loaded");
      }
    } catch (error) {
      console.error("Load error:", error);
      message.error("Failed to load workflow");
      setNodes([]);
      setEdges([]);
      setNodeCounter(1);
    } finally {
      setLoading(false);
    }
  };

  // Node click handler
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

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
      message.success("Node deleted");
    }
  };

  // Clear workflow
  const clearWorkflow = () => {
    Modal.confirm({
      title: "Clear workflow?",
      content: "This will remove all nodes and connections.",
      onOk: () => {
        setNodes([]);
        setEdges([]);
        setSelectedNode(null);
        setNodeCounter(1);
        message.success("Workflow cleared");
      },
    });
  };

  // Create new workflow
  const createNewWorkflow = async (values: any) => {
    try {
      const workflowRequest: IWorkflowRequest = {
        workflowName: values.workflowName,
        statusCode: "ACTIVE",
        statusName: "Active",
        description: values.description || "",
        nodes: [],
      };

      const newWorkflow = await workflowApi.createWorkflow(workflowRequest);
      await fetchWorkflows();
      setSelectedWorkflow(newWorkflow.workflowCode);
      setModalVisible(false);
      form.resetFields();
      message.success("New workflow created");
    } catch (error) {
      console.error("Create error:", error);
      message.error("Failed to create workflow");
    }
  };

  // Group templates by type
  const groupedTemplates = templates.reduce((acc, template) => {
    const type = getTemplateType(template);
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
      loadWorkflow(selectedWorkflow);
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
        {paletteVisible && (
          <div
            style={{
              width: "300px",
              borderRight: "1px solid #d9d9d9",
              background: "#fafafa",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Card
              title={
                <Space>
                  <DragOutlined />
                  Templates
                  <Badge count={templates.length} />
                </Space>
              }
              size="small"
              style={{ border: "none", flex: 1 }}
              bodyStyle={{
                padding: "12px",
                height: "calc(100% - 57px)",
                overflow: "auto",
              }}
            >
              <div style={{ marginBottom: "12px" }}>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Drag templates to canvas to create nodes
                </Text>
              </div>

              <Spin spinning={loading}>
                {Object.keys(groupedTemplates).length > 0 ? (
                  <Collapse
                    defaultActiveKey={Object.keys(groupedTemplates)}
                    ghost
                    size="small"
                  >
                    {Object.entries(groupedTemplates).map(
                      ([type, templateList]) => {
                        const config =
                          TEMPLATE_CONFIGS[
                            type as keyof typeof TEMPLATE_CONFIGS
                          ] || TEMPLATE_CONFIGS.restapi;
                        return (
                          <CollapsePanel
                            key={type}
                            header={
                              <Space>
                                {config.icon}
                                <Text strong style={{ fontSize: "12px" }}>
                                  {type.toUpperCase()}
                                </Text>
                                <Badge
                                  count={templateList.length}
                                  size="small"
                                />
                              </Space>
                            }
                          >
                            {templateList.map((template) => (
                              <DraggableTemplate
                                key={template.templateCode}
                                template={template}
                              />
                            ))}
                          </CollapsePanel>
                        );
                      }
                    )}
                  </Collapse>
                ) : (
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <Text type="secondary">No templates available</Text>
                  </div>
                )}
              </Spin>
            </Card>
          </div>
        )}

        {/* Main Canvas Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Toolbar */}
          <Card size="small" style={{ margin: "8px", marginBottom: "4px" }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Space>
                  <Button
                    icon={<DragOutlined />}
                    onClick={() => setPaletteVisible(!paletteVisible)}
                    type={paletteVisible ? "primary" : "default"}
                    size="small"
                  >
                    Templates
                  </Button>
                  <Select
                    style={{ width: 250 }}
                    placeholder="Select workflow"
                    value={selectedWorkflow}
                    onChange={setSelectedWorkflow}
                    showSearch
                    size="small"
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
                    icon={<PlusOutlined />}
                    onClick={() => setModalVisible(true)}
                    size="small"
                  >
                    New Workflow
                  </Button>
                </Space>
              </Col>
              <Col>
                <Space>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    Nodes: {nodes.length} | Edges: {edges.length}
                  </Text>
                  {selectedNode && (
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={deleteSelectedNode}
                      size="small"
                    >
                      Delete Node
                    </Button>
                  )}
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={clearWorkflow}
                    disabled={nodes.length === 0}
                    size="small"
                  >
                    Clear
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() =>
                      selectedWorkflow && loadWorkflow(selectedWorkflow)
                    }
                    disabled={!selectedWorkflow}
                    size="small"
                  >
                    Reload
                  </Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={saveWorkflow}
                    disabled={!selectedWorkflow || nodes.length === 0}
                    loading={loading}
                    size="small"
                  >
                    Save
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
              onInit={setReactFlowInstance}
              nodeTypes={nodeTypes}
              connectionMode={ConnectionMode.Loose}
              fitView
              style={{
                background: "#fafafa",
                borderRadius: "6px",
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
                      background: "rgba(255,255,255,0.95)",
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
                      Drag templates here to create workflow
                    </Title>
                    <Text type="secondary">
                      Select a workflow and drag templates from the sidebar to
                      build your flow
                    </Text>
                  </div>
                </Panel>
              )}
            </ReactFlow>
          </div>
        </div>

        {/* Node Properties Panel */}
        {selectedNode && (
          <div
            style={{
              position: "absolute",
              top: "80px",
              right: "20px",
              width: "300px",
              zIndex: 1000,
            }}
          >
            <Card
              title={
                <Space>
                  <SettingOutlined />
                  Node Properties
                </Space>
              }
              size="small"
              extra={
                <Button
                  type="text"
                  size="small"
                  onClick={() => setSelectedNode(null)}
                >
                  ×
                </Button>
              }
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <Text strong>Name:</Text>{" "}
                  <Text>{selectedNode.data.label}</Text>
                </div>
                <div>
                  <Text strong>Template:</Text>{" "}
                  <Text>{selectedNode.data.templateCode}</Text>
                </div>
                <div>
                  <Text strong>Type:</Text>
                  <Tag
                    color={
                      TEMPLATE_CONFIGS[
                        selectedNode.data
                          .templateType as keyof typeof TEMPLATE_CONFIGS
                      ]?.color || "default"
                    }
                  >
                    {selectedNode.data.templateType?.toUpperCase()}
                  </Tag>
                </div>
                <div>
                  <Text strong>Agent:</Text>{" "}
                  <Text>{selectedNode.data.agentCode}</Text>
                </div>
                {selectedNode.data.description && (
                  <div>
                    <Text strong>Description:</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {selectedNode.data.description}
                    </Text>
                  </div>
                )}
              </Space>
            </Card>
          </div>
        )}
      </div>

      {/* New Workflow Modal */}
      <Modal
        title="Create New Workflow"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={createNewWorkflow}>
          <Form.Item
            name="workflowName"
            label="Workflow Name"
            rules={[{ required: true, message: "Please enter workflow name" }]}
          >
            <Input placeholder="Enter workflow name" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Enter workflow description" />
          </Form.Item>
        </Form>
      </Modal>
    </ReactFlowProvider>
  );
};

export default WorkflowBuilderEnhanced;
