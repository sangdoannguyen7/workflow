import Timeline, { CursorMarker, Id, TimelineMarkers, TodayMarker } from 'react-calendar-timeline'
import { SearchOutlined } from "@ant-design/icons";
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment'
import { Button, Card, DatePicker, Drawer, Layout, Select, Space, Tooltip } from 'antd'
import { useState } from 'react'
import dayjs from 'dayjs'

const groups = [
  { id: 1, title: 'Phòng đôi 2 Phòng đôi 2 Phòng đôi 2', height: 80 }, 
  { id: 2, title: 'group 2', height: 80},
  { id: 3, title: 'group 3', height: 80},
  { id: 4, title: 'group 4', height: 80},
  { id: 5, title: 'group 3', height: 80},
  { id: 6, title: 'group 4', height: 80},
  { id: 7, title: 'group 3', height: 80},
  { id: 8, title: 'group 4', height: 80}
]

const items = [
  {
    id: 1,
    group: 1,
    title: 'item 1',
    start_time: moment(),
    end_time: moment().add(24, 'hour'),
    tip: 'additional information',
  },
  {
    id: 3,
    group: 1,
    title: 'item 1',
    start_time: moment(),
    end_time: moment().add(24, 'hour'),
    tip: 'additional information',
  },
  {
    id: 2,
    group: 2,
    title: 'item 2',
    start_time: moment().add(-0.5, 'hour'),
    end_time: moment().add(0.5, 'hour'),
    bgColor : 'rgba(100, 100, 244, 0.6)',
    timelineWidth: 100
  }
]

const CalendarPage = () => {

  const [open, setOpen] = useState(false);

  const showDrawer = (groupId: Id, time: number) => {
    console.log(groupId, time);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters'];
  const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));


  return (
    <Layout.Content
          style={{
              padding: 12,
              borderRadius: 8
          }}
    >
      <Card style={{marginBottom: 16}}>
        <div style={{display: "flex"}}>
          <div style={{display: "flex", justifyContent: 'center', alignItems: 'center', marginRight: 24}}>
            <span style={{ marginRight: 8 }}>Thời gian:</span>
            <DatePicker.RangePicker
              defaultValue={[dayjs('03-07-2024', 'DD-MM-YYYY'), dayjs('83-07-2024', 'DD-MM-YYYY')]}
              disabled={[false, true]}
            />  
          </div>
          <div style={{display: "flex", flex: 1, alignItems: 'center'}}>
            <span style={{ marginRight: 8 }}>Phòng:</span>
            <Select
              mode="multiple"
              placeholder="Lọc danh sách phòng"
              value={selectedItems}
              onChange={setSelectedItems}
              style={{ width: '100%' }}
              options={filteredOptions.map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </div>
          <div  style={{display: "flex", justifyContent: 'center', alignItems: 'center', marginLeft: 24}}>
            <Button onClick={onClose} type="primary" icon={<SearchOutlined/>} iconPosition="start">Tìm kiếm</Button>
          </div>
        </div>
      </Card>
      <Timeline
        groups={groups}
        items={items}
        timeSteps={
          {
            second: 0,
            minute: 0,
            hour: 1,
            day: 1,
            month: 1,
            year: 0
          }
        }
        groupRenderer={group => {
          return (
            // <div style={{ flexWrap: "revert" }}>
            //   <span className='title'>{group.group.title}</span>
            //   <Tooltip>hello</Tooltip>
            //   <p className='tip'>{group.group.id}</p>
            // </div>
            <Tooltip title={group.group.title}>
              <div style={{marginLeft: 8}}>
                {group.group.title}
              </div>
            </Tooltip>
          )
        }}
        itemTouchSendsClick={false}
        minZoom={60 * 60 * 1000 * 24}
        maxZoom={60 * 60 * 1000 * 24 * 7}
        onCanvasClick={(groupId, time) => showDrawer(groupId, time)}
        onItemClick={(groupId, _, time) => showDrawer(groupId, time)}
        defaultTimeStart={moment().add(-3, 'day')}
        defaultTimeEnd={moment().add(4, 'day')}
        visibleTimeStart={moment().add(-2, 'week')}
        visibleTimeEnd={moment().add(2, 'week')}
        lineHeight={80}
      >
        <TimelineMarkers>
          <TodayMarker date={moment.now()}/>
          <CursorMarker />
        </TimelineMarkers>
      </Timeline>
      <Drawer
        title="Create a new account"
        width={720}
        onClose={onClose}
        closable={true}
        maskClosable={false}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onClose} type="primary">
              Submit
            </Button>
          </Space>
        }
      >

      </Drawer>
    </Layout.Content>
  )
}

export default CalendarPage;