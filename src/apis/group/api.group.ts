import axiosCustom, {IDataRequest, IDataResponse} from "../axiosCustom.ts";
import {IGroupRequest, IGroupResponse, IGroupSearchCriteria} from "./api.group.interface.ts";

export async function getGroups(searchCriteria: IGroupSearchCriteria): Promise<IDataResponse<IGroupResponse>> {
    const request = {
        method: 'GET',
        uri: '/v1/groups',
        params: searchCriteria
    } as IDataRequest;
    return await axiosCustom(request);
}

export async function createGroup(groupRequest: IGroupRequest): Promise<IDataResponse<IGroupResponse>> {
    const request = {
        method: 'POST',
        uri: '/v1/groups',
        data: groupRequest
    } as IDataRequest;
    return await axiosCustom(request);
}

export async function updateGroup(groupRequest: IGroupRequest): Promise<IDataResponse<IGroupResponse>> {
    const request = {
        method: 'PATCH',
        uri: `/v1/groups/${groupRequest.groupId}`,
        data: groupRequest
    } as IDataRequest;
    return await axiosCustom(request);
}