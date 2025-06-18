import { notification } from "antd";
import { IconType } from "antd/lib/notification/interface";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

export interface INotification {
  type: IconType;
  message: string;
  description: string;
  duration?: number;
  placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
}

// Enhanced notification component with better styling
export function NotificationComponent(notify: INotification) {
  const getIcon = () => {
    switch (notify.type) {
      case "success":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "warning":
        return <ExclamationCircleOutlined style={{ color: "#faad14" }} />;
      case "error":
        return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
      case "info":
      default:
        return <InfoCircleOutlined style={{ color: "#1890ff" }} />;
    }
  };

  notification.open({
    type: notify.type,
    message: (
      <div
        style={{
          fontSize: "16px",
          fontWeight: 600,
          marginBottom: "4px",
        }}
      >
        {notify.message}
      </div>
    ),
    description: (
      <div
        style={{
          fontSize: "14px",
          lineHeight: "1.5",
          color: "rgba(0, 0, 0, 0.65)",
        }}
      >
        {notify.description}
      </div>
    ),
    icon: getIcon(),
    duration: notify.duration || 4.5,
    placement: notify.placement || "topRight",
    style: {
      borderRadius: "12px",
      boxShadow:
        "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
      padding: "20px 24px",
      border: "none",
      background: "#ffffff",
    },
    className: "custom-notification",
  });
}

// Utility functions for different notification types
export const successNotification = (
  message: string,
  description: string,
  duration?: number
) => {
  NotificationComponent({
    type: "success",
    message,
    description,
    duration,
  });
};

export const errorNotification = (
  message: string,
  description: string,
  duration?: number
) => {
  NotificationComponent({
    type: "error",
    message,
    description,
    duration,
  });
};

export const warningNotification = (
  message: string,
  description: string,
  duration?: number
) => {
  NotificationComponent({
    type: "warning",
    message,
    description,
    duration,
  });
};

export const infoNotification = (
  message: string,
  description: string,
  duration?: number
) => {
  NotificationComponent({
    type: "info",
    message,
    description,
    duration,
  });
};

// Configure global notification settings
notification.config({
  placement: "topRight",
  top: 24,
  duration: 4.5,
  rtl: false,
  maxCount: 3,
});
