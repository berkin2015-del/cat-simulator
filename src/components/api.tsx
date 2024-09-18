import urlJoin from "url-join";

import { apiUrl } from './settings'

export const fetchApi = async (path: string, fetchProps?: RequestInit, overideApiUrl?: string) => {
    const fullUrl = urlJoin(overideApiUrl ? overideApiUrl : apiUrl, path);
    console.debug('API: Fetching ' + fullUrl);
    try {
        const apiResponse = await fetch(fullUrl, fetchProps);
        if (!apiResponse.ok) {
            console.error("API: Response Error\n" + apiResponse.statusText)
            return null;
        };
        try {
            const apiResponseBody = await apiResponse.json();
            console.debug('API: Response: \n' + JSON.stringify(apiResponseBody));
            return apiResponseBody;
        } catch (error) {
            console.error("API: Response Parse Error\n" + (error as Error).message)
            return null;
        };
    } catch (error) {
        console.error('API: Fetch Error\n' + error);
        return null;
    }
};