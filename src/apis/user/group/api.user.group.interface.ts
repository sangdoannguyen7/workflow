export const userGroupRequestInit: IUserGroupRequest = {
    userId: 0,
    groupIds: []
}

export interface IUserGroupRequest {
    userId: number | undefined,
    groupIds: number[]
}

export interface IUserGroupResponse {
    userGroupId: number,
    userId: number,
    groupId: number,
    groupCode: string,
    groupName: string
}

export interface IUserGroupSearchCriteria {
    userId: number,
    groupName: string | undefined | null
}