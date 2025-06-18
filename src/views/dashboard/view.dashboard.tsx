import {
  Button,
  Card,
  Col,
  DatePicker,
  Layout,
  Row,
  Select,
  Statistic,
} from "antd";
import {
  SearchOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const DashboardPage = () => {
  return (
    <Layout.Content
      style={{
        padding: 12,
        // marginLeft: 12,
        // marginRight: 12,
        borderRadius: 6,
        // backgroundColor: colorBgContainer
      }}
    >
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 24,
            }}
          >
            <span style={{ marginRight: 8 }}>Thời gian:</span>
            <DatePicker.RangePicker
              defaultValue={[
                dayjs("03-07-2024", "DD-MM-YYYY"),
                dayjs("03-08-2024", "DD-MM-YYYY"),
              ]}
              disabled={[false, true]}
            />
          </div>
          <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
            <span style={{ marginRight: 8 }}>Phòng:</span>
            <Select
              mode="multiple"
              placeholder="Lọc danh sách phòng"
              style={{ width: "100%" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 24,
            }}
          >
            <Button
              type="primary"
              icon={<SearchOutlined />}
              iconPosition="start"
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
      </Card>
      <Row gutter={16}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Active"
              value={11.28}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Active"
              value={11.28}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
    </Layout.Content>
  );
};

export default DashboardPage;
