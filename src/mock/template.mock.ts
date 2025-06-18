import { ITemplate, ITemplateResponse } from "../interface/template.interface";

export const mockTemplates: ITemplate[] = [
  {
    templateId: 1,
    templateCode: "WEBHOOK_RECEIVE",
    templateName: "Webhook Receiver Template",
    typeCode: "INPUT",
    typeName: "Input Template",
    agentCode: "WEBHOOK_AGENT",
    agentName: "Webhook Processing Agent",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    templateType: "webhook",
    description: "Template nhận và xử lý webhook requests",
    search: "webhook receiver template input hoạt động",
    metadata: '{"endpoint": "/webhook", "method": "POST"}',
    info: "Webhook endpoint để nhận dữ liệu từ hệ thống bên ngoài",
    schema:
      '{"type": "object", "properties": {"event": {"type": "string"}, "data": {"type": "object"}}}',
    body: '{"event": "{{event}}", "timestamp": "{{timestamp}}", "data": "{{data}}"}',
    rule: '{"validation": ["required:event", "required:data"]}',
    configuration: '{"timeout": 30000, "retries": 3}',
  },
  {
    templateId: 2,
    templateCode: "SCHEDULE_DAILY",
    templateName: "Daily Schedule Template",
    typeCode: "PROCESS",
    typeName: "Process Template",
    agentCode: "SCHEDULE_AGENT",
    agentName: "Schedule Task Agent",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    templateType: "schedule",
    description: "Template thực hiện tác vụ hàng ngày",
    search: "daily schedule template process hoạt động",
    metadata: '{"cron": "0 0 * * *", "timezone": "Asia/Ho_Chi_Minh"}',
    info: "Chạy tác vụ hàng ngày lúc 00:00",
    schema:
      '{"type": "object", "properties": {"task": {"type": "string"}, "parameters": {"type": "object"}}}',
    body: '{"task": "{{task}}", "execution_time": "{{execution_time}}", "parameters": "{{parameters}}"}',
    rule: '{"execution": ["daily"], "retry_policy": "exponential_backoff"}',
    configuration: '{"max_execution_time": 3600000, "retry_count": 5}',
  },
  {
    templateId: 3,
    templateCode: "API_GET_DATA",
    templateName: "REST API Get Data Template",
    typeCode: "OUTPUT",
    typeName: "Output Template",
    agentCode: "API_AGENT",
    agentName: "REST API Agent",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    templateType: "restapi",
    description: "Template gọi REST API để lấy dữ liệu",
    search: "rest api get data template output hoạt động",
    metadata: '{"method": "GET", "content_type": "application/json"}',
    info: "Thực hiện GET request đến API endpoint",
    schema:
      '{"type": "object", "properties": {"url": {"type": "string"}, "headers": {"type": "object"}}}',
    body: '{"url": "{{api_url}}", "headers": {"Authorization": "Bearer {{token}}"}}',
    rule: '{"http_method": "GET", "response_format": "json"}',
    configuration: '{"timeout": 10000, "follow_redirects": true}',
  },
  {
    templateId: 4,
    templateCode: "API_POST_DATA",
    templateName: "REST API Post Data Template",
    typeCode: "OUTPUT",
    typeName: "Output Template",
    agentCode: "API_AGENT",
    agentName: "REST API Agent",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    templateType: "restapi",
    description: "Template gọi REST API để gửi dữ liệu",
    search: "rest api post data template output hoạt động",
    metadata: '{"method": "POST", "content_type": "application/json"}',
    info: "Thực hiện POST request đến API endpoint",
    schema:
      '{"type": "object", "properties": {"url": {"type": "string"}, "payload": {"type": "object"}}}',
    body: '{"url": "{{api_url}}", "payload": "{{data}}", "headers": {"Content-Type": "application/json"}}',
    rule: '{"http_method": "POST", "payload_required": true}',
    configuration: '{"timeout": 15000, "retry_on_failure": true}',
  },
  {
    templateId: 5,
    templateCode: "WEBHOOK_SEND",
    templateName: "Webhook Sender Template",
    typeCode: "OUTPUT",
    typeName: "Output Template",
    agentCode: "WEBHOOK_AGENT",
    agentName: "Webhook Processing Agent",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    templateType: "webhook",
    description: "Template gửi webhook đến hệ thống khác",
    search: "webhook sender template output hoạt động",
    metadata: '{"method": "POST", "content_type": "application/json"}',
    info: "Gửi webhook notification đến endpoint đích",
    schema:
      '{"type": "object", "properties": {"webhook_url": {"type": "string"}, "event_data": {"type": "object"}}}',
    body: '{"webhook_url": "{{target_url}}", "event_data": "{{payload}}", "signature": "{{signature}}"}',
    rule: '{"delivery": "immediate", "signature_required": true}',
    configuration: '{"timeout": 5000, "retries": 3, "retry_delay": 1000}',
  },
  {
    templateId: 6,
    templateCode: "SCHEDULE_HOURLY",
    templateName: "Hourly Schedule Template",
    typeCode: "PROCESS",
    typeName: "Process Template",
    agentCode: "SCHEDULE_AGENT",
    agentName: "Schedule Task Agent",
    statusCode: "DRAFT",
    statusName: "Bản nháp",
    templateType: "schedule",
    description: "Template thực hiện tác vụ hàng giờ",
    search: "hourly schedule template process bản nháp",
    metadata: '{"cron": "0 * * * *", "timezone": "Asia/Ho_Chi_Minh"}',
    info: "Chạy tác vụ mỗi giờ",
    schema:
      '{"type": "object", "properties": {"task": {"type": "string"}, "frequency": {"type": "string"}}}',
    body: '{"task": "{{task}}", "frequency": "hourly", "next_run": "{{next_execution}}"}',
    rule: '{"execution": ["hourly"], "overlap_prevention": true}',
    configuration:
      '{"max_execution_time": 1800000, "concurrent_executions": 1}',
  },
];

export const getMockTemplates = (params?: any): ITemplateResponse => {
  let filteredTemplates = [...mockTemplates];

  if (params?.search) {
    filteredTemplates = filteredTemplates.filter(
      (template) =>
        template.search?.toLowerCase().includes(params.search.toLowerCase()) ||
        template.templateName
          .toLowerCase()
          .includes(params.search.toLowerCase()) ||
        template.templateCode
          .toLowerCase()
          .includes(params.search.toLowerCase())
    );
  }

  if (params?.statusCode) {
    filteredTemplates = filteredTemplates.filter(
      (template) => template.statusCode === params.statusCode
    );
  }

  if (params?.agentCode) {
    filteredTemplates = filteredTemplates.filter(
      (template) => template.agentCode === params.agentCode
    );
  }

  if (params?.templateType) {
    filteredTemplates = filteredTemplates.filter(
      (template) => template.templateType === params.templateType
    );
  }

  const page = params?.page || 0;
  const size = params?.size || 10;
  const start = page * size;
  const end = start + size;

  return {
    content: filteredTemplates.slice(start, end),
    totalElements: filteredTemplates.length,
    totalPages: Math.ceil(filteredTemplates.length / size),
    size: size,
    number: page,
  };
};

export const getMockTemplateById = (id: number): ITemplate | undefined => {
  return mockTemplates.find((template) => template.templateId === id);
};

export const getMockTemplateByCode = (code: string): ITemplate | undefined => {
  return mockTemplates.find((template) => template.templateCode === code);
};

export const getMockTemplatesByAgent = (agentCode: string): ITemplate[] => {
  return mockTemplates.filter((template) => template.agentCode === agentCode);
};
