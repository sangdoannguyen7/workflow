import { ITemplate, ITemplateResponse } from "../interface/template.interface";

export const mockTemplates: ITemplate[] = [
  // TRIGGER Templates (chỉ có output)
  {
    templateId: 1,
    templateCode: "WEBHOOK_RECEIVE",
    templateName: "Webhook Receiver",
    typeCode: "TRIGGER",
    typeName: "Trigger Template",
    agentCode: "WEBHOOK_AGENT",
    agentName: "Webhook Processing Agent",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    templateType: "trigger",
    description: "Nhận webhook từ hệ thống bên ngoài để khởi động workflow",
    search: "webhook receiver trigger template hoạt động",
    metadata:
      '{"endpoint": "/webhook", "method": "POST", "nodeType": "trigger"}',
    info: "Trigger node - chỉ có thể làm điểm bắt đầu workflow, không nhận input từ node khác",
    schema:
      '{"type": "object", "properties": {"event": {"type": "string"}, "data": {"type": "object"}}}',
    body: '{"event": "{{event}}", "timestamp": "{{timestamp}}", "data": "{{data}}"}',
    rule: '{"validation": ["required:event", "required:data"], "nodeType": "trigger"}',
    configuration:
      '{"timeout": 30000, "retries": 3, "allowInputs": false, "allowOutputs": true}',
  },
  {
    templateId: 2,
    templateCode: "SCHEDULE_TRIGGER",
    templateName: "Schedule Trigger",
    typeCode: "TRIGGER",
    typeName: "Trigger Template",
    agentCode: "SCHEDULE_AGENT",
    agentName: "Schedule Task Agent",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    templateType: "trigger",
    description: "Khởi động workflow theo lịch trình định sẵn",
    search: "schedule trigger template cron hoạt động",
    metadata:
      '{"cron": "0 0 * * *", "timezone": "Asia/Ho_Chi_Minh", "nodeType": "trigger"}',
    info: "Trigger node - tự động khởi động workflow theo thời gian, không cần input",
    schema:
      '{"type": "object", "properties": {"schedule": {"type": "string"}, "timezone": {"type": "string"}}}',
    body: '{"schedule": "{{cron}}", "timezone": "{{timezone}}", "execution_time": "{{execution_time}}"}',
    rule: '{"execution": ["scheduled"], "retry_policy": "exponential_backoff", "nodeType": "trigger"}',
    configuration:
      '{"max_execution_time": 3600000, "retry_count": 5, "allowInputs": false, "allowOutputs": true}',
  },

  // BEHAVIOR Templates (có thể có cả input và output)
  {
    templateId: 3,
    templateCode: "API_GET_DATA",
    templateName: "REST API Get Data",
    typeCode: "BEHAVIOR",
    typeName: "Behavior Template",
    agentCode: "API_AGENT",
    agentName: "REST API Agent",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    templateType: "behavior",
    description: "Gọi REST API để lấy dữ liệu từ hệ thống bên ngoài",
    search: "rest api get data behavior template hoạt động",
    metadata:
      '{"method": "GET", "content_type": "application/json", "nodeType": "behavior"}',
    info: "Behavior node - có thể nhận input từ trigger/behavior khác và tạo output cho node tiếp theo",
    schema:
      '{"type": "object", "properties": {"url": {"type": "string"}, "headers": {"type": "object"}}}',
    body: '{"url": "{{api_url}}", "headers": {"Authorization": "Bearer {{token}}"}}',
    rule: '{"http_method": "GET", "response_format": "json", "nodeType": "behavior"}',
    configuration:
      '{"timeout": 10000, "follow_redirects": true, "allowInputs": true, "allowOutputs": true}',
  },
  {
    templateId: 4,
    templateCode: "DATA_TRANSFORM",
    templateName: "Data Transformation",
    typeCode: "BEHAVIOR",
    typeName: "Behavior Template",
    agentCode: "DATA_AGENT",
    agentName: "Data Processing Agent",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    templateType: "behavior",
    description: "Biến đổi và xử lý dữ liệu theo logic nghiệp vụ",
    search: "data transformation behavior processing template hoạt động",
    metadata: '{"processing_type": "transform", "nodeType": "behavior"}',
    info: "Behavior node - xử lý và biến đổi dữ liệu, có thể nhận nhiều input và tạo output",
    schema:
      '{"type": "object", "properties": {"input_data": {"type": "object"}, "transform_rules": {"type": "array"}}}',
    body: '{"input_data": "{{input}}", "transform_rules": "{{rules}}", "output_format": "{{format}}"}',
    rule: '{"processing": ["transform", "validate"], "nodeType": "behavior"}',
    configuration:
      '{"max_processing_time": 30000, "error_handling": "continue", "allowInputs": true, "allowOutputs": true}',
  },
  {
    templateId: 5,
    templateCode: "CONDITION_CHECK",
    templateName: "Condition Logic",
    typeCode: "BEHAVIOR",
    typeName: "Behavior Template",
    agentCode: "LOGIC_AGENT",
    agentName: "Logic Processing Agent",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    templateType: "behavior",
    description: "Kiểm tra điều kiện và phân luồng workflow theo logic",
    search: "condition logic behavior branching template hoạt động",
    metadata: '{"logic_type": "conditional", "nodeType": "behavior"}',
    info: "Behavior node - kiểm tra điều kiện và phân nhánh, có thể có nhiều output path",
    schema:
      '{"type": "object", "properties": {"conditions": {"type": "array"}, "default_path": {"type": "string"}}}',
    body: '{"conditions": "{{conditions}}", "input_data": "{{input}}", "evaluation": "{{logic}}"}',
    rule: '{"evaluation": "boolean", "branching": true, "nodeType": "behavior"}',
    configuration:
      '{"timeout": 5000, "default_behavior": "pass_through", "allowInputs": true, "allowOutputs": true}',
  },

  // OUTPUT Templates (chỉ có input)
  {
    templateId: 6,
    templateCode: "WEBHOOK_SEND",
    templateName: "Webhook Sender",
    typeCode: "OUTPUT",
    typeName: "Output Template",
    agentCode: "WEBHOOK_AGENT",
    agentName: "Webhook Processing Agent",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    templateType: "output",
    description: "Gửi kết quả workflow đến webhook endpoint bên ngoài",
    search: "webhook sender output template notification hoạt động",
    metadata:
      '{"method": "POST", "content_type": "application/json", "nodeType": "output"}',
    info: "Output node - nhận dữ liệu từ các node trước và gửi ra ngoài, không có output",
    schema:
      '{"type": "object", "properties": {"webhook_url": {"type": "string"}, "payload": {"type": "object"}}}',
    body: '{"webhook_url": "{{target_url}}", "payload": "{{data}}", "signature": "{{signature}}"}',
    rule: '{"delivery": "immediate", "signature_required": true, "nodeType": "output"}',
    configuration:
      '{"timeout": 5000, "retries": 3, "retry_delay": 1000, "allowInputs": true, "allowOutputs": false}',
  },
  {
    templateId: 7,
    templateCode: "EMAIL_SEND",
    templateName: "Email Notification",
    typeCode: "OUTPUT",
    typeName: "Output Template",
    agentCode: "NOTIFY_AGENT",
    agentName: "Notification Agent",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    templateType: "output",
    description: "Gửi email thông báo với kết quả workflow",
    search: "email notification output template send hoạt động",
    metadata: '{"email_type": "notification", "nodeType": "output"}',
    info: "Output node - gửi email thông báo, chỉ nhận input không tạo output tiếp theo",
    schema:
      '{"type": "object", "properties": {"recipients": {"type": "array"}, "subject": {"type": "string"}, "body": {"type": "string"}}}',
    body: '{"recipients": "{{emails}}", "subject": "{{subject}}", "body": "{{content}}", "attachments": "{{files}}"}',
    rule: '{"delivery": "email", "template_support": true, "nodeType": "output"}',
    configuration:
      '{"timeout": 15000, "template_engine": "handlebars", "allowInputs": true, "allowOutputs": false}',
  },
  {
    templateId: 8,
    templateCode: "DATABASE_SAVE",
    templateName: "Database Save",
    typeCode: "OUTPUT",
    typeName: "Output Template",
    agentCode: "DATA_AGENT",
    agentName: "Data Processing Agent",
    statusCode: "DRAFT",
    statusName: "Bản nháp",
    templateType: "output",
    description: "Lưu kết quả workflow vào database",
    search: "database save output template storage bản nháp",
    metadata: '{"storage_type": "database", "nodeType": "output"}',
    info: "Output node - lưu dữ liệu vào database, kết thúc workflow",
    schema:
      '{"type": "object", "properties": {"table": {"type": "string"}, "data": {"type": "object"}}}',
    body: '{"table": "{{table_name}}", "data": "{{payload}}", "operation": "insert"}',
    rule: '{"storage": "persistent", "validation": true, "nodeType": "output"}',
    configuration:
      '{"timeout": 10000, "transaction": true, "allowInputs": true, "allowOutputs": false}',
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

  if (params?.typeCode) {
    filteredTemplates = filteredTemplates.filter(
      (template) => template.typeCode === params.typeCode
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
    first: page === 0,
    last: end >= filteredTemplates.length,
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

export const getMockTemplatesByType = (templateType: string): ITemplate[] => {
  return mockTemplates.filter(
    (template) => template.templateType === templateType
  );
};

// CRUD Operations cho Template
export const createMockTemplate = (template: Partial<ITemplate>): ITemplate => {
  const newId = Math.max(...mockTemplates.map((t) => t.templateId || 0)) + 1;
  const newTemplate: ITemplate = {
    templateId: newId,
    templateCode: template.templateCode || `TEMPLATE_${newId}`,
    templateName: template.templateName || `New Template ${newId}`,
    typeCode: template.typeCode || "BEHAVIOR",
    typeName: template.typeName || "Behavior Template",
    agentCode: template.agentCode || "DEFAULT_AGENT",
    agentName: template.agentName || "Default Agent",
    statusCode: template.statusCode || "DRAFT",
    statusName: template.statusName || "Bản nháp",
    templateType: template.templateType || "behavior",
    description: template.description || "New template description",
    search:
      template.search || `${template.templateName} ${template.templateType}`,
    metadata: template.metadata || "{}",
    info: template.info || "New template information",
    schema: template.schema || "{}",
    body: template.body || "{}",
    rule: template.rule || "{}",
    configuration: template.configuration || "{}",
  };

  mockTemplates.push(newTemplate);
  return newTemplate;
};

export const updateMockTemplate = (
  id: number,
  updates: Partial<ITemplate>
): ITemplate | null => {
  const index = mockTemplates.findIndex((t) => t.templateId === id);
  if (index === -1) return null;

  mockTemplates[index] = { ...mockTemplates[index], ...updates };
  return mockTemplates[index];
};

export const deleteMockTemplate = (id: number): boolean => {
  const index = mockTemplates.findIndex((t) => t.templateId === id);
  if (index === -1) return false;

  mockTemplates.splice(index, 1);
  return true;
};
