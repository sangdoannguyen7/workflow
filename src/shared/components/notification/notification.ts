import { notification } from "antd";
import { IconType } from "antd/lib/notification/interface";

export interface INotification {
  type: IconType;
  message: string;
  description: string;
  duration?: number;
  placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
}

// Enhanced notification component with better styling
export function NotificationComponent(notify: INotification) {
  notification.open({
    type: notify.type,
    message: notify.message,
    description: notify.description,
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
