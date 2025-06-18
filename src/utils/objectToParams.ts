export const objetToParams = (obj: Record<string, any>): string => {
    const params = new URLSearchParams();
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            params.append(key, obj[key]);
        }
    }
    return params.toString();
};