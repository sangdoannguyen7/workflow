import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  DragEvent,
} from "react";
import { message, Modal, theme } from "antd";
import {
  ReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ReactFlowProvider,
  ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "../../styles/workflow-edges.css";
import "../../styles/workflow-builder.css";

import { ITemplate } from "../../interface/template.interface";
import { IWorkflow } from "../../interface/workflow.interface";
import { IWorkflowDesign } from "../../interface/workflow.interface";
import templateApi from "../../apis/template/api.template";
import workflowApi from "../../apis/workflow/api.workflow";
import NodePropertiesPanel from "./components/NodePropertiesPanel";
import TemplatePanel from "./components/TemplatePanel";
import WorkflowCanvas from "./components/WorkflowCanvas";
import WorkflowControlBar from "./components/WorkflowControlBar";
import WorkflowInfoPanel from "./components/WorkflowInfoPanel";
import {
  getNodeTypeFromTemplate,
  canNodesConnect,
} from "../../types/workflow-nodes.types";
import { useDragSync } from "../../hooks/useDragSync";

const WorkflowBuilderPage: React.FC = () => {
  // Core state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflows, setWorkflows] = useState<IWorkflow[]>([]);
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // UI state
  const [templatePanelVisible, setTemplatePanelVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [nodeCounter, setNodeCounter] = useState(1);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Use drag sync hook for perfect synchronization
  useDragSync();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Enhanced connection validation
  const isValidConnection = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return false;

      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (!sourceNode || !targetNode) return false;

      const sourceType = getNodeTypeFromTemplate(sourceNode.data.templateType);
      const targetType = getNodeTypeFromTemplate(targetNode.data.templateType);

      return canNodesConnect(sourceType, targetType);
    },
    [nodes]
  );

  // Enhanced node connections with synchronized edge rendering
  const onConnect = useCallback(
    (params: Connection) => {
      console.log("Attempting to connect:", params);

      if (!isValidConnection(params)) {
        message.error({
          content:
            "⚠️ Invalid connection! Check node types and connection rules.",
          duration: 3,
        });
        return;
      }

      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        animated: isPlaying,
        style: {
          stroke: "#1890ff",
          strokeWidth: 3,
          strokeDasharray: isPlaying ? "8,4" : undefined,
        },
        markerEnd: {
          type: "arrowclosed" as const,
          color: "#1890ff",
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      message.success({
        content: "✅ Nodes connected successfully!",
        duration: 2,
      });
    },
    [setEdges, isPlaying, isValidConnection]
  );

  // Enhanced drop handler with position optimization
  const onDrop = useCallback(
    (
      event: DragEvent<HTMLDivElement>,
      dropData?: {
        template: any;
        nodeType: string;
        position: { x: number; y: number };
      }
    ) => {
      console.log("Enhanced drop handler called");

      try {
        let template, nodeType, position;

        if (dropData) {
          template = dropData.template;
          nodeType = dropData.nodeType;
          position = dropData.position;
        } else {
          const data = event.dataTransfer.getData("application/reactflow");
          if (!data) return;

          const parsed = JSON.parse(data);
          template = parsed.template;
          nodeType = parsed.nodeType;

          const reactFlowBounds =
            reactFlowWrapper.current?.getBoundingClientRect();
          if (!reactFlowBounds) return;

          position = {
            x: Math.max(0, event.clientX - reactFlowBounds.left - 140),
            y: Math.max(0, event.clientY - reactFlowBounds.top - 60),
          };
        }

        const newNodeId = `node_${nodeCounter}`;
        const newNode: Node = {
          id: newNodeId,
          type: "workflowNode",
          position: {
            x: position.x - 110,
            y: position.y - 50,
          },
          data: {
            label: template.templateName,
            templateCode: template.templateCode,
            templateType:
              template.templateType || template.typeCode || nodeType,
            agentCode: template.agentCode,
            description: template.description,
            template: template,
            nodeType: nodeType,
            timeout: 30000,
            retries: 3,
            priority: "normal",
          },
        };

        setNodes((nds) => nds.concat(newNode));
        setNodeCounter((prev) => prev + 1);
        message.success({
          content: `🎉 Added "${
            template.templateName
          }" (${nodeType.toUpperCase()})`,
          duration: 2,
        });
        setIsDragging(false);
      } catch (error) {
        console.error("Error in enhanced onDrop:", error);
        message.error("❌ Failed to create node");
        setIsDragging(false);
      }
    },
    [nodeCounter, setNodes]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragging(false);
    }
  }, []);

  // Data fetching functions
  const fetchWorkflows = async () => {
    try {
      const response = await workflowApi.getWorkflows({ size: 1000 });
      setWorkflows(response.content || []);
    } catch (error) {
      message.error("Failed to load workflows");
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await templateApi.getTemplates({ size: 1000 });
      setTemplates(response.content || []);
      console.log("Loaded templates:", response.content?.length || 0);
    } catch (error) {
      message.error("Failed to load templates");
    }
  };

  // Workflow design operations
  const loadWorkflowDesign = async (code: string) => {
    if (!code) return;

    try {
      const design = await workflowApi.getWorkflowDesign(code);

      const flowNodes: Node[] = design.nodes.map((node) => ({
        id: node.id,
        type: "workflowNode",
        position: node.position,
        data: node.data,
      }));

      const flowEdges: Edge[] = design.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type || "default",
        animated: isPlaying,
        style: {
          stroke: "#1890ff",
          strokeWidth: 3,
          strokeDasharray: isPlaying ? "8,4" : undefined,
        },
        markerEnd: {
          type: "arrowclosed" as const,
          color: "#1890ff",
        },
      }));

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

      message.success("✅ Workflow loaded successfully");
    } catch (error) {
      message.info("Creating new workflow");
      setNodes([]);
      setEdges([]);
      setNodeCounter(1);
    }
  };

  const saveWorkflowDesign = async () => {
    if (!selectedWorkflow) {
      message.error("Please select a workflow");
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
      message.success("✅ Workflow saved successfully");
    } catch (error) {
      message.error("❌ Failed to save workflow");
    }
  };

  // Event handlers
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const deleteSelectedNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            edge.source !== selectedNode.id && edge.target !== selectedNode.id
        )
      );
      setSelectedNode(null);
      message.success("✅ Node deleted");
    }
  }, [selectedNode, setNodes, setEdges]);

  const clearWorkflow = useCallback(() => {
    Modal.confirm({
      title: "⚠️ Clear entire workflow?",
      content: "This will remove all nodes and connections.",
      okText: "Clear",
      cancelText: "Cancel",
      okType: "danger",
      onOk: () => {
        setNodes([]);
        setEdges([]);
        setSelectedNode(null);
        setNodeCounter(1);
        message.success("✅ Workflow cleared");
      },
    });
  }, [setNodes, setEdges]);

  const toggleSimulation = useCallback(() => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);

    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        animated: newIsPlaying,
        style: {
          ...edge.style,
          strokeDasharray: newIsPlaying ? "8,4" : undefined,
        },
      }))
    );

    message.info(
      newIsPlaying ? "▶️ Simulation started" : "⏸️ Simulation stopped"
    );
  }, [isPlaying, setEdges]);

  // ReactFlow instance initialization
  const onInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  }, []);

  // Enhanced node update handler
  const handleNodeUpdate = useCallback(
    (nodeId: string, data: any) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        )
      );
    },
    [setNodes]
  );

  // Get current workflow info
  const currentWorkflow = workflows.find(
    (w) => w.workflowCode === selectedWorkflow
  );

  useEffect(() => {
    fetchWorkflows();
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (selectedWorkflow) {
      loadWorkflowDesign(selectedWorkflow);
    }
  }, [selectedWorkflow]);

  return (
    <ReactFlowProvider>
      <div
        className="workflow-builder"
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          background: colorBgContainer,
        }}
      >
        {/* Control Bar */}
        <WorkflowControlBar
          workflows={workflows}
          selectedWorkflow={selectedWorkflow}
          onSelectWorkflow={setSelectedWorkflow}
          isPlaying={isPlaying}
          onToggleSimulation={toggleSimulation}
          onSave={saveWorkflowDesign}
          onReload={() =>
            selectedWorkflow && loadWorkflowDesign(selectedWorkflow)
          }
          onClear={clearWorkflow}
          reactFlowInstance={reactFlowInstance}
          nodeCount={nodes.length}
          templatePanelVisible={templatePanelVisible}
          onToggleTemplatePanel={() =>
            setTemplatePanelVisible(!templatePanelVisible)
          }
          selectedNode={selectedNode}
        />

        {/* Main Content Area */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Template Panel */}
          <TemplatePanel
            templates={templates}
            visible={templatePanelVisible}
            onToggle={() => setTemplatePanelVisible(!templatePanelVisible)}
          />

          {/* Canvas Area */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Canvas */}
            <div
              ref={reactFlowWrapper}
              style={{
                flex: 1,
                margin: "8px 12px",
                border: isDragging
                  ? "3px dashed #1890ff"
                  : "2px dashed #e8e8e8",
                borderRadius: "20px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: isDragging
                  ? "0 12px 48px rgba(24, 144, 255, 0.2)"
                  : "0 4px 12px rgba(0,0,0,0.06)",
                overflow: "hidden",
              }}
            >
              <WorkflowCanvas
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                isPlaying={isPlaying}
                isDragging={isDragging}
                selectedNode={selectedNode}
                onInit={onInit}
              />
            </div>

            {/* Info Panel */}
            <WorkflowInfoPanel
              currentWorkflow={currentWorkflow}
              nodes={nodes}
              edges={edges}
              selectedNode={selectedNode}
            />
          </div>
        </div>

        {/* Node Properties Panel */}
        {selectedNode && (
          <NodePropertiesPanel
            node={selectedNode}
            onUpdate={handleNodeUpdate}
            onDelete={deleteSelectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </ReactFlowProvider>
  );
};

export default WorkflowBuilderPage;
