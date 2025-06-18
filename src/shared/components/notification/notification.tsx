import React, { createContext, useContext } from "react";
import { App } from "antd";

// Create notification context
const NotificationContext = createContext<any>(null);

// Provider component
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { notification } = App.useApp();
  return (
    <NotificationContext.Provider value={notification}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use notification
export const useNotification = () => {
  const notification = useContext(NotificationContext);
  if (!notification) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return notification;
};

// Enhanced notification interface
export interface INotification {
  type: "success" | "info" | "warning" | "error";
  message: string;
  description: string;
  duration?: number;
  placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
}

// Global notification function - will try to use context first, fallback to static
let globalNotificationApi: any = null;

export const setGlobalNotificationApi = (api: any) => {
  globalNotificationApi = api;
};

export function NotificationComponent(notify: INotification) {
  const notificationConfig = {
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
    },
    className: "custom-notification",
  };

  if (globalNotificationApi) {
    globalNotificationApi[notify.type](notificationConfig);
  } else {
    // Fallback to static notification
    const { notification } = require("antd");
    notification[notify.type](notificationConfig);
  }
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

// Hook-based notification component for use within components
export const useNotificationComponent = () => {
  const { notification } = App.useApp();

  const showNotification = React.useCallback(
    (notify: INotification) => {
      const notificationConfig = {
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
        },
        className: "custom-notification",
      };

      notification[notify.type](notificationConfig);
    },
    [notification]
  );

  return {
    success: (message: string, description: string, duration?: number) =>
      showNotification({ type: "success", message, description, duration }),
    error: (message: string, description: string, duration?: number) =>
      showNotification({ type: "error", message, description, duration }),
    warning: (message: string, description: string, duration?: number) =>
      showNotification({ type: "warning", message, description, duration }),
    info: (message: string, description: string, duration?: number) =>
      showNotification({ type: "info", message, description, duration }),
    show: showNotification,
  };
};
