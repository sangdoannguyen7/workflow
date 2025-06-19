import React from "react";
import {
  ApiOutlined,
  LinkOutlined,
  ScheduleOutlined,
  SettingOutlined,
  ApartmentOutlined,
  ThunderboltOutlined,
  InfoCircleOutlined,
  TagsOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

// Icon mapping object
const ICON_MAP = {
  ApiOutlined: ApiOutlined,
  LinkOutlined: LinkOutlined,
  ScheduleOutlined: ScheduleOutlined,
  SettingOutlined: SettingOutlined,
  ApartmentOutlined: ApartmentOutlined,
  ThunderboltOutlined: ThunderboltOutlined,
  InfoCircleOutlined: InfoCircleOutlined,
  TagsOutlined: TagsOutlined,
  ClockCircleOutlined: ClockCircleOutlined,
  DeleteOutlined: DeleteOutlined,
  EditOutlined: EditOutlined,
};

interface DynamicIconProps {
  iconName: string;
  style?: React.CSSProperties;
  className?: string;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({
  iconName,
  style,
  className,
}) => {
  const IconComponent =
    ICON_MAP[iconName as keyof typeof ICON_MAP] || ApiOutlined;

  return <IconComponent style={style} className={className} />;
};

export default DynamicIcon;
