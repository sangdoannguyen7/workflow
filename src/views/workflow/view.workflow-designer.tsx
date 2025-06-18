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
  theme,
  Typography,
  Collapse,
  List,
  Tag,
} from "antd";
import {
  SaveOutlined,
  ReloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  ApartmentOutlined,
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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useParams } from "react-router-dom";

import { IWorkflow } from "../../interface/workflow.interface";
import { INode } from "../../interface/node.interface";
import { ITemplate } from "../../interface/template.interface";
import { IAgent } from "../../interface/agent.interface";
import { IWorkflowDesign } from "../../interface/workflow.interface";

import workflowApi from "../../apis/workflow/api.workflow";
import nodeApi from "../../apis/node/api.node";
import templateApi from "../../apis/template/api.template";
import agentApi from "../../apis/agent/api.agent";

const { Option } = Select;
const { Text } = Typography;
const { Panel } = Collapse;

// Custom Node Components
const CustomNode = ({ data, selected }: any) => {
  return (
    <div
      style={{
        padding: "12px",
        border: selected ? "2px solid #1890ff" : "1px solid #d9d9d9",
        borderRadius: "8px",
        background: "#fff",
        minWidth: "150px",
        boxShadow: selected
          ? "0 4px 12px rgba(24,144,255,0.3)"
          : "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
        {data.label}
      </div>
      {data.nodeCode && (
        <div style={{ fontSize: "12px", color: "#666" }}>
          Code: {data.nodeCode}
        </div>
      )}
      {data.templateCode && (
        <div style={{ fontSize: "12px", color: "#666" }}>
          Template: {data.templateCode}
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const WorkflowDesignerPage: React.FC = () => {
  const { workflowCode } = useParams<{ workflowCode?: string }>();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflows, setWorkflows] = useState<IWorkflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("");
  const [availableNodes, setAvailableNodes] = useState<INode[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [loading, setLoading] = useState(false);

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
      if (
        workflowCode &&
        response.content.find((w) => w.workflowCode === workflowCode)
      ) {
        setSelectedWorkflow(workflowCode);
      }
    } catch (error) {
      message.error("Không thể tải danh sách workflow");
    }
  };

  const fetchReferenceData = async () => {
    try {
      const nodesRes = await nodeApi.getNodes({ size: 1000 });
      setAvailableNodes(nodesRes.content);
    } catch (error) {
      message.error("Không thể tải dữ liệu tham chiếu");
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
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);

      message.success("Tải thiết kế workflow thành công");
    } catch (error) {
      message.info("Khởi tạo workflow mới");
      setNodes([]);
      setEdges([]);
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

  const addNodeToFlow = (nodeData: INode) => {
    const newNode: Node = {
      id: `node_${Date.now()}`,
      type: "custom",
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      data: {
        label: nodeData.nodeName,
        nodeCode: nodeData.nodeCode,
        templateCode: nodeData.templateCode,
        agentCode: nodeData.agentCode,
        description: nodeData.description,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setDrawerVisible(false);
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
    }
  };

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  useEffect(() => {
    fetchWorkflows();
    fetchReferenceData();
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
                  Thiết kế Workflow
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
                    Thêm Node
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
                    Lưu thiết kế
                  </Button>
                </Space>
              }
            />
          </Col>
        </Row>

        <Card style={{ height: "calc(100vh - 200px)" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </Card>

        {selectedNode && (
          <Card
            style={{
              position: "absolute",
              top: "100px",
              right: "24px",
              width: "300px",
              zIndex: 1000,
            }}
            title="Chi tiết Node"
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
              <Text strong>Tên: {selectedNode.data.label}</Text>
              <Text>Code: {selectedNode.data.nodeCode}</Text>
              <Text>Template: {selectedNode.data.templateCode}</Text>
              <Text>Agent: {selectedNode.data.agentCode}</Text>
              {selectedNode.data.description && (
                <Text>Mô tả: {selectedNode.data.description}</Text>
              )}
            </Space>
          </Card>
        )}

        <Drawer
          title="Thêm Node vào Workflow"
          placement="right"
          width={500}
          open={drawerVisible}
          onClose={() => setDrawerVisible(false)}
        >
          <Collapse defaultActiveKey={["available"]}>
            <Panel header="Node có sẵn" key="available">
              <List
                dataSource={availableNodes.filter(
                  (node) => node.workflowCode === selectedWorkflow
                )}
                renderItem={(node) => (
                  <List.Item
                    actions={[
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => addNodeToFlow(node)}
                      >
                        Thêm
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={node.nodeName}
                      description={
                        <Space direction="vertical" size={4}>
                          <Text type="secondary">{node.nodeCode}</Text>
                          <Text>Template: {node.templateName}</Text>
                          <Text>Agent: {node.agentName}</Text>
                          <Tag color="blue">{node.statusName}</Tag>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Panel>
          </Collapse>
        </Drawer>
      </div>
    </ReactFlowProvider>
  );
};

export default WorkflowDesignerPage;
