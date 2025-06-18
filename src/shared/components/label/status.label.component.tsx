import {Tag} from "antd";

const statusMap = new Map([
    ["ACTIVE", 'green'],
    ["INACTIVE", 'red'],
])

interface IStatus {
    code: string,
    name: string
}

const StatusLabel = (status: IStatus) => {
    return (
        <Tag color={statusMap.get(status.code)}>{status.name}</Tag>
    )
}

export default StatusLabel;
