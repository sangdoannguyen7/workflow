import React from "react";
import { getSmoothStepPath, ConnectionLineComponentProps } from "@xyflow/react";

const CustomConnectionLine: React.FC<ConnectionLineComponentProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  });

  return (
    <g>
      <path
        fill="none"
        stroke="#1890ff"
        strokeWidth={2}
        strokeDasharray="8,4"
        d={edgePath}
        style={{
          // CRITICAL: Hardware acceleration for real-time following
          willChange: "d",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          // No transition for immediate response
          transition: "none",
          // Better rendering
          shapeRendering: "geometricPrecision",
          vectorEffect: "non-scaling-stroke",
        }}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#1890ff"
        r={4}
        stroke="#fff"
        strokeWidth={2}
        style={{
          // Hardware acceleration
          willChange: "cx, cy",
          transform: "translateZ(0)",
          transition: "none",
        }}
      />
    </g>
  );
};

export default CustomConnectionLine;
