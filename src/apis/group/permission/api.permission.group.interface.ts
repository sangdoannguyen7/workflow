import {EActionType} from "../../../common/common.action.type.ts";

export const permissionGroupRequestInit: IPermissionGroupRequest = {
    groupId: 0,
    permissionCodes: []
}

export interface IPermissionGroupRequest {
    groupId: number | undefined,
    permissionCodes: string[]
}

export interface IPermissionGroupResponse {
    permissionGroupId: number,
    groupId: number,
    permissionCode: string,
    permissionName: string,
    actionType: EActionType;
}

export interface IPermissionGroupSearchCriteria {
    groupId: number,
}