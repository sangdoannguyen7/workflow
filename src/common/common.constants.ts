import { BookingStatus } from "./common.enums.ts";
import { IStatus } from "../interface/orders/interface.order.status.ts";
import dayjs from "dayjs";

export const currentDate = dayjs();

export const constants = {
    // BACKEND_HOST: "http://14.225.255.225:8000",
    BACKEND_HOST: "http://localhost:8082",

    CUSTOMER_HOST: "http://phuquytravel.click:9999",
}

export const statusDetail = (status: string): IStatus => {
    if(status === 'PENDING') {
        return BookingStatus.PENDING;
    }
    if(status === 'CONFIRMED') {
        return BookingStatus.CONFIRMED;
    }
    if(status === 'PAID_CONFIRM') {
        return BookingStatus.PAID_CONFIRM;
    }
    if(status === 'PAID') {
        return BookingStatus.PAID;
    }
    if(status === 'EXPERIENCING') {
        return BookingStatus.EXPERIENCING;
    }
    if(status === 'COMPLETED') {
        return BookingStatus.COMPLETED;
    }
    if(status === 'CANCELED') {
        return BookingStatus.CANCELED;
    }
    return BookingStatus.CANCELED;
}

export const paidColor = (paid: boolean): string => {
    if(paid) {
        return 'success'
    } else {
        return 'red';
    }
}

export const messageMap = new Map([
    ["LINK_ERROR", "Lỗi hệ thống"],
    ["EMAIL_NOTFOUND", "Họ tên không được bỏ trống"],
    ["OLD_PASSWORD_ERROR", "Mật khẩu cũ không đúng"],
    ["DATE_BAD_REQUEST", "Ngày không hợp lệ"],
    ["INSUFFICIENT_ROOM", "Không đủ phòng"],
    ["ORDER_ERROR", "Đơn đặt không hợp lệ"],
    ["ORDER_UNSATISFACTORY", "Đơn đặt không hợp lệ"],
    ["RATING_ERROR", "Không thể đánh giá"],
    ["RESIDENCE_NOTFOUND", "Không tìm thấy nơi ở phù hợp"],
    ["ROOM_NOTFOUND", "Không tìm thấy phòng phù hợp"],
    ["EMAIL_EXISTED", "Email đã tồn tại"],
    ["USER_ERROR", "Tài khoản không hợp lệ"],
    ["USER_FORBIDDEN", "Không có quyền truy cập"],
])