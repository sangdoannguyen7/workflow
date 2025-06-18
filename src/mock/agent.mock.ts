import { IAgent, IAgentResponse } from "../interface/agent.interface";

export const mockAgents: IAgent[] = [
  {
    agentId: 1,
    agentCode: "WEBHOOK_AGENT",
    agentName: "Webhook Processing Agent",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description:
      "Agent chuyên xử lý các webhook requests từ bên ngoài với khả năng validate, transform và route dữ liệu",
    search: "webhook processing agent hoạt động",
  },
  {
    agentId: 2,
    agentCode: "SCHEDULE_AGENT",
    agentName: "Schedule Task Agent",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description:
      "Agent thực hiện các tác vụ được lên lịch với cron expression, hỗ trợ timezone và retry mechanism",
    search: "schedule task agent hoạt động",
  },
  {
    agentId: 3,
    agentCode: "API_AGENT",
    agentName: "REST API Agent",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description:
      "Agent thực hiện các REST API calls với hỗ trợ authentication, retry logic và response mapping",
    search: "rest api agent hoạt động",
  },
  {
    agentId: 4,
    agentCode: "DATA_AGENT",
    agentName: "Data Processing Agent",
    statusCode: "INACTIVE",
    statusName: "Không hoạt động",
    description:
      "Agent xử lý và biến đổi dữ liệu với các functions như filter, map, reduce và validation",
    search: "data processing agent không hoạt động",
  },
  {
    agentId: 5,
    agentCode: "NOTIFY_AGENT",
    agentName: "Notification Agent",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description:
      "Agent gửi thông báo qua nhiều kênh như email, SMS, push notification và webhook",
    search: "notification agent hoạt động",
  },
  {
    agentId: 6,
    agentCode: "LOGIC_AGENT",
    agentName: "Logic Processing Agent",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description:
      "Agent xử lý logic nghiệp vụ, điều kiện, phân nhánh và decision making",
    search: "logic processing agent hoạt động",
  },
  {
    agentId: 7,
    agentCode: "FILE_AGENT",
    agentName: "File Processing Agent",
    statusCode: "DRAFT",
    statusName: "Bản nháp",
    description:
      "Agent xử lý files như read, write, transform, compress và upload/download",
    search: "file processing agent bản nháp",
  },
];

export const getMockAgents = (params?: any): IAgentResponse => {
  let filteredAgents = [...mockAgents];

  if (params?.search) {
    filteredAgents = filteredAgents.filter(
      (agent) =>
        agent.search?.toLowerCase().includes(params.search.toLowerCase()) ||
        agent.agentName.toLowerCase().includes(params.search.toLowerCase()) ||
        agent.agentCode.toLowerCase().includes(params.search.toLowerCase())
    );
  }

  if (params?.statusCode) {
    filteredAgents = filteredAgents.filter(
      (agent) => agent.statusCode === params.statusCode
    );
  }

  const page = params?.page || 0;
  const size = params?.size || 10;
  const start = page * size;
  const end = start + size;

  return {
    content: filteredAgents.slice(start, end),
    totalElements: filteredAgents.length,
    totalPages: Math.ceil(filteredAgents.length / size),
    size: size,
    number: page,
    first: page === 0,
    last: end >= filteredAgents.length,
  };
};

export const getMockAgentById = (id: number): IAgent | undefined => {
  return mockAgents.find((agent) => agent.agentId === id);
};

export const getMockAgentByCode = (code: string): IAgent | undefined => {
  return mockAgents.find((agent) => agent.agentCode === code);
};

// CRUD Operations cho Agent
export const createMockAgent = (agent: Partial<IAgent>): IAgent => {
  const newId = Math.max(...mockAgents.map((a) => a.agentId || 0)) + 1;
  const newAgent: IAgent = {
    agentId: newId,
    agentCode: agent.agentCode || `AGENT_${newId}`,
    agentName: agent.agentName || `New Agent ${newId}`,
    statusCode: agent.statusCode || "DRAFT",
    statusName: agent.statusName || "Bản nháp",
    description: agent.description || "New agent description",
    search:
      agent.search || `${agent.agentName} ${agent.statusName}`.toLowerCase(),
  };

  mockAgents.push(newAgent);
  return newAgent;
};

export const updateMockAgent = (
  id: number,
  updates: Partial<IAgent>
): IAgent | null => {
  const index = mockAgents.findIndex((a) => a.agentId === id);
  if (index === -1) return null;

  mockAgents[index] = { ...mockAgents[index], ...updates };
  return mockAgents[index];
};

export const deleteMockAgent = (id: number): boolean => {
  const index = mockAgents.findIndex((a) => a.agentId === id);
  if (index === -1) return false;

  mockAgents.splice(index, 1);
  return true;
};
