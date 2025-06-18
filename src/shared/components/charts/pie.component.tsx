import { Pie } from "@ant-design/plots";
import { Divider } from "antd";

const BasicPieComponent = () => {
  const data = [
    {
      type: 'Phòng đơn',
      value: 27,
    },
    {
      type: 'Phòng đôi',
      value: 25,
    },
    {
      type: 'Phòng đơn VIP',
      value: 18,
    },
    {
      type: 'Phòng đôi VIP',
      value: 15,
    },
    {
      type: 'Phòng tập thể',
      value: 15,
    },
  ];
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'inner',
      // content: `{percentage}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  };
  return (
    <div>
      <Divider orientation="center">Tỉ lệ phòng đã đặt</Divider>
      <Pie data={config.data} 
           angleField={config.angleField} 
           colorField={config.colorField}
           radius={config.radius}
           label={config.label}
           interactions={config.interactions}/>
    </div>
  )
}

export default BasicPieComponent
