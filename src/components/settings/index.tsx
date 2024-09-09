import { settingSetter, settingGetter } from "./helper";


export const apiUrl = settingGetter({
    name: 'api_url',
    defaultValue: '/api',
});

export const setApiUrl = (value: string) => {
    settingSetter({
        name: 'api_url',
        newValue: value,
    })
};


export const allowEmptyMessage = settingGetter({
    name: 'allow_empty_message',
    defaultValue: 'false',
}) === 'true';
export const setAllowEmptyMessage = (value: boolean) => {
    settingSetter({
        name: 'allow_empty_message',
        newValue: value.toString(),
    });
};
