import {EGenderType} from "../../common/common.user.type.ts";
import {EStatusType} from "../../common/common.status.type.ts";

export interface IUserRequest {
    userId: number;
    username: string;
    password: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    gender: EGenderType;
    statusType: EStatusType;
}

export interface IUserResponse {
    userId: number;
    username: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    gender: EGenderType;
    statusType: EStatusType;
}

export interface IUserSearchCriteria {
    search: string,
    statuses: string,
    types: string
}