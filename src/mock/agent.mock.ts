import { IAgent, IAgentResponse } from "../interface/agent.interface";

export const mockAgents: IAgent[] = [
  {
    agentId: 1,
    agentCode: "WEBHOOK_AGENT",
    agentName: "Webhook Processing Agent",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description: "Agent xử lý các webhook requests từ bên ngoài",
    search: "webhook processing agent hoạt động",
  },
  {
    agentId: 2,
    agentCode: "SCHEDULE_AGENT",
    agentName: "Schedule Task Agent",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description: "Agent thực hiện các tác vụ được lên lịch",
    search: "schedule task agent hoạt động",
  },
  {
    agentId: 3,
    agentCode: "API_AGENT",
    agentName: "REST API Agent",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description: "Agent thực hiện các REST API calls",
    search: "rest api agent hoạt động",
  },
  {
    agentId: 4,
    agentCode: "DATA_AGENT",
    agentName: "Data Processing Agent",
    statusCode: "INACTIVE",
    statusName: "Không hoạt động",
    description: "Agent xử lý và biến đổi dữ liệu",
    search: "data processing agent không hoạt động",
  },
  {
    agentId: 5,
    agentCode: "NOTIFY_AGENT",
    agentName: "Notification Agent",
    statusCode: "ACTIVE",
    statusName: "Hoạt động",
    description: "Agent gửi thông báo qua email, SMS",
    search: "notification agent hoạt động",
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
  };
};

export const getMockAgentById = (id: number): IAgent | undefined => {
  return mockAgents.find((agent) => agent.agentId === id);
};

export const getMockAgentByCode = (code: string): IAgent | undefined => {
  return mockAgents.find((agent) => agent.agentCode === code);
};
