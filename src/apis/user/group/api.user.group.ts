import axiosCustom, {IDataRequest, IDataResponse} from "../../axiosCustom.ts";
import { IUserGroupRequest, IUserGroupResponse, IUserGroupSearchCriteria } from "./api.user.group.interface.ts";

export async function getUserGroup(searchCriteria: IUserGroupSearchCriteria): Promise<IDataResponse<IUserGroupResponse>> {
    const request = {
        method: 'GET',
        uri: `/v1/users/${searchCriteria.userId}/groups`,
        params: searchCriteria
    } as IDataRequest;
    console.log(`/v1/users/${searchCriteria.userId}/groups`);
    return await axiosCustom(request);
}

export async function updateUserGroup(userGroupRequest: IUserGroupRequest): Promise<IDataResponse<void>> {
    const request = {
        method: 'PUT',
        uri: `/v1/users/${userGroupRequest.userId}/groups`,
        data: userGroupRequest
    } as IDataRequest;
    return await axiosCustom(request);
}