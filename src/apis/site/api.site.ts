import axiosCustom, {IDataRequest, IDataResponse} from "../axiosCustom.ts";
import {ISiteRequest, ISiteResponse, ISiteSearchCriteria} from "./api.site.interface.ts";

export async function getSites(searchCriteria: ISiteSearchCriteria): Promise<IDataResponse<ISiteResponse>> {
    const request = {
        method: 'GET',
        uri: '/v1/sites',
        params: searchCriteria
    } as IDataRequest;
    return await axiosCustom(request);
}

export async function createSite(siteRequest: ISiteRequest): Promise<IDataResponse<void>> {
    const request = {
        method: 'POST',
        uri: '/v1/sites',
        data: siteRequest
    } as IDataRequest;
    return await axiosCustom(request);
}

export async function updateSite(siteRequest: ISiteRequest): Promise<IDataResponse<void>> {
    const request = {
        method: 'PATCH',
        uri: `/v1/sites/${siteRequest.siteId}`,
        data: siteRequest
    } as IDataRequest;
    return await axiosCustom(request);
}