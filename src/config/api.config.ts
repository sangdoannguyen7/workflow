// API Configuration for switching between mock and real API
export const API_CONFIG = {
  // Set to true to use mock data, false to use real API
  USE_MOCK: true,

  // Base URL for real API
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",

  // Mock delay to simulate network latency
  MOCK_DELAY: 1000,

  // Enable/disable request logging
  ENABLE_LOGGING: true,
};

// Helper function to simulate API delay
export const mockDelay = (ms: number = API_CONFIG.MOCK_DELAY) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Logger function
export const apiLogger = (message: string, data?: any) => {
  if (API_CONFIG.ENABLE_LOGGING) {
    console.log(`[API] ${message}`, data || "");
  }
};

// Re-export MockAPI from enhanced.mock.ts
export { MockAPI } from "../mock/enhanced.mock";
export { WorkflowMockAPI } from "../mock/workflow-enhanced.mock";
