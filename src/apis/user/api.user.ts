import {IUserRequest, IUserResponse, IUserSearchCriteria} from "./api.user.interface.ts";
import axiosCustom, {IDataRequest, IDataResponse} from "../axiosCustom.ts";

export async function getUsers(searchCriteria: IUserSearchCriteria): Promise<IDataResponse<IUserResponse>> {
    const request = {
        method: 'GET',
        uri: '/v1/users',
        params: searchCriteria
    } as IDataRequest;
    return await axiosCustom(request);
}

export async function createUser(userRequest: IUserRequest): Promise<IDataResponse<IUserResponse>> {
    const request = {
        method: 'POST',
        uri: '/v1/users',
        data: userRequest
    } as IDataRequest;
    return await axiosCustom(request);
}

export async function updateUser(userRequest: IUserRequest): Promise<IDataResponse<IUserResponse>> {
    const request = {
        method: 'PATCH',
        uri: `/v1/users/${userRequest.userId}`,
        data: userRequest
    } as IDataRequest;
    return await axiosCustom(request);
}

export async function resetPassword(userId: number): Promise<IDataResponse<IUserResponse>> {
    const request = {
        method: 'PATCH',
        uri: `/v1/users/${userId}/reset`,
    } as IDataRequest;
    return await axiosCustom(request);
}