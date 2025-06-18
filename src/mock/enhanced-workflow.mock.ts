import { IWorkflow, IWorkflowDesign } from "../interface/workflow.interface";
import { getMockNodesByWorkflow } from "./node.mock";

export const enhancedMockWorkflows: IWorkflow[] = [
  {
    workflowId: 1,
    workflowCode: "BOOKING_FLOW",
    workflowName: "Hotel Booking Workflow",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description:
      "Comprehensive hotel booking workflow with validation, payment processing, and confirmation",
    search: "hotel booking workflow validation payment confirmation hoạt động",
    nodes: [],
  },
  {
    workflowId: 2,
    workflowCode: "CUSTOMER_SERVICE_FLOW",
    workflowName: "Customer Service Automation",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description:
      "Automated customer service workflow with AI chatbot, ticket routing, and escalation management",
    search:
      "customer service automation chatbot ticket routing escalation hoạt động",
    nodes: [],
  },
  {
    workflowId: 3,
    workflowCode: "INVENTORY_SYNC_FLOW",
    workflowName: "Real-time Inventory Sync",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description:
      "Real-time synchronization of inventory data across multiple sales channels and systems",
    search: "inventory sync real-time sales channels integration hoạt động",
    nodes: [],
  },
  {
    workflowId: 4,
    workflowCode: "MARKETING_AUTOMATION",
    workflowName: "Marketing Campaign Automation",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description:
      "Automated marketing campaign management with lead scoring, email sequences, and analytics",
    search:
      "marketing automation campaign lead scoring email analytics hoạt động",
    nodes: [],
  },
  {
    workflowId: 5,
    workflowCode: "REPORT_GENERATOR",
    workflowName: "Advanced Report Generator",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description:
      "Automated report generation with data aggregation, visualization, and distribution",
    search:
      "report generator automation data aggregation visualization distribution hoạt động",
    nodes: [],
  },
  {
    workflowId: 6,
    workflowCode: "PAYMENT_PROCESSOR",
    workflowName: "Payment Processing Pipeline",
    statusCode: "DRAFT",
    statusName: "Bản nháp",
    description:
      "Secure payment processing with fraud detection, multiple gateway support, and reconciliation",
    search:
      "payment processing fraud detection gateway reconciliation bản nháp",
    nodes: [],
  },
  {
    workflowId: 7,
    workflowCode: "ORDER_FULFILLMENT",
    workflowName: "Order Fulfillment Automation",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description:
      "End-to-end order fulfillment from inventory check to shipping notification",
    search:
      "order fulfillment automation inventory shipping notification hoạt động",
    nodes: [],
  },
  {
    workflowId: 8,
    workflowCode: "DATA_BACKUP_FLOW",
    workflowName: "Automated Data Backup",
    statusCode: "INACTIVE",
    statusName: "Không hoạt động",
    description:
      "Automated backup workflow with compression, encryption, and cloud storage",
    search:
      "data backup automation compression encryption cloud storage không hoạt động",
    nodes: [],
  },
  {
    workflowId: 9,
    workflowCode: "QUALITY_ASSURANCE",
    workflowName: "Quality Assurance Testing",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description:
      "Automated quality assurance testing with regression tests and performance monitoring",
    search:
      "quality assurance testing regression performance monitoring hoạt động",
    nodes: [],
  },
  {
    workflowId: 10,
    workflowCode: "COMPLIANCE_CHECK",
    workflowName: "Compliance Monitoring",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description:
      "Continuous compliance monitoring with regulatory checks and audit trail generation",
    search:
      "compliance monitoring regulatory checks audit trail generation hoạt động",
    nodes: [],
  },
  {
    workflowId: 11,
    workflowCode: "DRAG_DROP_TEST",
    workflowName: "Drag & Drop Test Workflow",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description: "Test workflow for drag and drop functionality validation",
    search: "drag drop test workflow functionality validation hoạt động",
    nodes: [],
  },
  {
    workflowId: 12,
    workflowCode: "COMPLEX_WORKFLOW",
    workflowName: "Complex Multi-Branch Workflow",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description:
      "Complex workflow with multiple branches and decision points for testing",
    search: "complex multi-branch workflow decision points testing hoạt động",
    nodes: [],
  },
  {
    workflowId: 13,
    workflowCode: "SIMPLE_TEST",
    workflowName: "Simple Test Workflow",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description: "Simple two-node workflow for basic functionality testing",
    search: "simple test workflow basic functionality testing hoạt động",
    nodes: [],
  },
];

// Enhanced workflow designs for React Flow
export const enhancedWorkflowDesigns: { [key: string]: IWorkflowDesign } = {
  BOOKING_FLOW: {
    workflowCode: "BOOKING_FLOW",
    nodes: [
      {
        id: "start",
        position: { x: 50, y: 100 },
        data: {
          label: "Booking Request",
          nodeCode: "NODE_BOOKING_START",
          templateCode: "WEBHOOK_RECEIVE",
          agentCode: "WEBHOOK_AGENT",
          description: "Receive booking request from customer",
          templateType: "webhook",
          info: "Entry point for customer booking requests with customer data validation",
        },
      },
      {
        id: "validate",
        position: { x: 250, y: 100 },
        data: {
          label: "Validate Customer",
          nodeCode: "NODE_CUSTOMER_VALIDATE",
          templateCode: "API_GET_DATA",
          agentCode: "DATA_AGENT",
          description: "Validate customer information and eligibility",
          templateType: "restapi",
          info: "Checks customer identity, payment history, and eligibility for booking",
        },
      },
      {
        id: "check_availability",
        position: { x: 450, y: 100 },
        data: {
          label: "Check Availability",
          nodeCode: "NODE_AVAILABILITY_CHECK",
          templateCode: "API_GET_DATA",
          agentCode: "INVENTORY_AGENT",
          description: "Check room availability for requested dates",
          templateType: "restapi",
          info: "Real-time availability check with room type, pricing, and occupancy validation",
        },
      },
      {
        id: "calculate_price",
        position: { x: 650, y: 100 },
        data: {
          label: "Calculate Pricing",
          nodeCode: "NODE_PRICE_CALCULATE",
          templateCode: "CALCULATE_TEMPLATE",
          agentCode: "PRICING_AGENT",
          description: "Calculate total booking price with taxes and fees",
          templateType: "calculation",
          info: "Dynamic pricing calculation including seasonal rates, discounts, taxes, and additional fees",
        },
      },
      {
        id: "process_payment",
        position: { x: 450, y: 250 },
        data: {
          label: "Process Payment",
          nodeCode: "NODE_PAYMENT_PROCESS",
          templateCode: "PAYMENT_TEMPLATE",
          agentCode: "PAYMENT_AGENT",
          description: "Process customer payment securely",
          templateType: "payment",
          info: "Secure payment processing with fraud detection and multiple gateway support",
        },
      },
      {
        id: "confirm_booking",
        position: { x: 250, y: 250 },
        data: {
          label: "Confirm Booking",
          nodeCode: "NODE_BOOKING_CONFIRM",
          templateCode: "WEBHOOK_SEND",
          agentCode: "NOTIFY_AGENT",
          description: "Send booking confirmation to customer",
          templateType: "webhook",
          info: "Sends confirmation email with booking details, check-in instructions, and digital receipt",
        },
      },
    ],
    edges: [
      { id: "e1", source: "start", target: "validate", type: "default" },
      {
        id: "e2",
        source: "validate",
        target: "check_availability",
        type: "default",
      },
      {
        id: "e3",
        source: "check_availability",
        target: "calculate_price",
        type: "default",
      },
      {
        id: "e4",
        source: "calculate_price",
        target: "process_payment",
        type: "default",
      },
      {
        id: "e5",
        source: "process_payment",
        target: "confirm_booking",
        type: "default",
      },
    ],
    viewport: { x: 0, y: 0, zoom: 0.8 },
  },

  CUSTOMER_SERVICE_FLOW: {
    workflowCode: "CUSTOMER_SERVICE_FLOW",
    nodes: [
      {
        id: "ticket_received",
        position: { x: 50, y: 100 },
        data: {
          label: "Ticket Received",
          nodeCode: "NODE_TICKET_RECEIVE",
          templateCode: "WEBHOOK_RECEIVE",
          agentCode: "SUPPORT_AGENT",
          description: "Receive customer support ticket",
          templateType: "webhook",
          info: "Automated ticket intake from multiple channels: email, chat, phone, social media",
        },
      },
      {
        id: "categorize",
        position: { x: 250, y: 100 },
        data: {
          label: "AI Categorization",
          nodeCode: "NODE_AI_CATEGORIZE",
          templateCode: "AI_TEMPLATE",
          agentCode: "AI_AGENT",
          description: "Automatically categorize and prioritize ticket",
          templateType: "ai",
          info: "AI-powered categorization using NLP to determine urgency, department, and required expertise",
        },
      },
      {
        id: "auto_response",
        position: { x: 450, y: 50 },
        data: {
          label: "Auto Response",
          nodeCode: "NODE_AUTO_RESPONSE",
          templateCode: "TEMPLATE_RESPONSE",
          agentCode: "CHATBOT_AGENT",
          description: "Send automated response for common issues",
          templateType: "template",
          info: "Intelligent auto-response system with knowledge base integration and solution suggestions",
        },
      },
      {
        id: "route_agent",
        position: { x: 450, y: 150 },
        data: {
          label: "Route to Agent",
          nodeCode: "NODE_AGENT_ROUTE",
          templateCode: "ROUTING_TEMPLATE",
          agentCode: "ROUTING_AGENT",
          description: "Route complex issues to appropriate agent",
          templateType: "routing",
          info: "Smart routing based on agent expertise, workload, customer history, and availability",
        },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "ticket_received",
        target: "categorize",
        type: "default",
      },
      {
        id: "e2",
        source: "categorize",
        target: "auto_response",
        type: "default",
        data: { label: "Simple Issue" },
      },
      {
        id: "e3",
        source: "categorize",
        target: "route_agent",
        type: "default",
        data: { label: "Complex Issue" },
      },
    ],
    viewport: { x: 0, y: 0, zoom: 0.9 },
  },

  MARKETING_AUTOMATION: {
    workflowCode: "MARKETING_AUTOMATION",
    nodes: [
      {
        id: "lead_capture",
        position: { x: 50, y: 100 },
        data: {
          label: "Lead Capture",
          nodeCode: "NODE_LEAD_CAPTURE",
          templateCode: "FORM_TEMPLATE",
          agentCode: "MARKETING_AGENT",
          description: "Capture lead information from various sources",
          templateType: "form",
          info: "Multi-channel lead capture from websites, social media, events, and referrals",
        },
      },
      {
        id: "lead_scoring",
        position: { x: 250, y: 100 },
        data: {
          label: "Lead Scoring",
          nodeCode: "NODE_LEAD_SCORING",
          templateCode: "SCORING_TEMPLATE",
          agentCode: "AI_AGENT",
          description: "Score lead based on engagement and profile",
          templateType: "scoring",
          info: "AI-powered lead scoring using behavioral data, demographics, and engagement patterns",
        },
      },
      {
        id: "email_sequence",
        position: { x: 450, y: 50 },
        data: {
          label: "Email Nurturing",
          nodeCode: "NODE_EMAIL_SEQUENCE",
          templateCode: "EMAIL_TEMPLATE",
          agentCode: "EMAIL_AGENT",
          description: "Send personalized email sequences",
          templateType: "email",
          info: "Personalized email campaigns with dynamic content, A/B testing, and behavioral triggers",
        },
      },
      {
        id: "sales_handoff",
        position: { x: 450, y: 150 },
        data: {
          label: "Sales Handoff",
          nodeCode: "NODE_SALES_HANDOFF",
          templateCode: "CRM_TEMPLATE",
          agentCode: "CRM_AGENT",
          description: "Hand qualified leads to sales team",
          templateType: "crm",
          info: "Automated lead handoff to sales with complete lead history and recommended approach",
        },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "lead_capture",
        target: "lead_scoring",
        type: "default",
      },
      {
        id: "e2",
        source: "lead_scoring",
        target: "email_sequence",
        type: "default",
        data: { label: "Low Score" },
      },
      {
        id: "e3",
        source: "lead_scoring",
        target: "sales_handoff",
        type: "default",
        data: { label: "High Score" },
      },
    ],
    viewport: { x: 0, y: 0, zoom: 0.9 },
  },
};

export const getEnhancedMockWorkflows = (params?: any) => {
  let filteredWorkflows = [...enhancedMockWorkflows];

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

export const getEnhancedMockWorkflowDesign = (
  workflowCode: string
): IWorkflowDesign | undefined => {
  return enhancedWorkflowDesigns[workflowCode];
};
