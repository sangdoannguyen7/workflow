import React from "react";
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
} from "@xyflow/react";

interface CustomEdgeData {
  animated?: boolean;
  label?: string;
  status?: "success" | "error" | "warning" | "default";
}

const CustomEdge: React.FC<EdgeProps<CustomEdgeData>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
  selected,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Enhanced styling based on status and selection
  const getEdgeStyle = () => {
    let baseStyle = {
      stroke: "#1890ff",
      strokeWidth: 2,
      ...style,
    };

    // Status-based styling
    if (data?.status === "success") {
      baseStyle.stroke = "#52c41a";
      baseStyle.filter = "drop-shadow(0 0 4px rgba(82, 196, 26, 0.3))";
    } else if (data?.status === "error") {
      baseStyle.stroke = "#ff4d4f";
      baseStyle.strokeDasharray = "4px 4px";
    } else if (data?.status === "warning") {
      baseStyle.stroke = "#fa8c16";
      baseStyle.strokeDasharray = "6px 2px";
    }

    // Selection styling
    if (selected) {
      baseStyle.strokeWidth = 3;
      baseStyle.filter = "drop-shadow(0 0 6px rgba(24, 144, 255, 0.4))";
    }

    // Animation styling
    if (data?.animated) {
      baseStyle.strokeDasharray = "5px 5px";
      baseStyle.animation = "dashdraw 0.5s linear infinite";
    }

    // CRITICAL: Add hardware acceleration properties
    return {
      ...baseStyle,
      willChange: "stroke, stroke-width, d",
      transform: "translateZ(0)",
      backfaceVisibility: "hidden",
    };
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={getEdgeStyle()}
        className={`custom-edge ${selected ? "selected" : ""} ${
          data?.status || "default"
        }`}
      />

      {/* Enhanced edge label if provided */}
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: "rgba(255, 255, 255, 0.95)",
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 500,
              border: "1px solid #e8e8e8",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(4px)",
              color: "#666",
              // Hardware acceleration for smooth movement
              willChange: "transform",
              backfaceVisibility: "hidden",
              transform: "translateZ(0)",
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default CustomEdge;
