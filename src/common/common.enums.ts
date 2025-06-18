
export const BookingStatus = {
    PENDING: {
        text: 'Chờ xác nhận',
        status: 'PENDING',
        color: 'processing'
    },
    CONFIRMED: {
        text: 'Đặt thành công',
        status: 'CONFIRMED',
        color: 'success'
    },
    PAID_CONFIRM: {
        text: 'Xác nhận thanh toán',
        status: 'PAID_CONFIRM',
        color: 'error'
    },
    PAID: {
        text: 'Đã thanh toán',
        status: 'PAID',
        color: 'warning'
    },
    EXPERIENCING: {
        text: 'Đang sử dụng',
        status: 'EXPERIENCING',
        color: 'magenta'
    },
    COMPLETED: {
        text: 'Đã hoàn thành',
        status: 'COMPLETED',
        color: 'success'
    },
    CANCELED: {
        text: 'Đã huỷ',
        status: 'CANCELED',
        color: 'red'
    }
}