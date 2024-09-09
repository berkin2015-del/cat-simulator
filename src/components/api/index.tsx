import urlJoin from "url-join";

const localStorageApiArg = 'api_url';

export const getApiUrl = () => {
    let apiUrlInLocalStorage = localStorage.getItem(localStorageApiArg);
    console.log(`Api: Get from localstorage ${apiUrlInLocalStorage}`);
    if (apiUrlInLocalStorage === null) {
        console.log(`Api: Got null from localstorage\n setting to /api`);
        localStorage.setItem(localStorageApiArg, '/api');
        return '/api';
    }
    return apiUrlInLocalStorage ? apiUrlInLocalStorage : '';
};

export const setApiUrl = (url: string) => {
    let setUrl = url ? url : '';
    console.log(`Api: Set to localstorage ${setUrl}`);
    localStorage.setItem(localStorageApiArg, setUrl);
};

export const apiUrl = getApiUrl();

export const fetchApi = async (path: string, fetchProps?: RequestInit, overideApiUrl?: string) => {
    const fullUrl = urlJoin(overideApiUrl ? overideApiUrl : apiUrl, path);
    console.log('API: Fetching ' + fullUrl);
    try {
        const apiResponse = await fetch(fullUrl, fetchProps);
        if (!apiResponse.ok) {
            console.error("API: Response Error\n" + apiResponse.statusText)
            return null;
        };
        try {
            const apiResponseBody = await apiResponse.json();
            console.log('API: Response: \n' + JSON.stringify(apiResponseBody));
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