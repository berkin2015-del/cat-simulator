import { settingSetter, settingGetter } from "./helper";


export const getApiUrl = () => {
    return settingGetter({
        name: 'api_url',
        defaultValue: '/api',
    })
};
export const setApiUrl = (value: string) => {
    settingSetter({
        name: 'api_url',
        newValue: value,
    })
};


export const getAllowEmptyMessage = () => {
    return settingGetter({
        name: 'allow_empty_message',
        defaultValue: 'false',
    }) === 'true'
};
export const setAllowEmptyMessage = (value: boolean) => {
    settingSetter({
        name: 'allow_empty_message',
        newValue: value.toString(),
    });
};


export const getChatId = () => {
    return settingGetter({
        name: 'chat_id',
        defaultValue: crypto.randomUUID(),
    })
};
export const setChatId = (value: string) => {
    settingSetter({
        name: 'chat_id',
        newValue: value,
    });
};