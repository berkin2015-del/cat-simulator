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

const chatIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const setChatId = (value: string) => {
    if (!chatIdRegex.test(value)) {
        console.log('Settins: Invalid ChatId try to set. Skipping\n', value)
        return;
    }
    settingSetter({
        name: 'chat_id',
        newValue: value,
    });
};

export const getChatId = () => {
    let chatId = settingGetter({
        name: 'chat_id',
        defaultValue: crypto.randomUUID(),
    })
    if (!chatIdRegex.test(chatId)) {
        let newChatId = crypto.randomUUID();
        console.warn('Settings: Found Invalid Chat Id, ', chatId, '. Setting to\n', newChatId);
        setChatId(newChatId);
        return newChatId;
    }
    return chatId;
};

export const getCatMode = () => {
    return settingGetter({
        name: 'cat_mode',
        defaultValue: 'true',
    }) === 'true'
};
export const setCatMode = (value: boolean) => {
    settingSetter({
        name: 'cat_mode',
        newValue: value.toString(),
    });
};