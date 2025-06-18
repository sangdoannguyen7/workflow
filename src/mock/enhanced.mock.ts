import { API_CONFIG, mockDelay, apiLogger } from "../config/api.config";

// Enhanced mock data
export const mockWorkflows = [
  {
    workflowId: 1,
    workflowCode: "WF_USER_REG",
    workflowName: "User Registration Flow",
    description: "Complete user registration workflow with email verification",
    statusCode: "ACTIVE",
    statusName: "Active",
    version: "1.2.0",
    nodes: [
      {
        nodeId: 1,
        nodeCode: "NODE_EMAIL_VERIFY",
        nodeName: "Email Verification",
        templateCode: "TPL_EMAIL",
        templateName: "Email Template",
        agentCode: "AGENT_EMAIL",
        agentName: "Email Service",
        statusCode: "ACTIVE",
        statusName: "Active",
      },
    ],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
  },
  {
    workflowId: 2,
    workflowCode: "WF_PAYMENT",
    workflowName: "Payment Processing",
    description: "Handle payment transactions and confirmations",
    statusCode: "ACTIVE",
    statusName: "Active",
    version: "2.1.0",
    nodes: [
      {
        nodeId: 2,
        nodeCode: "NODE_PAYMENT_GATEWAY",
        nodeName: "Payment Gateway",
        templateCode: "TPL_PAYMENT",
        templateName: "Payment Template",
        agentCode: "AGENT_PAYMENT",
        agentName: "Payment Service",
        statusCode: "ACTIVE",
        statusName: "Active",
      },
    ],
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-22T11:20:00Z",
  },
  {
    workflowId: 3,
    workflowCode: "WF_NOTIFICATION",
    workflowName: "Notification System",
    description: "Send notifications via multiple channels",
    statusCode: "DRAFT",
    statusName: "Draft",
    version: "1.0.0",
    nodes: [],
    createdAt: "2024-01-25T16:00:00Z",
    updatedAt: "2024-01-25T16:00:00Z",
  },
];

export const mockTemplates = [
  {
    templateId: 1,
    templateCode: "TPL_EMAIL_WELCOME",
    templateName: "Welcome Email Template",
    templateType: "webhook",
    typeCode: "webhook",
    typeName: "Webhook",
    agentCode: "AGENT_EMAIL",
    agentName: "Email Service Agent",
    statusCode: "ACTIVE",
    statusName: "Active",
    description: "Send welcome email to new users",
    metadata: '{"sender": "noreply@company.com"}',
    workflowCode: "WF_USER_REG",
    workflowName: "User Registration Flow",
  },
  {
    templateId: 2,
    templateCode: "TPL_SMS_OTP",
    templateName: "SMS OTP Template",
    templateType: "restapi",
    typeCode: "restapi",
    typeName: "REST API",
    agentCode: "AGENT_SMS",
    agentName: "SMS Service Agent",
    statusCode: "ACTIVE",
    statusName: "Active",
    description: "Send OTP via SMS",
    metadata: '{"provider": "twilio"}',
    workflowCode: "WF_USER_REG",
    workflowName: "User Registration Flow",
  },
  {
    templateId: 3,
    templateCode: "TPL_PAYMENT_NOTIFY",
    templateName: "Payment Notification",
    templateType: "schedule",
    typeCode: "schedule",
    typeName: "Schedule",
    agentCode: "AGENT_PAYMENT",
    agentName: "Payment Service Agent",
    statusCode: "ACTIVE",
    statusName: "Active",
    description: "Scheduled payment status notifications",
    metadata: '{"frequency": "daily"}',
    workflowCode: "WF_PAYMENT",
    workflowName: "Payment Processing",
  },
];

export const mockAgents = [
  {
    agentId: 1,
    agentCode: "AGENT_EMAIL",
    agentName: "Email Service Agent",
    description: "Handles all email-related operations",
    statusCode: "ACTIVE",
    statusName: "Active",
    endpoint: "https://api.emailservice.com",
    lastPing: new Date().toISOString(),
    isOnline: true,
  },
  {
    agentId: 2,
    agentCode: "AGENT_SMS",
    agentName: "SMS Service Agent",
    description: "Manages SMS and text message services",
    statusCode: "ACTIVE",
    statusName: "Active",
    endpoint: "https://api.smsservice.com",
    lastPing: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    isOnline: true,
  },
  {
    agentId: 3,
    agentCode: "AGENT_PAYMENT",
    agentName: "Payment Service Agent",
    description: "Processing payment transactions",
    statusCode: "INACTIVE",
    statusName: "Inactive",
    endpoint: "https://api.paymentservice.com",
    lastPing: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
    isOnline: false,
  },
];

export const mockNodes = [
  {
    nodeId: 1,
    nodeCode: "NODE_EMAIL_VERIFY",
    nodeName: "Email Verification Node",
    description: "Verify user email address",
    templateCode: "TPL_EMAIL_WELCOME",
    templateName: "Welcome Email Template",
    agentCode: "AGENT_EMAIL",
    agentName: "Email Service Agent",
    statusCode: "ACTIVE",
    statusName: "Active",
  },
  {
    nodeId: 2,
    nodeCode: "NODE_SMS_OTP",
    nodeName: "SMS OTP Node",
    description: "Send OTP via SMS",
    templateCode: "TPL_SMS_OTP",
    templateName: "SMS OTP Template",
    agentCode: "AGENT_SMS",
    agentName: "SMS Service Agent",
    statusCode: "ACTIVE",
    statusName: "Active",
  },
];

export const mockNotifications = [
  {
    id: 1,
    title: 'Workflow "User Registration" completed successfully',
    message: "Processed 1,234 new user registrations",
    type: "success",
    category: "workflow",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    read: false,
    priority: "medium",
  },
  {
    id: 2,
    title: 'Agent "Payment Service" is offline',
    message: "Payment service agent has been offline for 15 minutes",
    type: "error",
    category: "system",
    timestamp: new Date(Date.now() - 900000).toISOString(),
    read: false,
    priority: "high",
  },
  {
    id: 3,
    title: "New template created",
    message: 'Template "Email Welcome" has been added to the system',
    type: "info",
    category: "template",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    read: true,
    priority: "low",
  },
  {
    id: 4,
    title: "System maintenance scheduled",
    message: "Scheduled maintenance on Sunday 2AM - 4AM",
    type: "warning",
    category: "system",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: true,
    priority: "medium",
  },
  {
    id: 5,
    title: "Workflow test completed",
    message: "Test execution finished with 98.5% success rate",
    type: "success",
    category: "workflow",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: false,
    priority: "low",
  },
];

export const mockUserProfile = {
  id: 1,
  username: "admin",
  email: "admin@workflow.com",
  fullName: "Nguyễn Thanh Sang",
  firstName: "Sang",
  lastName: "Nguyễn Thanh",
  phone: "+84 123 456 789",
  role: "System Administrator",
  department: "IT Development",
  avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=3",
  lastLogin: new Date().toISOString(),
  createdAt: "2023-01-15T10:30:00Z",
  preferences: {
    theme: "light",
    language: "vi",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    dashboard: {
      autoRefresh: true,
      refreshInterval: 30000,
    },
  },
  permissions: [
    "workflow.create",
    "workflow.edit",
    "workflow.delete",
    "template.manage",
    "agent.manage",
    "system.admin",
  ],
};

export const mockSystemSettings = {
  general: {
    siteName: "WorkFlow Admin",
    siteDescription: "Advanced Workflow Management System",
    timezone: "Asia/Ho_Chi_Minh",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
  },
  api: {
    timeout: 30000,
    retryAttempts: 3,
    rateLimitPerMinute: 100,
  },
  security: {
    sessionTimeout: 3600000,
    passwordMinLength: 8,
    requireTwoFactor: false,
    allowRememberMe: true,
  },
  notifications: {
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: true,
    defaultSender: "noreply@workflow.com",
  },
  workflow: {
    maxNodesPerWorkflow: 50,
    maxExecutionTime: 300000,
    autoSaveInterval: 30000,
    enableVersioning: true,
  },
};

// Mock API functions
export class MockAPI {
  static async request<T>(
    endpoint: string,
    options: any = {},
    mockData: T,
    delay: number = API_CONFIG.MOCK_DELAY
  ): Promise<T> {
    if (!API_CONFIG.USE_MOCK) {
      // Here you would make the actual API call
      throw new Error("Real API not implemented yet");
    }

    apiLogger(`Mock request to ${endpoint}`, options);
    await mockDelay(delay);

    // Simulate occasional errors
    if (Math.random() < 0.05) {
      // 5% chance of error
      throw new Error("Mock API Error: Network timeout");
    }

    return mockData;
  }

  static async getWorkflows(params: any = {}) {
    const filteredData = mockWorkflows.filter((workflow) => {
      if (params.search) {
        return (
          workflow.workflowName
            .toLowerCase()
            .includes(params.search.toLowerCase()) ||
          workflow.workflowCode
            .toLowerCase()
            .includes(params.search.toLowerCase())
        );
      }
      return true;
    });

    return this.request(
      "/workflows",
      { method: "GET", params },
      {
        success: true,
        data: filteredData,
        total: filteredData.length,
        current: params.current || 1,
        pageSize: params.pageSize || 20,
      }
    );
  }

  static async getTemplates(params: any = {}) {
    let filteredData = mockTemplates.filter((template) => {
      if (params.search) {
        return (
          template.templateName
            .toLowerCase()
            .includes(params.search.toLowerCase()) ||
          template.templateCode
            .toLowerCase()
            .includes(params.search.toLowerCase())
        );
      }
      if (params.agentCode) {
        return template.agentCode === params.agentCode;
      }
      return true;
    });

    return this.request(
      "/templates",
      { method: "GET", params },
      {
        success: true,
        data: filteredData,
        total: filteredData.length,
        current: params.current || 1,
        pageSize: params.pageSize || 20,
      }
    );
  }

  static async getAgents(params: any = {}) {
    return this.request(
      "/agents",
      { method: "GET", params },
      {
        success: true,
        data: mockAgents,
        total: mockAgents.length,
      }
    );
  }

  static async getNodes(params: any = {}) {
    return this.request(
      "/nodes",
      { method: "GET", params },
      {
        success: true,
        data: mockNodes,
        total: mockNodes.length,
      }
    );
  }

  static async getNotifications() {
    return this.request(
      "/notifications",
      { method: "GET" },
      {
        success: true,
        data: mockNotifications,
        unreadCount: mockNotifications.filter((n) => !n.read).length,
      }
    );
  }

  static async getUserProfile() {
    return this.request(
      "/user/profile",
      { method: "GET" },
      {
        success: true,
        data: mockUserProfile,
      }
    );
  }

  static async getSystemSettings() {
    return this.request(
      "/system/settings",
      { method: "GET" },
      {
        success: true,
        data: mockSystemSettings,
      }
    );
  }

  // Create/Update operations
  static async createWorkflow(data: any) {
    const newWorkflow = {
      ...data,
      workflowId: mockWorkflows.length + 1,
      workflowCode: data.workflowCode || `WF_${Date.now()}`,
      nodes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockWorkflows.push(newWorkflow);

    return this.request(
      "/workflows",
      { method: "POST", data },
      {
        success: true,
        data: newWorkflow,
      }
    );
  }

  static async updateWorkflow(code: string, data: any) {
    const index = mockWorkflows.findIndex((w) => w.workflowCode === code);
    if (index >= 0) {
      mockWorkflows[index] = {
        ...mockWorkflows[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
    }

    return this.request(
      `/workflows/${code}`,
      { method: "PUT", data },
      {
        success: true,
        data: mockWorkflows[index],
      }
    );
  }

  static async deleteWorkflow(code: string) {
    const index = mockWorkflows.findIndex((w) => w.workflowCode === code);
    if (index >= 0) {
      mockWorkflows.splice(index, 1);
    }

    return this.request(
      `/workflows/${code}`,
      { method: "DELETE" },
      {
        success: true,
      }
    );
  }

  static async markNotificationAsRead(id: number) {
    const notification = mockNotifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
    }

    return this.request(
      `/notifications/${id}/read`,
      { method: "PUT" },
      {
        success: true,
      }
    );
  }

  static async updateUserProfile(data: any) {
    Object.assign(mockUserProfile, data);

    return this.request(
      "/user/profile",
      { method: "PUT", data },
      {
        success: true,
        data: mockUserProfile,
      }
    );
  }

  static async updateSystemSettings(data: any) {
    Object.assign(mockSystemSettings, data);

    return this.request(
      "/system/settings",
      { method: "PUT", data },
      {
        success: true,
        data: mockSystemSettings,
      }
    );
  }
}
