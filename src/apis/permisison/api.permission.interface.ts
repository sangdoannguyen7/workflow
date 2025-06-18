import {EActionType} from "../../common/common.action.type.ts";
import {EStatusType} from "../../common/common.status.type.ts";

export interface IPermissionRequest {
    permissionId: number,
    permissionCode: string,
    permissionName: string,
    actionType: EActionType,
    statusType: EStatusType;
}

export interface IPermissionResponse {
    permissionId: number,
    permissionCode: string,
    permissionName: string,
    actionType: EActionType,
    statusType: EStatusType;
}

export interface IPermissionSearchCriteria {
    search: string,
    statuses: string,
    actions: string,
}