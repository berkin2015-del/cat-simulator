import { Console } from "console";

export const getApiUrl = () => {
    let apiUrlInLocalStorage = localStorage.getItem('api_url');
    console.log(`Api: get from localstorage ${apiUrlInLocalStorage}`);
    return apiUrlInLocalStorage ? apiUrlInLocalStorage : '';
};

export const setApiUrl = (url: string) => {
    let setUrl = url ? url : '';
    console.log(`Api: get from localstorage ${setUrl}`);
    localStorage.setItem('api_url', setUrl);
};