import axiosCustom, {IDataRequest, IDataResponse} from "../../axiosCustom.ts";
import {
    IPermissionGroupRequest,
    IPermissionGroupResponse,
    IPermissionGroupSearchCriteria
} from "./api.permission.group.interface.ts";

export async function getPermissionGroup(searchCriteria: IPermissionGroupSearchCriteria): Promise<IDataResponse<IPermissionGroupResponse>> {
    const request = {
        method: 'GET',
        uri: `/v1/groups/${searchCriteria.groupId}/permissions`,
        params: searchCriteria
    } as IDataRequest;
    return await axiosCustom(request);
}

export async function updatePermissionGroup(permissionGroupRequest: IPermissionGroupRequest): Promise<IDataResponse<void>> {
    const request = {
        method: 'PUT',
        uri: `/v1/groups/${permissionGroupRequest.groupId}/permissions`,
        data: permissionGroupRequest
    } as IDataRequest;
    return await axiosCustom(request);
}