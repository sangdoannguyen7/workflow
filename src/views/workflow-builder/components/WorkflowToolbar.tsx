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

  const moreMenuItems = [
    {
      key: "export",
      icon: <DownloadOutlined />,
      label: "Xuất workflow",
      onClick: onExport,
    },
    {
      key: "import",
      icon: <UploadOutlined />,
      label: "Nhập workflow",
      onClick: () => fileInputRef.current?.click(),
    },
    {
      key: "divider1",
      type: "divider" as const,
    },
    {
      key: "validate",
      icon: <SettingOutlined />,
      label: "Kiểm tra workflow",
      onClick: () => console.log("Validate workflow"),
    },
  ];

  return (
    <>
      <Card size="small" style={{ margin: "8px", marginBottom: "4px" }}>
        <Row justify="space-between" align="middle">
          {/* Left Section */}
          <Col>
            <Space size="middle">
              {/* Template Palette Toggle */}
              <Tooltip
                title={
                  paletteVisible
                    ? "Ẩn template palette"
                    : "Hiện template palette"
                }
              >
                <Button
                  icon={<DragOutlined />}
                  onClick={onTogglePalette}
                  type={paletteVisible ? "primary" : "default"}
                >
                  Template
                </Button>
              </Tooltip>

              {/* Workflow Selector */}
              <div>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Workflow:
                </Text>
                <Select
                  style={{ width: 280, marginLeft: "4px" }}
                  placeholder="Chọn workflow để thiết kế"
                  value={selectedWorkflow}
                  onChange={onWorkflowChange}
                  showSearch
                  optionFilterProp="children"
                >
                  {workflows.map((workflow) => (
                    <Option
                      key={workflow.workflowCode}
                      value={workflow.workflowCode}
                    >
                      <Space>
                        <Text>{workflow.workflowName}</Text>
                        <Text type="secondary" style={{ fontSize: "11px" }}>
                          ({workflow.workflowCode})
                        </Text>
                      </Space>
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Workflow Stats */}
              <Space>
                <Badge count={nodeCount} color="blue" title="Số node">
                  <Text type="secondary">Nodes</Text>
                </Badge>
                <Badge count={edgeCount} color="green" title="Số connection">
                  <Text type="secondary">Edges</Text>
                </Badge>
              </Space>
            </Space>
          </Col>

          {/* Center Section - View Controls */}
          <Col>
            <Space>
              <Tooltip title="Fit view">
                <Button icon={<FullscreenOutlined />} onClick={onFitView} />
              </Tooltip>
              <Tooltip title="Zoom in">
                <Button icon={<ZoomInOutlined />} onClick={onZoomIn} />
              </Tooltip>
              <Tooltip title="Zoom out">
                <Button icon={<ZoomOutOutlined />} onClick={onZoomOut} />
              </Tooltip>
            </Space>
          </Col>

          {/* Right Section */}
          <Col>
            <Space>
              {/* Simulation Control */}
              <Tooltip title={isPlaying ? "Dừng mô phỏng" : "Chạy mô phỏng"}>
                <Button
                  type={isPlaying ? "primary" : "default"}
                  icon={
                    isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />
                  }
                  onClick={onToggleSimulation}
                  disabled={nodeCount === 0}
                >
                  {isPlaying ? "Dừng" : "Chạy"}
                </Button>
              </Tooltip>

              {/* Actions */}
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={onClear}
                disabled={nodeCount === 0}
              >
                Xóa tất cả
              </Button>

              <Button
                icon={<ReloadOutlined />}
                onClick={onLoad}
                disabled={!selectedWorkflow}
              >
                Tải lại
              </Button>

              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={onSave}
                disabled={!selectedWorkflow || nodeCount === 0}
              >
                Lưu Workflow
              </Button>

              {/* More Options */}
              <Dropdown menu={{ items: moreMenuItems }} trigger={["click"]}>
                <Button icon={<MoreOutlined />} />
              </Dropdown>
            </Space>
          </Col>
        </Row>

        {/* Second Row - Status Bar */}
        <Row
          justify="space-between"
          align="middle"
          style={{
            marginTop: "8px",
            paddingTop: "8px",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Col>
            <Space size="large">
              <Text type="secondary" style={{ fontSize: "11px" }}>
                {selectedWorkflow
                  ? `Đang chỉnh sửa: ${
                      workflows.find((w) => w.workflowCode === selectedWorkflow)
                        ?.workflowName
                    }`
                  : "Chưa chọn workflow"}
              </Text>
              {selectedNodeId && (
                <Text type="secondary" style={{ fontSize: "11px" }}>
                  Node được chọn: {selectedNodeId}
                </Text>
              )}
            </Space>
          </Col>
          <Col>
            <Space>
              {isPlaying && <Badge status="processing" text="Đang mô phỏng" />}
              <Text type="secondary" style={{ fontSize: "11px" }}>
                {new Date().toLocaleTimeString()}
              </Text>
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
