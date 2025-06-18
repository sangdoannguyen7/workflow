import {
  IWorkflow,
  IWorkflowSearchParams,
  IWorkflowDesign,
} from "../interface/workflow.interface";
import { ITemplate } from "../interface/template.interface";
import { IAgent } from "../interface/agent.interface";

// Enhanced mock workflow data
export const mockWorkflows: IWorkflow[] = [
  {
    workflowId: 1,
    workflowCode: "WF_USER_REGISTRATION",
    workflowName: "User Registration Flow",
    statusCode: "ACTIVE",
    statusName: "Active",
    description:
      "Complete user registration workflow with email verification and profile setup",
    version: "v1.2.0",
    nodes: [
      {
        nodeId: 1,
        nodeCode: "NODE_VALIDATE_INPUT",
        nodeName: "Validate User Input",
        templateCode: "TMPL_VALIDATION",
        templateName: "Input Validation",
        agentCode: "AGT_VALIDATOR",
        agentName: "Validation Agent",
        statusCode: "ACTIVE",
        statusName: "Active",
        order: 1,
        position: { x: 100, y: 100 },
        config: {
          rules: ["email", "password", "required_fields"],
          timeout: 5000,
        },
      },
      {
        nodeId: 2,
        nodeCode: "NODE_CREATE_USER",
        nodeName: "Create User Account",
        templateCode: "TMPL_USER_CREATE",
        templateName: "User Creation",
        agentCode: "AGT_DATABASE",
        agentName: "Database Agent",
        statusCode: "ACTIVE",
        statusName: "Active",
        order: 2,
        position: { x: 300, y: 100 },
        config: {
          table: "users",
          timeout: 10000,
        },
      },
      {
        nodeId: 3,
        nodeCode: "NODE_SEND_EMAIL",
        nodeName: "Send Welcome Email",
        templateCode: "TMPL_EMAIL_WELCOME",
        templateName: "Welcome Email",
        agentCode: "AGT_EMAIL",
        agentName: "Email Agent",
        statusCode: "ACTIVE",
        statusName: "Active",
        order: 3,
        position: { x: 500, y: 100 },
        config: {
          template: "welcome_email",
          timeout: 15000,
        },
      },
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    workflowId: 2,
    workflowCode: "WF_PAYMENT_PROCESSING",
    workflowName: "Payment Processing Workflow",
    statusCode: "ACTIVE",
    statusName: "Active",
    description:
      "Secure payment processing with fraud detection and notifications",
    version: "v2.1.0",
    nodes: [
      {
        nodeId: 4,
        nodeCode: "NODE_FRAUD_CHECK",
        nodeName: "Fraud Detection",
        templateCode: "TMPL_FRAUD_DETECT",
        templateName: "Fraud Detection",
        agentCode: "AGT_SECURITY",
        agentName: "Security Agent",
        statusCode: "ACTIVE",
        statusName: "Active",
        order: 1,
        position: { x: 150, y: 150 },
        config: {
          threshold: 0.8,
          timeout: 3000,
        },
      },
      {
        nodeId: 5,
        nodeCode: "NODE_PROCESS_PAYMENT",
        nodeName: "Process Payment",
        templateCode: "TMPL_PAYMENT",
        templateName: "Payment Gateway",
        agentCode: "AGT_PAYMENT",
        agentName: "Payment Agent",
        statusCode: "ACTIVE",
        statusName: "Active",
        order: 2,
        position: { x: 350, y: 150 },
        config: {
          gateway: "stripe",
          timeout: 30000,
        },
      },
    ],
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-22T16:45:00Z",
  },
  {
    workflowId: 3,
    workflowCode: "WF_DATA_SYNC",
    workflowName: "Data Synchronization",
    statusCode: "ACTIVE",
    statusName: "Active",
    description: "Automated data synchronization between systems",
    version: "v1.0.0",
    nodes: [
      {
        nodeId: 6,
        nodeCode: "NODE_EXTRACT_DATA",
        nodeName: "Extract Source Data",
        templateCode: "TMPL_DATA_EXTRACT",
        templateName: "Data Extraction",
        agentCode: "AGT_ETL",
        agentName: "ETL Agent",
        statusCode: "ACTIVE",
        statusName: "Active",
        order: 1,
        position: { x: 100, y: 200 },
        config: {
          source: "mysql",
          batch_size: 1000,
        },
      },
      {
        nodeId: 7,
        nodeCode: "NODE_TRANSFORM_DATA",
        nodeName: "Transform Data",
        templateCode: "TMPL_DATA_TRANSFORM",
        templateName: "Data Transformation",
        agentCode: "AGT_ETL",
        agentName: "ETL Agent",
        statusCode: "ACTIVE",
        statusName: "Active",
        order: 2,
        position: { x: 300, y: 200 },
        config: {
          rules: ["normalize", "validate", "enrich"],
        },
      },
      {
        nodeId: 8,
        nodeCode: "NODE_LOAD_DATA",
        nodeName: "Load Target Data",
        templateCode: "TMPL_DATA_LOAD",
        templateName: "Data Loading",
        agentCode: "AGT_ETL",
        agentName: "ETL Agent",
        statusCode: "ACTIVE",
        statusName: "Active",
        order: 3,
        position: { x: 500, y: 200 },
        config: {
          target: "postgresql",
          mode: "upsert",
        },
      },
    ],
    createdAt: "2024-01-05T12:00:00Z",
    updatedAt: "2024-01-18T10:15:00Z",
  },
  {
    workflowId: 4,
    workflowCode: "WF_EMAIL_CAMPAIGN",
    workflowName: "Email Marketing Campaign",
    statusCode: "DRAFT",
    statusName: "Draft",
    description:
      "Automated email marketing campaign with segmentation and analytics",
    version: "v1.0.0",
    nodes: [
      {
        nodeId: 9,
        nodeCode: "NODE_SEGMENT_USERS",
        nodeName: "Segment Users",
        templateCode: "TMPL_USER_SEGMENT",
        templateName: "User Segmentation",
        agentCode: "AGT_ANALYTICS",
        agentName: "Analytics Agent",
        statusCode: "ACTIVE",
        statusName: "Active",
        order: 1,
        position: { x: 150, y: 250 },
        config: {
          criteria: ["age", "location", "activity"],
        },
      },
    ],
    createdAt: "2024-01-20T09:00:00Z",
    updatedAt: "2024-01-20T09:00:00Z",
  },
  {
    workflowId: 5,
    workflowCode: "WF_BACKUP_SYSTEM",
    workflowName: "System Backup Workflow",
    statusCode: "ACTIVE",
    statusName: "Active",
    description: "Automated system backup and recovery workflow",
    version: "v3.0.0",
    nodes: [],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T22:00:00Z",
  },
];

// Mock workflow designs
export const mockWorkflowDesigns: Record<string, IWorkflowDesign> = {
  WF_USER_REGISTRATION: {
    workflowCode: "WF_USER_REGISTRATION",
    nodes: [
      {
        id: "node_1",
        position: { x: 100, y: 100 },
        data: {
          label: "Validate User Input",
          templateCode: "TMPL_VALIDATION",
          templateType: "process",
          agentCode: "AGT_VALIDATOR",
          description:
            "Validate user registration form data including email format and password strength",
          timeout: 5000,
          retries: 3,
          priority: "high",
        },
      },
      {
        id: "node_2",
        position: { x: 400, y: 100 },
        data: {
          label: "Create User Account",
          templateCode: "TMPL_USER_CREATE",
          templateType: "restapi",
          agentCode: "AGT_DATABASE",
          description:
            "Create new user account in database with encrypted password",
          timeout: 10000,
          retries: 2,
          priority: "high",
        },
      },
      {
        id: "node_3",
        position: { x: 700, y: 100 },
        data: {
          label: "Send Welcome Email",
          templateCode: "TMPL_EMAIL_WELCOME",
          templateType: "webhook",
          agentCode: "AGT_EMAIL",
          description: "Send personalized welcome email to new user",
          timeout: 15000,
          retries: 3,
          priority: "normal",
        },
      },
    ],
    edges: [
      {
        id: "edge_1",
        source: "node_1",
        target: "node_2",
        type: "default",
      },
      {
        id: "edge_2",
        source: "node_2",
        target: "node_3",
        type: "default",
      },
    ],
  },
  WF_PAYMENT_PROCESSING: {
    workflowCode: "WF_PAYMENT_PROCESSING",
    nodes: [
      {
        id: "node_1",
        position: { x: 150, y: 150 },
        data: {
          label: "Fraud Detection",
          templateCode: "TMPL_FRAUD_DETECT",
          templateType: "process",
          agentCode: "AGT_SECURITY",
          description: "AI-powered fraud detection and risk assessment",
          timeout: 3000,
          retries: 1,
          priority: "critical",
        },
      },
      {
        id: "node_2",
        position: { x: 450, y: 150 },
        data: {
          label: "Process Payment",
          templateCode: "TMPL_PAYMENT",
          templateType: "restapi",
          agentCode: "AGT_PAYMENT",
          description: "Process payment through secure gateway",
          timeout: 30000,
          retries: 3,
          priority: "critical",
        },
      },
      {
        id: "node_3",
        position: { x: 750, y: 150 },
        data: {
          label: "Send Receipt",
          templateCode: "TMPL_EMAIL_RECEIPT",
          templateType: "webhook",
          agentCode: "AGT_EMAIL",
          description: "Send payment receipt to customer",
          timeout: 10000,
          retries: 2,
          priority: "normal",
        },
      },
    ],
    edges: [
      {
        id: "edge_1",
        source: "node_1",
        target: "node_2",
        type: "default",
      },
      {
        id: "edge_2",
        source: "node_2",
        target: "node_3",
        type: "default",
      },
    ],
  },
};

// Mock templates for workflow builder
export const mockTemplatesForBuilder: ITemplate[] = [
  {
    templateId: 1,
    templateCode: "TMPL_VALIDATION",
    templateName: "Input Validation",
    templateType: "process",
    typeCode: "process",
    typeName: "Process",
    agentCode: "AGT_VALIDATOR",
    agentName: "Validation Agent",
    workflowCode: "",
    workflowName: "",
    statusCode: "ACTIVE",
    statusName: "Active",
    description: "Comprehensive input validation for forms and data entry",
    search: "validation input form data entry",
    metadata: JSON.stringify({ fields: ["email", "password", "required"] }),
    info: JSON.stringify({ version: "1.0", author: "System" }),
    schema: JSON.stringify({
      type: "object",
      properties: { email: { type: "string" } },
    }),
    body: "{{ data | validate }}",
    rule: JSON.stringify({ required: ["email"], format: { email: "email" } }),
    configuration: JSON.stringify({ timeout: 5000, retries: 3 }),
    outputCode: "validation_result",
  },
  {
    templateId: 2,
    templateCode: "TMPL_USER_CREATE",
    templateName: "User Creation",
    templateType: "restapi",
    typeCode: "restapi",
    typeName: "REST API",
    agentCode: "AGT_DATABASE",
    agentName: "Database Agent",
    workflowCode: "",
    workflowName: "",
    statusCode: "ACTIVE",
    statusName: "Active",
    description: "Create new user accounts in the database",
    search: "user create database account registration",
    metadata: JSON.stringify({ table: "users", primary_key: "user_id" }),
    info: JSON.stringify({ version: "2.0", author: "System" }),
    schema: JSON.stringify({
      type: "object",
      properties: { username: { type: "string" } },
    }),
    body: "INSERT INTO users (username, email, password) VALUES ({{username}}, {{email}}, {{password}})",
    rule: JSON.stringify({ unique: ["email", "username"] }),
    configuration: JSON.stringify({ timeout: 10000, connection: "primary_db" }),
    outputCode: "user_id",
  },
  {
    templateId: 3,
    templateCode: "TMPL_EMAIL_WELCOME",
    templateName: "Welcome Email",
    templateType: "webhook",
    typeCode: "webhook",
    typeName: "Webhook",
    agentCode: "AGT_EMAIL",
    agentName: "Email Agent",
    workflowCode: "",
    workflowName: "",
    statusCode: "ACTIVE",
    statusName: "Active",
    description: "Send personalized welcome emails to new users",
    search: "email welcome notification user onboarding",
    metadata: JSON.stringify({ template: "welcome", provider: "sendgrid" }),
    info: JSON.stringify({ version: "1.5", author: "Marketing Team" }),
    schema: JSON.stringify({
      type: "object",
      properties: { email: { type: "string" }, name: { type: "string" } },
    }),
    body: "Welcome {{name}}! Thank you for joining our platform.",
    rule: JSON.stringify({ required: ["email"], personalization: true }),
    configuration: JSON.stringify({
      timeout: 15000,
      template_id: "welcome_v2",
    }),
    outputCode: "email_sent",
  },
  {
    templateId: 4,
    templateCode: "TMPL_FRAUD_DETECT",
    templateName: "Fraud Detection",
    templateType: "process",
    typeCode: "process",
    typeName: "Process",
    agentCode: "AGT_SECURITY",
    agentName: "Security Agent",
    workflowCode: "",
    workflowName: "",
    statusCode: "ACTIVE",
    statusName: "Active",
    description: "AI-powered fraud detection and risk assessment",
    search: "fraud detection security risk assessment ai ml",
    metadata: JSON.stringify({ model: "fraud_detector_v3", threshold: 0.8 }),
    info: JSON.stringify({ version: "3.0", author: "Security Team" }),
    schema: JSON.stringify({
      type: "object",
      properties: { transaction_amount: { type: "number" } },
    }),
    body: "{{ transaction | fraud_check }}",
    rule: JSON.stringify({
      threshold: 0.8,
      factors: ["amount", "location", "frequency"],
    }),
    configuration: JSON.stringify({
      timeout: 3000,
      model_endpoint: "/api/fraud-detect",
    }),
    outputCode: "risk_score",
  },
  {
    templateId: 5,
    templateCode: "TMPL_PAYMENT",
    templateName: "Payment Gateway",
    templateType: "restapi",
    typeCode: "restapi",
    typeName: "REST API",
    agentCode: "AGT_PAYMENT",
    agentName: "Payment Agent",
    workflowCode: "",
    workflowName: "",
    statusCode: "ACTIVE",
    statusName: "Active",
    description: "Process payments through secure payment gateway",
    search: "payment gateway stripe paypal transaction processing",
    metadata: JSON.stringify({ gateway: "stripe", currency: "USD" }),
    info: JSON.stringify({ version: "2.5", author: "Finance Team" }),
    schema: JSON.stringify({
      type: "object",
      properties: { amount: { type: "number" }, currency: { type: "string" } },
    }),
    body: "{{ payment | process_stripe }}",
    rule: JSON.stringify({
      min_amount: 0.5,
      max_amount: 10000,
      currencies: ["USD", "EUR"],
    }),
    configuration: JSON.stringify({ timeout: 30000, gateway: "stripe_live" }),
    outputCode: "payment_id",
  },
  {
    templateId: 6,
    templateCode: "TMPL_DATA_EXTRACT",
    templateName: "Data Extraction",
    templateType: "schedule",
    typeCode: "schedule",
    typeName: "Schedule",
    agentCode: "AGT_ETL",
    agentName: "ETL Agent",
    workflowCode: "",
    workflowName: "",
    statusCode: "ACTIVE",
    statusName: "Active",
    description: "Extract data from various sources for ETL pipeline",
    search: "data extract etl pipeline database migration",
    metadata: JSON.stringify({ sources: ["mysql", "postgresql", "mongodb"] }),
    info: JSON.stringify({ version: "1.8", author: "Data Team" }),
    schema: JSON.stringify({
      type: "object",
      properties: { source: { type: "string" } },
    }),
    body: "SELECT * FROM {{table}} WHERE updated_at > {{last_sync}}",
    rule: JSON.stringify({ batch_size: 1000, incremental: true }),
    configuration: JSON.stringify({ timeout: 60000, schedule: "0 */6 * * *" }),
    outputCode: "extracted_records",
  },
];

// Mock agents for workflow builder
export const mockAgentsForBuilder: IAgent[] = [
  {
    agentId: 1,
    agentCode: "AGT_VALIDATOR",
    agentName: "Validation Agent",
    statusCode: "ACTIVE",
    statusName: "Active",
    description:
      "Handles all validation operations including form validation, data validation, and business rule validation",
  },
  {
    agentId: 2,
    agentCode: "AGT_DATABASE",
    agentName: "Database Agent",
    statusCode: "ACTIVE",
    statusName: "Active",
    description:
      "Manages database operations including CRUD operations, transactions, and data migrations",
  },
  {
    agentId: 3,
    agentCode: "AGT_EMAIL",
    agentName: "Email Agent",
    statusCode: "ACTIVE",
    statusName: "Active",
    description:
      "Handles email communications including transactional emails, newsletters, and notifications",
  },
  {
    agentId: 4,
    agentCode: "AGT_SECURITY",
    agentName: "Security Agent",
    statusCode: "ACTIVE",
    statusName: "Active",
    description:
      "Provides security services including fraud detection, risk assessment, and security monitoring",
  },
  {
    agentId: 5,
    agentCode: "AGT_PAYMENT",
    agentName: "Payment Agent",
    statusCode: "ACTIVE",
    statusName: "Active",
    description:
      "Processes payments through various gateways including Stripe, PayPal, and bank transfers",
  },
  {
    agentId: 6,
    agentCode: "AGT_ETL",
    agentName: "ETL Agent",
    statusCode: "ACTIVE",
    statusName: "Active",
    description:
      "Handles Extract, Transform, Load operations for data pipeline and synchronization",
  },
  {
    agentId: 7,
    agentCode: "AGT_ANALYTICS",
    agentName: "Analytics Agent",
    statusCode: "ACTIVE",
    statusName: "Active",
    description:
      "Provides analytics and reporting capabilities including user segmentation and behavioral analysis",
  },
];

// Mock API functions
export const WorkflowMockAPI = {
  getWorkflows: async (params?: IWorkflowSearchParams) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredWorkflows = [...mockWorkflows];

    if (params?.search) {
      filteredWorkflows = filteredWorkflows.filter(
        (w) =>
          w.workflowName.toLowerCase().includes(params.search!.toLowerCase()) ||
          w.workflowCode.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    if (params?.statusCode) {
      filteredWorkflows = filteredWorkflows.filter(
        (w) => w.statusCode === params.statusCode
      );
    }

    const start = ((params?.current || 1) - 1) * (params?.pageSize || 20);
    const end = start + (params?.pageSize || 20);
    const paginatedData = filteredWorkflows.slice(start, end);

    return {
      success: true,
      data: paginatedData,
      total: filteredWorkflows.length,
      current: params?.current || 1,
      pageSize: params?.pageSize || 20,
    };
  },

  createWorkflow: async (workflow: Partial<IWorkflow>) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newWorkflow: IWorkflow = {
      workflowId: Date.now(),
      workflowCode: workflow.workflowCode!,
      workflowName: workflow.workflowName!,
      statusCode: workflow.statusCode || "DRAFT",
      statusName: workflow.statusName || "Draft",
      description: workflow.description || "",
      version: workflow.version || "v1.0.0",
      nodes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockWorkflows.push(newWorkflow);
    return { success: true, data: newWorkflow };
  },

  updateWorkflow: async (
    workflowCode: string,
    workflow: Partial<IWorkflow>
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const index = mockWorkflows.findIndex(
      (w) => w.workflowCode === workflowCode
    );
    if (index === -1) {
      throw new Error("Workflow not found");
    }

    mockWorkflows[index] = {
      ...mockWorkflows[index],
      ...workflow,
      updatedAt: new Date().toISOString(),
    };

    return { success: true, data: mockWorkflows[index] };
  },

  deleteWorkflow: async (workflowCode: string) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const index = mockWorkflows.findIndex(
      (w) => w.workflowCode === workflowCode
    );
    if (index === -1) {
      throw new Error("Workflow not found");
    }

    mockWorkflows.splice(index, 1);
    return { success: true };
  },

  getWorkflowDesign: async (workflowCode: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const design = mockWorkflowDesigns[workflowCode];
    if (!design) {
      throw new Error("Workflow design not found");
    }

    return design;
  },

  saveWorkflowDesign: async (workflowCode: string, design: IWorkflowDesign) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    mockWorkflowDesigns[workflowCode] = design;
    return { success: true };
  },

  getTemplatesForBuilder: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { success: true, data: mockTemplatesForBuilder };
  },

  getAgentsForBuilder: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { success: true, data: mockAgentsForBuilder };
  },
};
