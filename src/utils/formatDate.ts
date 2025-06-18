import dayjs from "dayjs";

export const dateFormat = (value: Date): string => {
    const data = dayjs();
    console.log(data.subtract(7, 'day').format('YYYY-MM-DD'));
    console.log(dayjs(value).format('YYYY/MM/DD'));
    return ``;
};

export const dateTimeFormat = (value: Date): string => {
    const data = value.toString().replace(/,/g, '');
    return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};