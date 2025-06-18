import { INode, INodeResponse } from "../interface/node.interface";

export const mockNodes: INode[] = [
  {
    nodeId: 1,
    nodeCode: "NODE_WEBHOOK_START",
    nodeName: "Webhook Start Node",
    templateCode: "WEBHOOK_RECEIVE",
    templateName: "Webhook Receiver Template",
    typeCode: "INPUT",
    typeName: "Input Template",
    agentCode: "WEBHOOK_AGENT",
    agentName: "Webhook Processing Agent",
    workflowCode: "BOOKING_FLOW",
    workflowName: "Hotel Booking Workflow",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    templateType: "webhook",
    description: "Node khởi đầu workflow khi nhận webhook booking",
    search: "webhook start node booking flow hoạt động",
    metadata: '{"position": {"x": 100, "y": 100}, "type": "start"}',
    info: "Entry point của workflow booking",
    schema: '{"event": "booking_created", "booking_id": "string"}',
    body: '{"webhook_data": "{{input}}", "node_id": "NODE_WEBHOOK_START"}',
    rule: '{"trigger": "webhook_received", "next_nodes": ["NODE_VALIDATE_DATA"]}',
    configuration: '{"auto_advance": true}',
    outputCode: "booking_data",
  },
  {
    nodeId: 2,
    nodeCode: "NODE_VALIDATE_DATA",
    nodeName: "Data Validation Node",
    templateCode: "API_GET_DATA",
    templateName: "REST API Get Data Template",
    typeCode: "PROCESS",
    typeName: "Process Template",
    agentCode: "DATA_AGENT",
    agentName: "Data Processing Agent",
    workflowCode: "BOOKING_FLOW",
    workflowName: "Hotel Booking Workflow",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    templateType: "restapi",
    description: "Node xác thực dữ liệu booking",
    search: "data validation node booking flow hoạt động",
    metadata: '{"position": {"x": 300, "y": 100}, "type": "process"}',
    info: "Kiểm tra tính hợp lệ của dữ liệu booking",
    schema: '{"booking_id": "string", "customer_data": "object"}',
    body: '{"validation_input": "{{booking_data}}", "node_id": "NODE_VALIDATE_DATA"}',
    rule: '{"validation_rules": ["required_fields", "format_check"], "next_nodes": ["NODE_SEND_CONFIRMATION"]}',
    configuration: '{"validation_timeout": 5000}',
    outputCode: "validated_data",
  },
  {
    nodeId: 3,
    nodeCode: "NODE_SEND_CONFIRMATION",
    nodeName: "Send Confirmation Node",
    templateCode: "WEBHOOK_SEND",
    templateName: "Webhook Sender Template",
    typeCode: "OUTPUT",
    typeName: "Output Template",
    agentCode: "NOTIFY_AGENT",
    agentName: "Notification Agent",
    workflowCode: "BOOKING_FLOW",
    workflowName: "Hotel Booking Workflow",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    templateType: "webhook",
    description: "Node gửi xác nhận booking",
    search: "send confirmation node booking flow hoạt động",
    metadata: '{"position": {"x": 500, "y": 100}, "type": "end"}',
    info: "Gửi email xác nhận đến khách hàng",
    schema: '{"customer_email": "string", "booking_details": "object"}',
    body: '{"confirmation_data": "{{validated_data}}", "node_id": "NODE_SEND_CONFIRMATION"}',
    rule: '{"notification_type": "email", "delivery": "immediate"}',
    configuration: '{"email_template": "booking_confirmation"}',
    outputCode: "confirmation_sent",
  },
  {
    nodeId: 4,
    nodeCode: "NODE_DAILY_REPORT",
    nodeName: "Daily Report Node",
    templateCode: "SCHEDULE_DAILY",
    templateName: "Daily Schedule Template",
    typeCode: "PROCESS",
    typeName: "Process Template",
    agentCode: "SCHEDULE_AGENT",
    agentName: "Schedule Task Agent",
    workflowCode: "REPORT_FLOW",
    workflowName: "Daily Report Workflow",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    templateType: "schedule",
    description: "Node tạo báo cáo hàng ngày",
    search: "daily report node report flow hoạt động",
    metadata: '{"position": {"x": 100, "y": 300}, "type": "schedule"}',
    info: "Tự động tạo báo cáo vào 00:00 hàng ngày",
    schema: '{"report_date": "string", "data_range": "object"}',
    body: '{"report_config": "{{schedule_config}}", "node_id": "NODE_DAILY_REPORT"}',
    rule: '{"schedule": "0 0 * * *", "timezone": "Asia/Ho_Chi_Minh"}',
    configuration: '{"report_format": "pdf", "include_charts": true}',
    outputCode: "report_data",
  },
  {
    nodeId: 5,
    nodeCode: "NODE_API_SYNC",
    nodeName: "API Data Sync Node",
    templateCode: "API_POST_DATA",
    templateName: "REST API Post Data Template",
    typeCode: "OUTPUT",
    typeName: "Output Template",
    agentCode: "API_AGENT",
    agentName: "REST API Agent",
    workflowCode: "SYNC_FLOW",
    workflowName: "Data Synchronization Workflow",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    templateType: "restapi",
    description: "Node đồng bộ dữ liệu qua API",
    search: "api data sync node sync flow hoạt động",
    metadata: '{"position": {"x": 300, "y": 300}, "type": "api"}',
    info: "Đồng bộ dữ liệu với hệ thống bên ngoài",
    schema: '{"sync_data": "object", "target_system": "string"}',
    body: '{"sync_payload": "{{input_data}}", "node_id": "NODE_API_SYNC"}',
    rule: '{"sync_method": "POST", "error_handling": "retry"}',
    configuration: '{"batch_size": 100, "retry_count": 3}',
    outputCode: "sync_result",
  },
  {
    nodeId: 6,
    nodeCode: "NODE_WEBHOOK_NOTIFY",
    nodeName: "Webhook Notification Node",
    templateCode: "WEBHOOK_SEND",
    templateName: "Webhook Sender Template",
    typeCode: "OUTPUT",
    typeName: "Output Template",
    agentCode: "WEBHOOK_AGENT",
    agentName: "Webhook Processing Agent",
    workflowCode: "NOTIFICATION_FLOW",
    workflowName: "Notification Workflow",
    statusCode: "INACTIVE",
    statusName: "Không hoạt động",
    templateType: "webhook",
    description: "Node gửi webhook thông báo",
    search: "webhook notification node notification flow không hoạt động",
    metadata: '{"position": {"x": 500, "y": 300}, "type": "webhook"}',
    info: "Gửi thông báo qua webhook",
    schema: '{"event": "string", "recipients": "array"}',
    body: '{"notification_data": "{{event_data}}", "node_id": "NODE_WEBHOOK_NOTIFY"}',
    rule: '{"delivery_method": "webhook", "priority": "normal"}',
    configuration: '{"webhook_url": "https://api.example.com/notify"}',
    outputCode: "notification_sent",
  },
];

export const getMockNodes = (params?: any): INodeResponse => {
  let filteredNodes = [...mockNodes];

  if (params?.search) {
    filteredNodes = filteredNodes.filter(
      (node) =>
        node.search?.toLowerCase().includes(params.search.toLowerCase()) ||
        node.nodeName.toLowerCase().includes(params.search.toLowerCase()) ||
        node.nodeCode.toLowerCase().includes(params.search.toLowerCase())
    );
  }

  if (params?.statusCode) {
    filteredNodes = filteredNodes.filter(
      (node) => node.statusCode === params.statusCode
    );
  }

  if (params?.workflowCode) {
    filteredNodes = filteredNodes.filter(
      (node) => node.workflowCode === params.workflowCode
    );
  }

  if (params?.templateCode) {
    filteredNodes = filteredNodes.filter(
      (node) => node.templateCode === params.templateCode
    );
  }

  const page = params?.page || 0;
  const size = params?.size || 10;
  const start = page * size;
  const end = start + size;

  return {
    content: filteredNodes.slice(start, end),
    totalElements: filteredNodes.length,
    totalPages: Math.ceil(filteredNodes.length / size),
    size: size,
    number: page,
  };
};

export const getMockNodeById = (id: number): INode | undefined => {
  return mockNodes.find((node) => node.nodeId === id);
};

export const getMockNodeByCode = (code: string): INode | undefined => {
  return mockNodes.find((node) => node.nodeCode === code);
};

export const getMockNodesByWorkflow = (workflowCode: string): INode[] => {
  return mockNodes.filter((node) => node.workflowCode === workflowCode);
};

export const getMockNodesByTemplate = (templateCode: string): INode[] => {
  return mockNodes.filter((node) => node.templateCode === templateCode);
};
