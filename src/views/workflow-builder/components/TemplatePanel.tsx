import React, { DragEvent } from "react";
import { Card, Typography, Tag, Badge, Space, Tooltip, Collapse } from "antd";
import {
  LinkOutlined,
  ApiOutlined,
  ScheduleOutlined,
  DragOutlined,
} from "@ant-design/icons";
import { ITemplate } from "../../../interface/template.interface";
import {
  NodeType,
  getNodeTypeFromTemplate,
  NODE_TYPE_CONFIGS,
} from "../../../types/workflow-nodes.types";

const { Text, Title } = Typography;
const { Panel: CollapsePanel } = Collapse;

interface TemplatePanelProps {
  templates: ITemplate[];
  visible: boolean;
  onToggle: () => void;
}

const ICON_MAP = {
  [NodeType.TRIGGER]: <LinkOutlined />,
  [NodeType.BEHAVIOR]: <ApiOutlined />,
  [NodeType.OUTPUT]: <ScheduleOutlined />,
};

const TemplateCard: React.FC<{ template: ITemplate }> = ({ template }) => {
  const nodeType = getNodeTypeFromTemplate(
    template.templateType || template.typeCode || "behavior"
  );
  const config = NODE_TYPE_CONFIGS[nodeType];

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    console.log("Drag started for template:", template.templateCode);

    const dragData = {
      type: "template",
      template: template,
      nodeType: nodeType,
    };

    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(dragData)
    );
    event.dataTransfer.setData("text/plain", template.templateCode);
    event.dataTransfer.effectAllowed = "copy";

    // Visual feedback
    if (event.currentTarget) {
      event.currentTarget.style.opacity = "0.7";
      event.currentTarget.style.transform = "scale(0.98)";
    }
  };

  const handleDragEnd = (event: DragEvent<HTMLDivElement>) => {
    if (event.currentTarget) {
      event.currentTarget.style.opacity = "1";
      event.currentTarget.style.transform = "scale(1)";
    }
  };

  return (
    <div
      className="template-card"
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        border: `2px solid ${config.borderColor}`,
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "12px",
        cursor: "grab",
        backgroundColor: config.bgColor,
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        userSelect: "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent bar */}
      <div
        className="template-card-accent"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, ${config.color}, ${config.color}80)`,
          borderRadius: "12px 12px 0 0",
        }}
      />

      {/* Header */}
      <header
        className="template-card-header"
        style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}
      >
        <div
          className="template-icon"
          style={{
            color: config.color,
            marginRight: "12px",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: `${config.color}15`,
          }}
        >
          {ICON_MAP[nodeType]}
        </div>
        <div className="template-info" style={{ flex: 1 }}>
          <Text
            strong
            className="template-name"
            style={{ color: config.color, fontSize: "15px", display: "block" }}
          >
            {template.templateName}
          </Text>
          <Text
            className="template-code"
            style={{ fontSize: "12px", color: "#666" }}
          >
            {template.templateCode}
          </Text>
        </div>
        <div className="template-emoji" style={{ fontSize: "24px" }}>
          {config.emoji}
        </div>
      </header>

      {/* Description */}
      <main className="template-description" style={{ marginBottom: "12px" }}>
        <Text style={{ fontSize: "12px", color: "#666", lineHeight: "1.4" }}>
          {template.description && template.description.length > 70
            ? `${template.description.substring(0, 70)}...`
            : template.description || "No description available"}
        </Text>
      </main>

      {/* Tags */}
      <footer
        className="template-tags"
        style={{ display: "flex", gap: "8px", alignItems: "center" }}
      >
        <Tag
          size="small"
          color={config.color}
          style={{ margin: 0, fontWeight: 600 }}
        >
          {nodeType.toUpperCase()}
        </Tag>
        <Tag
          size="small"
          color={template.statusCode === "ACTIVE" ? "green" : "orange"}
          style={{ margin: 0 }}
        >
          {template.statusName || template.statusCode || "UNKNOWN"}
        </Tag>
      </footer>
    </div>
  );
};

const TemplatePanel: React.FC<TemplatePanelProps> = ({
  templates,
  visible,
}) => {
  // Group templates by type
  const groupedTemplates = templates.reduce((acc, template) => {
    const nodeType = getNodeTypeFromTemplate(
      template.templateType || template.typeCode
    );
    if (!acc[nodeType]) {
      acc[nodeType] = [];
    }
    acc[nodeType].push(template);
    return acc;
  }, {} as Record<NodeType, ITemplate[]>);

  if (!visible) return null;

  return (
    <aside
      className="template-panel"
      style={{
        width: "360px",
        borderRight: "1px solid #e8e8e8",
        background: "linear-gradient(180deg, #fafafa, #f5f5f5)",
        boxShadow: "2px 0 12px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Card
        title={
          <Space>
            <DragOutlined style={{ color: "#1890ff" }} />
            <span style={{ fontWeight: 600 }}>Template Library</span>
            <Badge
              count={templates.length}
              style={{ backgroundColor: "#1890ff" }}
            />
          </Space>
        }
        size="small"
        style={{
          height: "100%",
          border: "none",
          display: "flex",
          flexDirection: "column",
        }}
        bodyStyle={{
          padding: "20px",
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Instructions */}
        <section className="instructions" style={{ marginBottom: "20px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #e6f7ff, #f0f9ff)",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid #91d5ff",
            }}
          >
            <Title
              level={5}
              style={{ margin: 0, marginBottom: "8px", color: "#1890ff" }}
            >
              🎯 Hướng dẫn sử dụng
            </Title>
            <Text
              style={{ fontSize: "13px", color: "#666", lineHeight: "1.6" }}
            >
              <strong>Bước 1:</strong> Kéo template từ danh sách vào canvas
              <br />
              <strong>Bước 2:</strong> Kết nối các node bằng handle
              <br />
              <strong>Bước 3:</strong> Cấu hình properties và lưu workflow
            </Text>
          </div>
        </section>

        {/* Template Categories */}
        <section
          className="template-categories"
          style={{ flex: 1, overflow: "auto" }}
        >
          <Collapse
            defaultActiveKey={Object.keys(groupedTemplates)}
            ghost
            size="small"
            style={{ background: "transparent" }}
          >
            {Object.entries(groupedTemplates).map(([type, templateList]) => {
              const config = NODE_TYPE_CONFIGS[type as NodeType];
              return (
                <CollapsePanel
                  key={type}
                  header={
                    <Space>
                      <span style={{ fontSize: "20px", color: config.color }}>
                        {ICON_MAP[type as NodeType]}
                      </span>
                      <Text
                        strong
                        style={{ color: config.color, fontSize: "15px" }}
                      >
                        {type.toUpperCase()}
                      </Text>
                      <Badge
                        count={templateList.length}
                        style={{ backgroundColor: config.color }}
                      />
                    </Space>
                  }
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: "12px",
                    marginBottom: "8px",
                    border: `1px solid ${config.borderColor}`,
                  }}
                >
                  <div className="template-list">
                    {templateList.map((template) => (
                      <TemplateCard
                        key={template.templateId || template.templateCode}
                        template={template}
                      />
                    ))}
                  </div>
                </CollapsePanel>
              );
            })}
          </Collapse>
        </section>

        {/* Connection Rules */}
        <section className="connection-rules" style={{ marginTop: "16px" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.9)",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #e8e8e8",
            }}
          >
            <Text
              strong
              style={{
                fontSize: "12px",
                display: "block",
                marginBottom: "8px",
              }}
            >
              📋 Quy tắc kết nối:
            </Text>
            <Text
              style={{ fontSize: "11px", color: "#666", lineHeight: "1.4" }}
            >
              <Text style={{ color: "#52c41a" }}>🚀 TRIGGER</Text>: Chỉ có
              output
              <br />
              <Text style={{ color: "#1890ff" }}>⚙️ BEHAVIOR</Text>: Có input &
              output
              <br />
              <Text style={{ color: "#fa8c16" }}>📤 OUTPUT</Text>: Chỉ có input
            </Text>
          </div>
        </section>
      </Card>
    </aside>
  );
};

export default TemplatePanel;
