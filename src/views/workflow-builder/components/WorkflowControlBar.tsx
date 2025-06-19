import React from "react";
import {
  Card,
  Button,
  Space,
  Select,
  Typography,
  Tooltip,
  Row,
  Col,
} from "antd";
import {
  SaveOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  DeleteOutlined,
  FullscreenOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  DragOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { ReactFlowInstance } from "@xyflow/react";
import { IWorkflow } from "../../../interface/workflow.interface";

const { Text } = Typography;

interface WorkflowControlBarProps {
  workflows: IWorkflow[];
  selectedWorkflow: string;
  onSelectWorkflow: (value: string) => void;
  isPlaying: boolean;
  onToggleSimulation: () => void;
  onSave: () => void;
  onReload: () => void;
  onClear: () => void;
  reactFlowInstance: ReactFlowInstance | null;
  nodeCount: number;
  templatePanelVisible: boolean;
  onToggleTemplatePanel: () => void;
  selectedNode: any;
}

const WorkflowControlBar: React.FC<WorkflowControlBarProps> = ({
  workflows,
  selectedWorkflow,
  onSelectWorkflow,
  isPlaying,
  onToggleSimulation,
  onSave,
  onReload,
  onClear,
  reactFlowInstance,
  nodeCount,
  templatePanelVisible,
  onToggleTemplatePanel,
  selectedNode,
}) => {
  return (
    <Card
      className="workflow-control-bar"
      size="small"
      style={{
        margin: "12px",
        marginBottom: "8px",
        borderRadius: "16px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        border: "1px solid #e8e8e8",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(8px)",
      }}
      bodyStyle={{ padding: "16px 24px" }}
    >
      <Row justify="space-between" align="middle" gutter={[16, 8]}>
        {/* Left Section - Workflow Selection */}
        <Col xs={24} sm={12} md={8}>
          <Space size="middle" wrap>
            <Tooltip
              title={templatePanelVisible ? "Hide Templates" : "Show Templates"}
            >
              <Button
                icon={<DragOutlined />}
                onClick={onToggleTemplatePanel}
                type={templatePanelVisible ? "primary" : "default"}
                style={{
                  borderRadius: "10px",
                  height: "36px",
                  boxShadow: templatePanelVisible
                    ? "0 4px 12px rgba(24, 144, 255, 0.3)"
                    : undefined,
                }}
              >
                Templates
              </Button>
            </Tooltip>

            <div className="workflow-selector">
              <Text
                type="secondary"
                style={{ fontSize: "13px", marginRight: "8px" }}
              >
                Workflow:
              </Text>
              <Select
                style={{ minWidth: 280 }}
                size="large"
                placeholder="Select workflow to design"
                value={selectedWorkflow}
                onChange={onSelectWorkflow}
                showSearch
                optionFilterProp="children"
                style={{
                  borderRadius: "10px",
                }}
                dropdownStyle={{
                  borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                }}
              >
                {workflows.map((workflow) => (
                  <Select.Option
                    key={workflow.workflowCode}
                    value={workflow.workflowCode}
                  >
                    <div>
                      <Text strong>{workflow.workflowName}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {workflow.workflowCode}
                      </Text>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </div>

            <Tooltip title="Create new workflow">
              <Button
                icon={<PlusOutlined />}
                size="large"
                type="dashed"
                style={{
                  borderRadius: "10px",
                  height: "36px",
                }}
              >
                New
              </Button>
            </Tooltip>
          </Space>
        </Col>

        {/* Center Section - View Controls */}
        <Col xs={24} sm={12} md={8}>
          <div
            className="view-controls"
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                padding: "6px",
                background: "#f8f9fa",
                borderRadius: "12px",
                border: "1px solid #e9ecef",
                display: "flex",
                gap: "4px",
              }}
            >
              <Tooltip title="Fit view">
                <Button
                  icon={<FullscreenOutlined />}
                  onClick={() => reactFlowInstance?.fitView()}
                  type="text"
                  size="small"
                  style={{ borderRadius: "8px" }}
                />
              </Tooltip>
              <Tooltip title="Zoom in">
                <Button
                  icon={<ZoomInOutlined />}
                  onClick={() => reactFlowInstance?.zoomIn()}
                  type="text"
                  size="small"
                  style={{ borderRadius: "8px" }}
                />
              </Tooltip>
              <Tooltip title="Zoom out">
                <Button
                  icon={<ZoomOutOutlined />}
                  onClick={() => reactFlowInstance?.zoomOut()}
                  type="text"
                  size="small"
                  style={{ borderRadius: "8px" }}
                />
              </Tooltip>
            </div>
          </div>
        </Col>

        {/* Right Section - Action Controls */}
        <Col xs={24} sm={24} md={8}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Space size="middle" wrap>
              <Tooltip
                title={isPlaying ? "Stop simulation" : "Start simulation"}
              >
                <Button
                  type={isPlaying ? "primary" : "default"}
                  icon={
                    isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />
                  }
                  onClick={onToggleSimulation}
                  disabled={nodeCount === 0}
                  size="large"
                  style={{
                    borderRadius: "10px",
                    height: "36px",
                    background: isPlaying
                      ? "linear-gradient(135deg, #fa8c16, #ffa940)"
                      : undefined,
                    border: isPlaying ? "none" : undefined,
                    boxShadow: isPlaying
                      ? "0 4px 12px rgba(250, 140, 22, 0.3)"
                      : undefined,
                  }}
                >
                  {isPlaying ? "Stop" : "Run"}
                </Button>
              </Tooltip>

              <Tooltip title="Reload workflow">
                <Button
                  icon={<ReloadOutlined />}
                  onClick={onReload}
                  disabled={!selectedWorkflow}
                  size="large"
                  style={{ borderRadius: "10px", height: "36px" }}
                >
                  Reload
                </Button>
              </Tooltip>

              <Tooltip title="Clear all nodes">
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={onClear}
                  disabled={nodeCount === 0}
                  size="large"
                  style={{ borderRadius: "10px", height: "36px" }}
                >
                  Clear
                </Button>
              </Tooltip>

              <Tooltip title="Save workflow">
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={onSave}
                  disabled={!selectedWorkflow || nodeCount === 0}
                  size="large"
                  style={{
                    borderRadius: "10px",
                    height: "36px",
                    background: "linear-gradient(135deg, #1890ff, #40a9ff)",
                    border: "none",
                    boxShadow: "0 6px 16px rgba(24, 144, 255, 0.3)",
                    fontWeight: 600,
                  }}
                >
                  Save Workflow
                </Button>
              </Tooltip>
            </Space>
          </div>
        </Col>
      </Row>

      {/* Status Bar */}
      {(selectedNode || nodeCount > 0) && (
        <div
          className="status-bar"
          style={{
            marginTop: "12px",
            paddingTop: "12px",
            borderTop: "1px solid #f0f0f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "12px",
            color: "#666",
          }}
        >
          <div className="left-status">
            <Text type="secondary">
              Total nodes: <Text strong>{nodeCount}</Text>
            </Text>
          </div>
          <div className="right-status">
            {selectedNode && (
              <Text type="secondary">
                Selected:{" "}
                <Text strong style={{ color: "#1890ff" }}>
                  {selectedNode.data?.label}
                </Text>
              </Text>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default WorkflowControlBar;
