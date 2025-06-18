import { Column } from "@ant-design/plots";
import { Divider } from "antd";

const BasicColumnComponent = () => {
  const data = [
    {
      type: 'Tháng 1',
      sales: 38,
    },
    {
      type: 'Tháng 2',
      sales: 52,
    },
    {
      type: 'Tháng 3',
      sales: 61,
    },
    {
      type: 'Tháng 4',
      sales: 145,
    },
    {
      type: 'Tháng 5',
      sales: 48,
    },
    {
      type: 'Tháng 6',
      sales: 38,
    },
    {
      type: 'Tháng 7',
      sales: 38,
    },
    {
      type: 'Tháng 8',
      sales: 38,
    },
    {
      type: 'Tháng 9',
      sales: 38,
    },
    {
      type: 'Tháng 10',
      sales: 52,
    },
    {
      type: 'Tháng 11',
      sales: 61,
    },
    {
      type: 'Tháng 12',
      sales: 145,
    },
  ];
  const config = {
    data,
    xField: 'type',
    yField: 'sales',
    label: {
      position: 'middle',
      // 'top', 'bottom', 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.2,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: '类别',
      },
      sales: {
        alias: 'Doanh thu',
      },
    },
  };
  return (
    <div>
      <Divider orientation="center">Doanh thu 12 tháng gần nhất</Divider>
      <Column data={config.data}
              xField={config.xField} 
              yField={config.yField} 
              label={{position: 'middle', style: config.label.style}} 
              xAxis={config.xAxis} 
              meta={config.meta} 
      />
    </div>
  )
}

export default BasicColumnComponent
