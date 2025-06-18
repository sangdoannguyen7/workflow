import { IWorkflowDesign } from "../interface/workflow.interface";

// Test workflow examples for drag-and-drop functionality
export const testWorkflowExamples: { [key: string]: IWorkflowDesign } = {
  DRAG_DROP_TEST: {
    workflowCode: "DRAG_DROP_TEST",
    nodes: [
      {
        id: "start_node",
        position: { x: 50, y: 100 },
        data: {
          label: "Start Process",
          nodeCode: "NODE_START",
          templateCode: "WEBHOOK_RECEIVE",
          agentCode: "WEBHOOK_AGENT",
          templateType: "webhook",
          description: "Starting point for the workflow",
          info: "Receives initial trigger event",
        },
      },
      {
        id: "validation_node",
        position: { x: 300, y: 100 },
        data: {
          label: "Validate Input",
          nodeCode: "NODE_VALIDATE",
          templateCode: "API_GET_DATA",
          agentCode: "DATA_AGENT",
          templateType: "restapi",
          description: "Validates incoming data",
          info: "Performs comprehensive data validation including format checks and business rules",
        },
      },
      {
        id: "process_node",
        position: { x: 550, y: 100 },
        data: {
          label: "Process Data",
          nodeCode: "NODE_PROCESS",
          templateCode: "SCHEDULE_DAILY",
          agentCode: "SCHEDULE_AGENT",
          templateType: "schedule",
          description: "Processes the validated data",
          info: "Main business logic processing with error handling and retry mechanisms",
        },
      },
      {
        id: "notification_node",
        position: { x: 300, y: 250 },
        data: {
          label: "Send Notification",
          nodeCode: "NODE_NOTIFY",
          templateCode: "WEBHOOK_SEND",
          agentCode: "NOTIFY_AGENT",
          templateType: "webhook",
          description: "Sends completion notification",
          info: "Multi-channel notification system supporting email, SMS, and webhooks",
        },
      },
    ],
    edges: [
      {
        id: "edge_1",
        source: "start_node",
        target: "validation_node",
        type: "default",
        data: { label: "Input Data" },
      },
      {
        id: "edge_2",
        source: "validation_node",
        target: "process_node",
        type: "default",
        data: { label: "Valid Data" },
      },
      {
        id: "edge_3",
        source: "process_node",
        target: "notification_node",
        type: "default",
        data: { label: "Completion" },
      },
    ],
    viewport: { x: 0, y: 0, zoom: 1 },
  },

  COMPLEX_WORKFLOW: {
    workflowCode: "COMPLEX_WORKFLOW",
    nodes: [
      {
        id: "webhook_start",
        position: { x: 50, y: 200 },
        data: {
          label: "Webhook Trigger",
          nodeCode: "WEBHOOK_START",
          templateCode: "WEBHOOK_RECEIVE",
          agentCode: "WEBHOOK_AGENT",
          templateType: "webhook",
          description: "Entry point via webhook",
          info: "Configurable webhook endpoint with signature validation and rate limiting",
        },
      },
      {
        id: "data_validation",
        position: { x: 250, y: 200 },
        data: {
          label: "Data Validation",
          nodeCode: "DATA_VALIDATION",
          templateCode: "API_GET_DATA",
          agentCode: "DATA_AGENT",
          templateType: "restapi",
          description: "Validates incoming payload",
          info: "JSON schema validation with custom business rules and field sanitization",
        },
      },
      {
        id: "decision_branch",
        position: { x: 450, y: 200 },
        data: {
          label: "Decision Point",
          nodeCode: "DECISION_BRANCH",
          templateCode: "CALCULATE_TEMPLATE",
          agentCode: "LOGIC_AGENT",
          templateType: "logic",
          description: "Route based on data content",
          info: "Intelligent routing using configurable conditions and machine learning models",
        },
      },
      {
        id: "process_a",
        position: { x: 650, y: 100 },
        data: {
          label: "Process A",
          nodeCode: "PROCESS_A",
          templateCode: "API_POST_DATA",
          agentCode: "API_AGENT",
          templateType: "restapi",
          description: "High priority processing",
          info: "Fast-track processing for urgent items with dedicated resources",
        },
      },
      {
        id: "process_b",
        position: { x: 650, y: 300 },
        data: {
          label: "Process B",
          nodeCode: "PROCESS_B",
          templateCode: "SCHEDULE_DAILY",
          agentCode: "SCHEDULE_AGENT",
          templateType: "schedule",
          description: "Standard processing",
          info: "Standard processing queue with batch optimization and resource balancing",
        },
      },
      {
        id: "merge_results",
        position: { x: 850, y: 200 },
        data: {
          label: "Merge Results",
          nodeCode: "MERGE_RESULTS",
          templateCode: "AGGREGATE_TEMPLATE",
          agentCode: "DATA_AGENT",
          templateType: "aggregate",
          description: "Combines processing results",
          info: "Intelligent result aggregation with conflict resolution and data deduplication",
        },
      },
      {
        id: "final_notification",
        position: { x: 1050, y: 200 },
        data: {
          label: "Final Notification",
          nodeCode: "FINAL_NOTIFICATION",
          templateCode: "WEBHOOK_SEND",
          agentCode: "NOTIFY_AGENT",
          templateType: "webhook",
          description: "Send completion notification",
          info: "Comprehensive notification with detailed results, metrics, and next steps",
        },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "webhook_start",
        target: "data_validation",
        type: "default",
      },
      {
        id: "e2",
        source: "data_validation",
        target: "decision_branch",
        type: "default",
      },
      {
        id: "e3",
        source: "decision_branch",
        target: "process_a",
        type: "default",
        data: { label: "High Priority" },
      },
      {
        id: "e4",
        source: "decision_branch",
        target: "process_b",
        type: "default",
        data: { label: "Standard" },
      },
      {
        id: "e5",
        source: "process_a",
        target: "merge_results",
        type: "default",
      },
      {
        id: "e6",
        source: "process_b",
        target: "merge_results",
        type: "default",
      },
      {
        id: "e7",
        source: "merge_results",
        target: "final_notification",
        type: "default",
      },
    ],
    viewport: { x: 0, y: 0, zoom: 0.8 },
  },

  SIMPLE_TEST: {
    workflowCode: "SIMPLE_TEST",
    nodes: [
      {
        id: "node1",
        position: { x: 100, y: 100 },
        data: {
          label: "Input Node",
          nodeCode: "INPUT_NODE",
          templateCode: "WEBHOOK_RECEIVE",
          agentCode: "WEBHOOK_AGENT",
          templateType: "webhook",
          description: "Simple input node for testing",
          info: "Basic webhook receiver for testing drag-and-drop functionality",
        },
      },
      {
        id: "node2",
        position: { x: 400, y: 100 },
        data: {
          label: "Output Node",
          nodeCode: "OUTPUT_NODE",
          templateCode: "WEBHOOK_SEND",
          agentCode: "WEBHOOK_AGENT",
          templateType: "webhook",
          description: "Simple output node for testing",
          info: "Basic webhook sender for testing drag-and-drop connections",
        },
      },
    ],
    edges: [
      { id: "simple_edge", source: "node1", target: "node2", type: "default" },
    ],
    viewport: { x: 0, y: 0, zoom: 1 },
  },
};

export const getTestWorkflowDesign = (
  workflowCode: string
): IWorkflowDesign | undefined => {
  return testWorkflowExamples[workflowCode];
};

export const getAllTestWorkflows = (): string[] => {
  return Object.keys(testWorkflowExamples);
};
