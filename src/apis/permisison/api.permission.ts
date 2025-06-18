import axiosCustom, {IDataRequest, IDataResponse} from "../axiosCustom.ts";
import {IPermissionRequest, IPermissionResponse, IPermissionSearchCriteria} from "./api.permission.interface.ts";

export async function getPermissions(searchCriteria: IPermissionSearchCriteria): Promise<IDataResponse<IPermissionResponse>> {
    const request = {
        method: 'GET',
        uri: '/v1/permissions',
        params: searchCriteria
    } as IDataRequest;
    return await axiosCustom(request);
}

export async function createPermission(permissionRequest: IPermissionRequest): Promise<IDataResponse<IPermissionResponse>> {
    const request = {
        method: 'POST',
        uri: '/v1/permissions',
        data: permissionRequest
    } as IDataRequest;
    return await axiosCustom(request);
}

export async function updatePermission(permissionRequest: IPermissionRequest): Promise<IDataResponse<IPermissionResponse>> {
    const request = {
        method: 'PATCH',
        uri: `/v1/permissions/${permissionRequest.permissionId}`,
        data: permissionRequest
    } as IDataRequest;
    return await axiosCustom(request);
}