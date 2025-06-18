// Export all mock data for easy access
export * from "./agent.mock";
export * from "./template.mock";
export * from "./node.mock";
export * from "./workflow.mock";

// Initialize mock data - this ensures data is loaded when imported
import { mockAgents } from "./agent.mock";
import { mockTemplates } from "./template.mock";
import { mockNodes } from "./node.mock";
import { mockWorkflows } from "./workflow.mock";

// Log mock data initialization
console.log("🎭 Mock data initialized:");
console.log(`📋 Agents: ${mockAgents.length} items`);
console.log(`📄 Templates: ${mockTemplates.length} items`);
console.log(`🔗 Nodes: ${mockNodes.length} items`);
console.log(`🌊 Workflows: ${mockWorkflows.length} items`);

// Export summary for debugging
export const mockDataSummary = {
  agents: mockAgents.length,
  templates: mockTemplates.length,
  nodes: mockNodes.length,
  workflows: mockWorkflows.length,
  lastInitialized: new Date().toISOString(),
};
