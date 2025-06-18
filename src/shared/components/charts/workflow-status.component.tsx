import { Card } from "antd";
import { Pie } from "@ant-design/plots";

interface WorkflowStatusData {
  type: string;
  value: number;
}

interface WorkflowStatusChartProps {
  data?: WorkflowStatusData[];
}

const WorkflowStatusChart: React.FC<WorkflowStatusChartProps> = ({ data }) => {
  const defaultData = data || [
    { type: "Active", value: 7 },
    { type: "Draft", value: 1 },
    { type: "Inactive", value: 1 },
    { type: "Pending", value: 1 },
  ];

  const config = {
    data: defaultData,
    angleField: "value",
    colorField: "type",
    radius: 0.75,
    label: {
      type: "spider",
      labelHeight: 28,
      content: "{name}\n{percentage}",
    },
    color: ["#52c41a", "#faad14", "#ff4d4f", "#1890ff"],
    interactions: [
      {
        type: "element-active",
      },
    ],
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.type,
          value: `${datum.value} workflows`,
        };
      },
    },
    legend: {
      position: "bottom",
      flipPage: false,
    },
  };

  return (
    <Card title="Workflow Status Distribution" bordered={false}>
      <Pie {...config} height={250} />
    </Card>
  );
};

export default WorkflowStatusChart;
