import React from "react";
import {
  Card,
  Button,
  Space,
  Select,
  Row,
  Col,
  Dropdown,
  Typography,
  Badge,
  Tooltip,
  theme,
} from "antd";
import {
  SaveOutlined,
  ReloadOutlined,
  DeleteOutlined,
  DragOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SettingOutlined,
  DownloadOutlined,
  UploadOutlined,
  FullscreenOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  CompressOutlined,
  MoreOutlined,
  ThunderboltOutlined,
  ApiOutlined,
  CheckCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { IWorkflow } from "../../../interface/workflow.interface";

const { Option } = Select;
const { Text } = Typography;

interface WorkflowToolbarProps {
  workflows: IWorkflow[];
  selectedWorkflow: string;
  onWorkflowChange: (value: string) => void;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
  onTogglePalette: () => void;
  onToggleSimulation: () => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFitView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  isPlaying: boolean;
  nodeCount: number;
  edgeCount: number;
  paletteVisible: boolean;
  selectedNodeId?: string;
}

const WorkflowToolbar: React.FC<WorkflowToolbarProps> = ({
  workflows,
  selectedWorkflow,
  onWorkflowChange,
  onSave,
  onLoad,
  onClear,
  onTogglePalette,
  onToggleSimulation,
  onExport,
  onImport,
  onFitView,
  onZoomIn,
  onZoomOut,
  isPlaying,
  nodeCount,
  edgeCount,
  paletteVisible,
  selectedNodeId,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    token: {
      colorBgContainer,
      colorPrimary,
      colorText,
      colorTextSecondary,
      borderRadiusLG,
      boxShadowSecondary,
    },
  } = theme.useToken();

  const moreMenuItems = [
    {
      key: "export",
      icon: <DownloadOutlined style={{ color: "#52c41a" }} />,
      label: (
        <Space>
          <span>Xuất workflow</span>
          <Text type="secondary" style={{ fontSize: "11px" }}>
            JSON
          </Text>
        </Space>
      ),
      onClick: onExport,
    },
    {
      key: "import",
      icon: <UploadOutlined style={{ color: "#1890ff" }} />,
      label: (
        <Space>
          <span>Nhập workflow</span>
          <Text type="secondary" style={{ fontSize: "11px" }}>
            JSON
          </Text>
        </Space>
      ),
      onClick: () => fileInputRef.current?.click(),
    },
    {
      key: "divider1",
      type: "divider" as const,
    },
    {
      key: "validate",
      icon: <CheckCircleOutlined style={{ color: "#fa8c16" }} />,
      label: (
        <Space>
          <span>Kiểm tra workflow</span>
          <Text type="secondary" style={{ fontSize: "11px" }}>
            Validate
          </Text>
        </Space>
      ),
      onClick: () => console.log("Validate workflow"),
    },
    {
      key: "optimize",
      icon: <ThunderboltOutlined style={{ color: "#722ed1" }} />,
      label: (
        <Space>
          <span>Tối ưu workflow</span>
          <Text type="secondary" style={{ fontSize: "11px" }}>
            Auto
          </Text>
        </Space>
      ),
      onClick: () => console.log("Optimize workflow"),
    },
    {
      key: "divider2",
      type: "divider" as const,
    },
    {
      key: "settings",
      icon: <SettingOutlined style={{ color: "#666" }} />,
      label: "Cài đặt nâng cao",
      onClick: () => console.log("Advanced settings"),
    },
  ];

  const getWorkflowStatus = (workflow: IWorkflow) => {
    const status = workflow.statusCode?.toLowerCase();
    switch (status) {
      case "active":
        return { color: "#52c41a", text: "Hoạt động" };
      case "inactive":
        return { color: "#ff4d4f", text: "Tạm dừng" };
      case "draft":
        return { color: "#fa8c16", text: "Nháp" };
      default:
        return { color: "#1890ff", text: "Chưa xác định" };
    }
  };

  const currentWorkflow = workflows.find(
    (w) => w.workflowCode === selectedWorkflow
  );
  const workflowStatus = currentWorkflow
    ? getWorkflowStatus(currentWorkflow)
    : null;

  return (
    <>
      <Card
        size="small"
        style={{
          margin: "8px",
          marginBottom: "4px",
          borderRadius: borderRadiusLG,
          boxShadow: boxShadowSecondary,
          border: "1px solid #e8e8e8",
        }}
        bodyStyle={{ padding: "12px 20px" }}
      >
        <Row justify="space-between" align="middle">
          {/* Left Section */}
          <Col>
            <Space size="middle">
              {/* Enhanced Template Palette Toggle */}
              <Tooltip
                title={
                  paletteVisible
                    ? "Ẩn template palette (Ctrl+T)"
                    : "Hiện template palette (Ctrl+T)"
                }
              >
                <Button
                  icon={<DragOutlined />}
                  onClick={onTogglePalette}
                  type={paletteVisible ? "primary" : "default"}
                  style={{
                    borderRadius: "8px",
                    height: "36px",
                    background: paletteVisible
                      ? `linear-gradient(135deg, ${colorPrimary}, ${colorPrimary}cc)`
                      : undefined,
                    border: paletteVisible ? "none" : undefined,
                    boxShadow: paletteVisible
                      ? `0 4px 12px ${colorPrimary}30`
                      : undefined,
                  }}
                >
                  Template
                </Button>
              </Tooltip>

              {/* Enhanced Workflow Selector */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "2px" }}
              >
                <Text
                  type="secondary"
                  style={{ fontSize: "11px", fontWeight: 500 }}
                >
                  Workflow đang chỉnh sửa:
                </Text>
                <Select
                  style={{
                    width: 320,
                    "& .ant-select-selector": {
                      borderRadius: "8px",
                      border: "1px solid #e8e8e8",
                    },
                  }}
                  placeholder="🔍 Chọn workflow để thiết kế"
                  value={selectedWorkflow}
                  onChange={onWorkflowChange}
                  showSearch
                  optionFilterProp="children"
                  size="middle"
                >
                  {workflows.map((workflow) => {
                    const status = getWorkflowStatus(workflow);
                    return (
                      <Option
                        key={workflow.workflowCode}
                        value={workflow.workflowCode}
                      >
                        <Space
                          style={{
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <Text strong style={{ fontSize: "13px" }}>
                              {workflow.workflowName}
                            </Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: "11px" }}>
                              {workflow.workflowCode}
                            </Text>
                          </div>
                          <Badge
                            color={status.color}
                            text={
                              <Text
                                style={{
                                  fontSize: "10px",
                                  color: status.color,
                                }}
                              >
                                {status.text}
                              </Text>
                            }
                          />
                        </Space>
                      </Option>
                    );
                  })}
                </Select>
              </div>

              {/* Enhanced Workflow Stats */}
              <Space size="small">
                <Tooltip title="Số node trong workflow">
                  <Badge
                    count={nodeCount}
                    color="#1890ff"
                    style={{
                      backgroundColor: "#1890ff",
                      boxShadow: "0 2px 8px rgba(24, 144, 255, 0.3)",
                    }}
                  >
                    <div
                      style={{
                        padding: "4px 8px",
                        background: "#e6f7ff",
                        borderRadius: "6px",
                        border: "1px solid #91d5ff",
                      }}
                    >
                      <Text style={{ fontSize: "11px", fontWeight: 500 }}>
                        Nodes
                      </Text>
                    </div>
                  </Badge>
                </Tooltip>

                <Tooltip title="Số kết nối giữa các node">
                  <Badge
                    count={edgeCount}
                    color="#52c41a"
                    style={{
                      backgroundColor: "#52c41a",
                      boxShadow: "0 2px 8px rgba(82, 196, 26, 0.3)",
                    }}
                  >
                    <div
                      style={{
                        padding: "4px 8px",
                        background: "#f6ffed",
                        borderRadius: "6px",
                        border: "1px solid #b7eb8f",
                      }}
                    >
                      <Text style={{ fontSize: "11px", fontWeight: 500 }}>
                        Edges
                      </Text>
                    </div>
                  </Badge>
                </Tooltip>
              </Space>
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
                <Tooltip title="Fit view (F)">
                  <Button
                    icon={<FullscreenOutlined />}
                    onClick={onFitView}
                    type="text"
                    size="small"
                    style={{ borderRadius: "6px" }}
                  />
                </Tooltip>
                <Tooltip title="Zoom in (+)">
                  <Button
                    icon={<ZoomInOutlined />}
                    onClick={onZoomIn}
                    type="text"
                    size="small"
                    style={{ borderRadius: "6px" }}
                  />
                </Tooltip>
                <Tooltip title="Zoom out (-)">
                  <Button
                    icon={<ZoomOutOutlined />}
                    onClick={onZoomOut}
                    type="text"
                    size="small"
                    style={{ borderRadius: "6px" }}
                  />
                </Tooltip>
              </div>
            </Space>
          </Col>

          {/* Right Section */}
          <Col>
            <Space>
              {/* Enhanced Simulation Control */}
              <Tooltip
                title={
                  isPlaying ? "Dừng mô phỏng (Space)" : "Chạy mô phỏng (Space)"
                }
              >
                <Button
                  type={isPlaying ? "primary" : "default"}
                  icon={
                    isPlaying ? (
                      <PauseCircleOutlined style={{ fontSize: "16px" }} />
                    ) : (
                      <PlayCircleOutlined style={{ fontSize: "16px" }} />
                    )
                  }
                  onClick={onToggleSimulation}
                  disabled={nodeCount === 0}
                  style={{
                    borderRadius: "8px",
                    height: "36px",
                    minWidth: "80px",
                    background: isPlaying
                      ? `linear-gradient(135deg, ${colorPrimary}, ${colorPrimary}cc)`
                      : undefined,
                    border: isPlaying ? "none" : undefined,
                    boxShadow: isPlaying
                      ? `0 4px 12px ${colorPrimary}30`
                      : undefined,
                  }}
                >
                  {isPlaying ? "Dừng" : "Chạy"}
                </Button>
              </Tooltip>

              {/* Enhanced Actions */}
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={onClear}
                disabled={nodeCount === 0}
                style={{
                  borderRadius: "8px",
                  height: "36px",
                }}
              >
                Xóa tất cả
              </Button>

              <Button
                icon={<ReloadOutlined />}
                onClick={onLoad}
                disabled={!selectedWorkflow}
                style={{
                  borderRadius: "8px",
                  height: "36px",
                }}
              >
                Tải lại
              </Button>

              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={onSave}
                disabled={!selectedWorkflow || nodeCount === 0}
                style={{
                  borderRadius: "8px",
                  height: "36px",
                  background: `linear-gradient(135deg, ${colorPrimary}, ${colorPrimary}cc)`,
                  border: "none",
                  boxShadow: `0 4px 12px ${colorPrimary}30`,
                }}
              >
                Lưu Workflow
              </Button>

              {/* Enhanced More Options */}
              <Dropdown
                menu={{ items: moreMenuItems }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Button
                  icon={<MoreOutlined />}
                  style={{
                    borderRadius: "8px",
                    height: "36px",
                  }}
                />
              </Dropdown>
            </Space>
          </Col>
        </Row>

        {/* Enhanced Second Row - Status Bar */}
        <Row
          justify="space-between"
          align="middle"
          style={{
            marginTop: "12px",
            paddingTop: "12px",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Col>
            <Space size="large">
              <Space size="small">
                <Text type="secondary" style={{ fontSize: "11px" }}>
                  {selectedWorkflow ? (
                    <Space>
                      <ApiOutlined style={{ color: colorPrimary }} />
                      <span>Đang chỉnh sửa:</span>
                      <Text strong style={{ color: colorPrimary }}>
                        {currentWorkflow?.workflowName}
                      </Text>
                      {workflowStatus && (
                        <Badge
                          color={workflowStatus.color}
                          text={
                            <Text
                              style={{
                                fontSize: "10px",
                                color: workflowStatus.color,
                              }}
                            >
                              {workflowStatus.text}
                            </Text>
                          }
                        />
                      )}
                    </Space>
                  ) : (
                    "🔍 Chưa chọn workflow"
                  )}
                </Text>
              </Space>

              {selectedNodeId && (
                <Space size="small">
                  <Text type="secondary" style={{ fontSize: "11px" }}>
                    <Space>
                      <SettingOutlined style={{ color: "#fa8c16" }} />
                      <span>Node được chọn:</span>
                      <Text code style={{ fontSize: "10px", color: "#fa8c16" }}>
                        {selectedNodeId}
                      </Text>
                    </Space>
                  </Text>
                </Space>
              )}
            </Space>
          </Col>

          <Col>
            <Space>
              {isPlaying && (
                <Badge
                  status="processing"
                  text={
                    <Text style={{ fontSize: "11px", color: colorPrimary }}>
                      🔄 Đang mô phỏng workflow
                    </Text>
                  }
                />
              )}

              <Space size="small">
                <SyncOutlined
                  style={{ fontSize: "10px", color: colorTextSecondary }}
                />
                <Text type="secondary" style={{ fontSize: "10px" }}>
                  Cập nhật: {new Date().toLocaleTimeString("vi-VN")}
                </Text>
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={onImport}
      />
    </>
  );
};

export default WorkflowToolbar;
