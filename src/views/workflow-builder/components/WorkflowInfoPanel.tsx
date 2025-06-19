import React from "react";
import {
  Card,
  Descriptions,
  Row,
  Col,
  Statistic,
  Typography,
  Tag,
  Space,
} from "antd";
import {
  InfoCircleOutlined,
  LinkOutlined,
  ApiOutlined,
  ScheduleOutlined,
  NodeIndexOutlined,
  ApartmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Node, Edge } from "@xyflow/react";
import { IWorkflow } from "../../../interface/workflow.interface";
import {
  NodeType,
  getNodeTypeFromTemplate,
} from "../../../types/workflow-nodes.types";

const { Text } = Typography;

interface WorkflowInfoPanelProps {
  currentWorkflow: IWorkflow | undefined;
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
}

const WorkflowInfoPanel: React.FC<WorkflowInfoPanelProps> = ({
  currentWorkflow,
  nodes,
  edges,
  selectedNode,
}) => {
  // Calculate node statistics
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
    <Card
      className="workflow-info-panel"
      size="small"
      style={{
        margin: "0 12px 12px 12px",
        borderRadius: "16px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        border: "1px solid #e8e8e8",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(8px)",
      }}
      title={
        <Space>
          <InfoCircleOutlined style={{ color: "#1890ff" }} />
          <span style={{ fontWeight: 600 }}>Workflow Information</span>
          {currentWorkflow && (
            <Tag color="blue" style={{ borderRadius: "8px" }}>
              {currentWorkflow.statusName || "ACTIVE"}
            </Tag>
          )}
        </Space>
      }
      bodyStyle={{ padding: "20px 24px" }}
    >
      <Row gutter={[24, 16]}>
        {/* Workflow Details */}
        <Col xs={24} md={10}>
          <div className="workflow-details">
            <Descriptions
              size="small"
              column={1}
              bordered
              style={{
                background: "#fafafa",
                borderRadius: "12px",
              }}
              labelStyle={{
                background: "#f5f5f5",
                fontWeight: 600,
                width: "120px",
              }}
              contentStyle={{
                background: "#fff",
              }}
            >
              <Descriptions.Item label="Workflow Name">
                <Text strong style={{ color: "#1890ff" }}>
                  {currentWorkflow?.workflowName || "No workflow selected"}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Code">
                <Text
                  code
                  style={{
                    background: "#f5f5f5",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  {currentWorkflow?.workflowCode || "N/A"}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                <Text style={{ fontSize: "13px" }}>
                  {currentWorkflow?.description || "No description available"}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    currentWorkflow?.statusCode === "ACTIVE"
                      ? "green"
                      : "orange"
                  }
                  style={{ borderRadius: "6px" }}
                >
                  {currentWorkflow?.statusName ||
                    currentWorkflow?.statusCode ||
                    "UNKNOWN"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Col>

        {/* Node Statistics */}
        <Col xs={24} md={8}>
          <div className="node-statistics">
            <div
              style={{
                background: "linear-gradient(135deg, #f0f9ff, #e6f7ff)",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid #91d5ff",
              }}
            >
              <Text
                strong
                style={{
                  display: "block",
                  marginBottom: "12px",
                  color: "#1890ff",
                }}
              >
                Node Statistics
              </Text>
              <Row gutter={[8, 12]}>
                <Col span={8}>
                  <Statistic
                    title={
                      <Space size={4}>
                        <LinkOutlined style={{ color: "#52c41a" }} />
                        <span style={{ fontSize: "12px" }}>Triggers</span>
                      </Space>
                    }
                    value={triggerNodes.length}
                    valueStyle={{
                      color: "#52c41a",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title={
                      <Space size={4}>
                        <ApiOutlined style={{ color: "#1890ff" }} />
                        <span style={{ fontSize: "12px" }}>Behaviors</span>
                      </Space>
                    }
                    value={behaviorNodes.length}
                    valueStyle={{
                      color: "#1890ff",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title={
                      <Space size={4}>
                        <ScheduleOutlined style={{ color: "#fa8c16" }} />
                        <span style={{ fontSize: "12px" }}>Outputs</span>
                      </Space>
                    }
                    value={outputNodes.length}
                    valueStyle={{
                      color: "#fa8c16",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  />
                </Col>
              </Row>
            </div>
          </div>
        </Col>

        {/* Workflow Metrics */}
        <Col xs={24} md={6}>
          <div className="workflow-metrics">
            <div
              style={{
                background: "linear-gradient(135deg, #fff7e6, #fff2e8)",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid #ffd591",
              }}
            >
              <Text
                strong
                style={{
                  display: "block",
                  marginBottom: "12px",
                  color: "#fa8c16",
                }}
              >
                Workflow Metrics
              </Text>
              <Row gutter={[8, 12]}>
                <Col span={12}>
                  <Statistic
                    title={
                      <Space size={4}>
                        <NodeIndexOutlined style={{ color: "#722ed1" }} />
                        <span style={{ fontSize: "12px" }}>Total</span>
                      </Space>
                    }
                    value={nodes.length}
                    valueStyle={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#722ed1",
                    }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title={
                      <Space size={4}>
                        <ApartmentOutlined style={{ color: "#13c2c2" }} />
                        <span style={{ fontSize: "12px" }}>Links</span>
                      </Space>
                    }
                    value={edges.length}
                    valueStyle={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#13c2c2",
                    }}
                  />
                </Col>
              </Row>

              <div
                style={{
                  marginTop: "16px",
                  paddingTop: "12px",
                  borderTop: "1px solid #ffd591",
                }}
              >
                <Text
                  style={{
                    fontSize: "11px",
                    color: "#999",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ClockCircleOutlined style={{ marginRight: "4px" }} />
                  Updated: {new Date().toLocaleTimeString("vi-VN")}
                </Text>

                {selectedNode && (
                  <div style={{ marginTop: "8px" }}>
                    <Tag
                      color="orange"
                      style={{
                        borderRadius: "6px",
                        fontSize: "11px",
                        padding: "2px 8px",
                      }}
                    >
                      Selected: {selectedNode.data.label}
                    </Tag>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Workflow Health Check */}
      {nodes.length > 0 && (
        <div
          className="workflow-health"
          style={{
            marginTop: "16px",
            padding: "12px 16px",
            background: "linear-gradient(135deg, #f6ffed, #f0f9ff)",
            borderRadius: "12px",
            border: "1px solid #d9f7be",
          }}
        >
          <Text strong style={{ color: "#52c41a", marginRight: "12px" }}>
            Workflow Health:
          </Text>

          {triggerNodes.length === 0 && (
            <Tag color="red" style={{ marginRight: "8px" }}>
              ⚠️ Missing TRIGGER node
            </Tag>
          )}

          {outputNodes.length === 0 && (
            <Tag color="orange" style={{ marginRight: "8px" }}>
              ⚠️ Missing OUTPUT node
            </Tag>
          )}

          {triggerNodes.length > 0 &&
            outputNodes.length > 0 &&
            edges.length > 0 && (
              <Tag color="green">✅ Workflow looks complete</Tag>
            )}

          {nodes.length > 0 && edges.length === 0 && (
            <Tag color="orange">⚠️ Nodes are not connected</Tag>
          )}
        </div>
      )}
    </Card>
  );
};

export default WorkflowInfoPanel;
