const localStorageApiArg = 'api_url';

export const getApiUrl = () => {
    let apiUrlInLocalStorage = localStorage.getItem(localStorageApiArg);
    console.log(`Api: get from localstorage ${apiUrlInLocalStorage}`);
    return apiUrlInLocalStorage ? apiUrlInLocalStorage : '';
};

export const setApiUrl = (url: string) => {
    let setUrl = url ? url : '';
    console.log(`Api: get from localstorage ${setUrl}`);
    localStorage.setItem(localStorageApiArg, setUrl);
};