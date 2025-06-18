// Re-export from the new notification implementation for backward compatibility
export {
  NotificationComponent,
  successNotification,
  errorNotification,
  warningNotification,
  infoNotification,
  useNotificationComponent,
  type INotification,
} from "./notification";
