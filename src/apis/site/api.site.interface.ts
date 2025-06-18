import {EStatusType} from "../../common/common.status.type.ts";
import {IMedia} from "../media/api.media.interface.ts";

export interface ISiteRequest {
    siteId: number,
    siteCode: string,
    siteName: string,
    address: string,
    description: string,
    avatar: string,
    media: IMedia[],
    statusType: EStatusType;
}

export interface ISiteResponse {
    siteId: number,
    siteCode: string,
    siteName: string,
    address: string,
    description: string,
    avatar: string,
    media: IMedia[],
    statusType: EStatusType;
}

export interface ISiteSearchCriteria {
    search: string,
    statuses: string,
}