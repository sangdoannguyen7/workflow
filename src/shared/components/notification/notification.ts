import {notification} from "antd";
import {IconType} from "antd/lib/notification/interface";

export interface INotification {
    type: IconType,
    message: string,
    description: string,
}

export function NotificationComponent(notify: INotification) {
    notification.open({
        type: notify.type,
        message: 'Thông báo',
        description: notify.description
    });
}