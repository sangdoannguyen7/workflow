import {EStatusType} from "../../common/common.status.type.ts";

export interface IGroupRequest {
    groupId: number,
    groupCode: string,
    groupName: string,
    statusType: EStatusType;
}

export interface IGroupResponse {
    groupId: number,
    groupCode: string,
    groupName: string,
    statusType: EStatusType;
}

export interface IGroupSearchCriteria {
    search: string,
    statuses: string,
}