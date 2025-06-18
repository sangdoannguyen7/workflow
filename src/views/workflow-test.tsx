import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Space,
  message,
  Typography,
  List,
  Tag,
  Row,
  Col,
  Divider,
} from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import workflowApi from "../apis/workflow/api.workflow";
import templateApi from "../apis/template/api.template";
import agentApi from "../apis/agent/api.agent";
import nodeApi from "../apis/node/api.node";

const { Title, Text } = Typography;

interface TestResult {
  name: string;
  status: "success" | "error" | "loading";
  message: string;
  duration?: number;
}

const WorkflowTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTestResult = (
    name: string,
    status: "success" | "error" | "loading",
    message: string,
    duration?: number
  ) => {
    setTestResults((prev) => {
      const exists = prev.find((result) => result.name === name);
      const newResult = { name, status, message, duration };

      if (exists) {
        return prev.map((result) =>
          result.name === name ? newResult : result
        );
      } else {
        return [...prev, newResult];
      }
    });
  };

  const runTest = async (testName: string, testFn: () => Promise<void>) => {
    const startTime = Date.now();
    updateTestResult(testName, "loading", "Running...");

    try {
      await testFn();
      const duration = Date.now() - startTime;
      updateTestResult(testName, "success", "Passed", duration);
    } catch (error) {
      const duration = Date.now() - startTime;
      updateTestResult(
        testName,
        "error",
        `Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        duration
      );
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: Load Workflows
    await runTest("Load Workflows", async () => {
      const response = await workflowApi.getWorkflows({ size: 10 });
      if (!response.content || response.content.length === 0) {
        throw new Error("No workflows found");
      }
    });

    // Test 2: Load Templates
    await runTest("Load Templates", async () => {
      const response = await templateApi.getTemplates({ size: 10 });
      if (!response.content || response.content.length === 0) {
        throw new Error("No templates found");
      }
    });

    // Test 3: Load Agents
    await runTest("Load Agents", async () => {
      const response = await agentApi.getAgents({ size: 10 });
      if (!response.content || response.content.length === 0) {
        throw new Error("No agents found");
      }
    });

    // Test 4: Load Nodes
    await runTest("Load Nodes", async () => {
      const response = await nodeApi.getNodes({ size: 10 });
      if (!response.content || response.content.length === 0) {
        throw new Error("No nodes found");
      }
    });

    // Test 5: Load Workflow Design
    await runTest("Load Workflow Design", async () => {
      const design = await workflowApi.getWorkflowDesign("BOOKING_FLOW");
      if (!design) {
        throw new Error("No workflow design found");
      }
    });

    // Test 6: Save Workflow Design
    await runTest("Save Workflow Design", async () => {
      const testDesign = {
        workflowCode: "TEST_WORKFLOW",
        nodes: [
          {
            id: "test-node-1",
            position: { x: 100, y: 100 },
            data: {
              label: "Test Node",
              templateCode: "WEBHOOK_RECEIVE",
              templateType: "webhook",
              agentCode: "WEBHOOK_AGENT",
              description: "Test node for validation",
            },
          },
        ],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
      };

      const saved = await workflowApi.saveWorkflowDesign(
        "TEST_WORKFLOW",
        testDesign
      );
      if (!saved) {
        throw new Error("Failed to save workflow design");
      }
    });

    // Test 7: Data Structure Validation
    await runTest("Data Structure Validation", async () => {
      const workflows = await workflowApi.getWorkflows();
      const templates = await templateApi.getTemplates();

      // Check if workflows have required fields
      const workflow = workflows.content[0];
      if (
        !workflow.workflowCode ||
        !workflow.workflowName ||
        !workflow.statusCode
      ) {
        throw new Error("Workflow missing required fields");
      }

      // Check if templates have required fields
      const template = templates.content[0];
      if (
        !template.templateCode ||
        !template.templateName ||
        !template.templateType
      ) {
        throw new Error("Template missing required fields");
      }
    });

    setIsRunning(false);

    const allPassed = testResults.every(
      (result) => result.status === "success"
    );
    if (allPassed) {
      message.success(
        "All tests passed! Workflow system is working correctly."
      );
    } else {
      message.warning("Some tests failed. Check the results below.");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "error":
        return <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />;
      case "loading":
        return <LoadingOutlined style={{ color: "#1890ff" }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "success";
      case "error":
        return "error";
      case "loading":
        return "processing";
      default:
        return "default";
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Title level={2}>Workflow System Test Suite</Title>
              <Text type="secondary">
                This test validates that all workflow components are working
                correctly with mock data. The tests include API calls, data
                structure validation, and workflow operations.
              </Text>

              <Space>
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={runAllTests}
                  loading={isRunning}
                  size="large"
                >
                  Run All Tests
                </Button>

                <Button onClick={() => setTestResults([])} disabled={isRunning}>
                  Clear Results
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Test Results" bordered={false}>
            {testResults.length === 0 ? (
              <div
                style={{ textAlign: "center", padding: "40px", color: "#999" }}
              >
                <Text>
                  No tests run yet. Click "Run All Tests" to start validation.
                </Text>
              </div>
            ) : (
              <List
                dataSource={testResults}
                renderItem={(result) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={getStatusIcon(result.status)}
                      title={
                        <Space>
                          <Text strong>{result.name}</Text>
                          <Tag color={getStatusColor(result.status)}>
                            {result.status.toUpperCase()}
                          </Tag>
                          {result.duration && (
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              ({result.duration}ms)
                            </Text>
                          )}
                        </Space>
                      }
                      description={
                        <Text
                          style={{
                            color:
                              result.status === "error" ? "#ff4d4f" : undefined,
                          }}
                        >
                          {result.message}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Quick Links" bordered={false}>
            <Space wrap>
              <Button href="/dashboard">Dashboard</Button>
              <Button href="/workflow-builder">Workflow Builder</Button>
              <Button href="/node-flow">Node Flow</Button>
              <Button href="/workflow">Workflows</Button>
              <Button href="/template">Templates</Button>
              <Button href="/agent">Agents</Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default WorkflowTestPage;
