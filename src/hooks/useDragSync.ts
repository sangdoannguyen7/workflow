import { useEffect, useRef } from "react";

/**
 * Custom hook để đảm bảo node và edge sync perfectly khi drag
 * Bằng cách disable CSS transitions khi đang drag
 */
export const useDragSync = () => {
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const handleNodeDragStart = () => {
      isDraggingRef.current = true;

      // Add dragging class to edges to disable transitions
      const edges = document.querySelectorAll(
        ".react-flow__edge, .react-flow__edge-path"
      );
      edges.forEach((edge) => {
        edge.classList.add("dragging");
      });

      // Add dragging class to nodes
      const nodes = document.querySelectorAll(".react-flow__node");
      nodes.forEach((node) => {
        if (!node.classList.contains("selected")) {
          node.classList.add("dragging-context");
        }
      });
    };

    const handleNodeDragEnd = () => {
      isDraggingRef.current = false;

      // Remove dragging class from edges to re-enable transitions
      const edges = document.querySelectorAll(
        ".react-flow__edge, .react-flow__edge-path"
      );
      edges.forEach((edge) => {
        edge.classList.remove("dragging");
      });

      // Remove dragging class from nodes
      const nodes = document.querySelectorAll(".react-flow__node");
      nodes.forEach((node) => {
        node.classList.remove("dragging-context");
      });
    };

    // Listen for React Flow drag events
    const reactFlowWrapper = document.querySelector(".react-flow");

    if (reactFlowWrapper) {
      // Use capture phase to catch events early
      reactFlowWrapper.addEventListener(
        "mousedown",
        (e) => {
          const target = e.target as HTMLElement;
          if (target.closest(".react-flow__node")) {
            handleNodeDragStart();
          }
        },
        true
      );

      reactFlowWrapper.addEventListener("mouseup", handleNodeDragEnd, true);

      // Also listen for drag end when mouse leaves the area
      reactFlowWrapper.addEventListener("mouseleave", handleNodeDragEnd, true);
    }

    return () => {
      if (reactFlowWrapper) {
        reactFlowWrapper.removeEventListener(
          "mousedown",
          handleNodeDragStart,
          true
        );
        reactFlowWrapper.removeEventListener(
          "mouseup",
          handleNodeDragEnd,
          true
        );
        reactFlowWrapper.removeEventListener(
          "mouseleave",
          handleNodeDragEnd,
          true
        );
      }
    };
  }, []);

  return {
    isDragging: isDraggingRef.current,
  };
};
