import {Tag} from "antd";

const actionMap = new Map([
    ["CREATE", 'magenta'],
    ["READ", 'red'],
    ["UPDATE", 'volcano'],
    ["DELETE", 'orange'],
    // gold, lime, green, cyan, blue, geekblue, purple
])

interface IAction {
    code: string,
    name: string
}

const ActionLabel = (action: IAction) => {
    return (
        <Tag color={actionMap.get(action.code)}>{action.name}</Tag>
    )
}

export default ActionLabel;
