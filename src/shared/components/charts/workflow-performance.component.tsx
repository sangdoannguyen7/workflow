import { Card, Typography } from "antd";
import { Line } from "@ant-design/plots";

const { Title } = Typography;

interface WorkflowPerformanceProps {
  data?: Array<{
    time: string;
    executions: number;
    success_rate: number;
  }>;
}

const WorkflowPerformanceChart: React.FC<WorkflowPerformanceProps> = ({
  data,
}) => {
  const defaultData = data || [
    { time: "00:00", executions: 12, success_rate: 95 },
    { time: "04:00", executions: 8, success_rate: 98 },
    { time: "08:00", executions: 25, success_rate: 92 },
    { time: "12:00", executions: 34, success_rate: 89 },
    { time: "16:00", executions: 28, success_rate: 94 },
    { time: "20:00", executions: 19, success_rate: 97 },
  ];

  const config = {
    data: defaultData,
    xField: "time",
    yField: "executions",
    smooth: true,
    point: {
      size: 4,
      shape: "circle",
    },
    line: {
      color: "#1890ff",
      size: 2,
    },
    areaStyle: {
      fill: "l(270) 0:#ffffff 0.5:#1890ff40 1:#1890ff",
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: "Executions",
          value: `${datum.executions} (${datum.success_rate}% success)`,
        };
      },
    },
    annotations: [
      {
        type: "line",
        start: ["min", "median"],
        end: ["max", "median"],
        style: {
          stroke: "#52c41a",
          lineDash: [4, 4],
        },
      },
    ],
  };

  return (
    <Card title="Workflow Performance (24h)" bordered={false}>
      <Line {...config} height={200} />
    </Card>
  );
};

export default WorkflowPerformanceChart;
