import {
  IWorkflow,
  IWorkflowResponse,
  IWorkflowDesign,
} from "../interface/workflow.interface";
import { getMockNodesByWorkflow } from "./node.mock";

export const mockWorkflows: IWorkflow[] = [
  {
    workflowId: 1,
    workflowCode: "BOOKING_FLOW",
    workflowName: "Hotel Booking Workflow",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description: "Workflow xử lý quy trình đặt phòng khách sạn",
    search: "hotel booking workflow hoạt động",
    nodes: [],
  },
  {
    workflowId: 2,
    workflowCode: "REPORT_FLOW",
    workflowName: "Daily Report Workflow",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description: "Workflow tạo báo cáo hàng ngày tự động",
    search: "daily report workflow hoạt động",
    nodes: [],
  },
  {
    workflowId: 3,
    workflowCode: "SYNC_FLOW",
    workflowName: "Data Synchronization Workflow",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description: "Workflow đồng bộ dữ liệu với hệ thống bên ngoài",
    search: "data synchronization workflow hoạt động",
    nodes: [],
  },
  {
    workflowId: 4,
    workflowCode: "NOTIFICATION_FLOW",
    workflowName: "Notification Workflow",
    statusCode: "DRAFT",
    statusName: "Bản nháp",
    description: "Workflow gửi thông báo đến người dùng",
    search: "notification workflow bản nháp",
    nodes: [],
  },
  {
    workflowId: 5,
    workflowCode: "PAYMENT_FLOW",
    workflowName: "Payment Processing Workflow",
    statusCode: "INACTIVE",
    statusName: "Không hoạt động",
    description: "Workflow xử lý thanh toán và giao dịch",
    search: "payment processing workflow không hoạt động",
    nodes: [],
  },
];

export const getMockWorkflows = (params?: any): IWorkflowResponse => {
  let filteredWorkflows = [...mockWorkflows];

  if (params?.search) {
    filteredWorkflows = filteredWorkflows.filter(
      (workflow) =>
        workflow.search?.toLowerCase().includes(params.search.toLowerCase()) ||
        workflow.workflowName
          .toLowerCase()
          .includes(params.search.toLowerCase()) ||
        workflow.workflowCode
          .toLowerCase()
          .includes(params.search.toLowerCase())
    );
  }

  if (params?.statusCode) {
    filteredWorkflows = filteredWorkflows.filter(
      (workflow) => workflow.statusCode === params.statusCode
    );
  }

  // Add nodes to workflows
  filteredWorkflows = filteredWorkflows.map((workflow) => ({
    ...workflow,
    nodes: getMockNodesByWorkflow(workflow.workflowCode),
  }));

  const page = params?.page || 0;
  const size = params?.size || 10;
  const start = page * size;
  const end = start + size;

  return {
    content: filteredWorkflows.slice(start, end),
    totalElements: filteredWorkflows.length,
    totalPages: Math.ceil(filteredWorkflows.length / size),
    size: size,
    number: page,
  };
};

export const getMockWorkflowById = (id: number): IWorkflow | undefined => {
  const workflow = mockWorkflows.find((workflow) => workflow.workflowId === id);
  if (workflow) {
    return {
      ...workflow,
      nodes: getMockNodesByWorkflow(workflow.workflowCode),
    };
  }
  return undefined;
};

export const getMockWorkflowByCode = (code: string): IWorkflow | undefined => {
  const workflow = mockWorkflows.find(
    (workflow) => workflow.workflowCode === code
  );
  if (workflow) {
    return {
      ...workflow,
      nodes: getMockNodesByWorkflow(workflow.workflowCode),
    };
  }
  return undefined;
};

// Mock workflow designs for React Flow
export const mockWorkflowDesigns: { [key: string]: IWorkflowDesign } = {
  BOOKING_FLOW: {
    workflowCode: "BOOKING_FLOW",
    nodes: [
      {
        id: "NODE_WEBHOOK_START",
        position: { x: 100, y: 100 },
        data: {
          label: "Webhook Start",
          nodeCode: "NODE_WEBHOOK_START",
          templateCode: "WEBHOOK_RECEIVE",
          agentCode: "WEBHOOK_AGENT",
          description: "Node khởi đầu workflow khi nhận webhook booking",
        },
      },
      {
        id: "NODE_VALIDATE_DATA",
        position: { x: 300, y: 100 },
        data: {
          label: "Validate Data",
          nodeCode: "NODE_VALIDATE_DATA",
          templateCode: "API_GET_DATA",
          agentCode: "DATA_AGENT",
          description: "Node xác thực dữ liệu booking",
        },
      },
      {
        id: "NODE_SEND_CONFIRMATION",
        position: { x: 500, y: 100 },
        data: {
          label: "Send Confirmation",
          nodeCode: "NODE_SEND_CONFIRMATION",
          templateCode: "WEBHOOK_SEND",
          agentCode: "NOTIFY_AGENT",
          description: "Node gửi xác nhận booking",
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "NODE_WEBHOOK_START",
        target: "NODE_VALIDATE_DATA",
        type: "default",
      },
      {
        id: "edge-2",
        source: "NODE_VALIDATE_DATA",
        target: "NODE_SEND_CONFIRMATION",
        type: "default",
      },
    ],
    viewport: { x: 0, y: 0, zoom: 1 },
  },
  REPORT_FLOW: {
    workflowCode: "REPORT_FLOW",
    nodes: [
      {
        id: "NODE_DAILY_REPORT",
        position: { x: 200, y: 150 },
        data: {
          label: "Daily Report",
          nodeCode: "NODE_DAILY_REPORT",
          templateCode: "SCHEDULE_DAILY",
          agentCode: "SCHEDULE_AGENT",
          description: "Node tạo báo cáo hàng ngày",
        },
      },
    ],
    edges: [],
    viewport: { x: 0, y: 0, zoom: 1 },
  },
};

export const getMockWorkflowDesign = (
  workflowCode: string
): IWorkflowDesign | undefined => {
  return mockWorkflowDesigns[workflowCode];
};

export const saveMockWorkflowDesign = (
  workflowCode: string,
  design: IWorkflowDesign
): IWorkflowDesign => {
  mockWorkflowDesigns[workflowCode] = design;
  return design;
};
