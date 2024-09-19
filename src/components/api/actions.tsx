import { fetchApi } from ".";
import { getCatMode } from "../settings";


export const queryApi = async (overideApiUrl: string, message: string, chatId: string) => {
    let response = await fetchApi('chat', {
        method: 'POST',
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({ message: message, chatId: chatId, catMode: getCatMode().toString() }),
    }, overideApiUrl);
    if (response === null) {
        console.error('Recorder: Error Empty Api Response');
        return {
            message: 'Meow! ~',
            soundtracks: ["meow_01"]
        };
    }
    if (!response.hasOwnProperty('message')) {
        console.warn('Recorder: Api response has no message');
        response.message = 'Meow!! ~';
    }
    if (!response.hasOwnProperty('soundtracks')) {
        console.warn('Recorder: Api response has no soundtracks');
        response.soundtracks = ['meow_01'];
    }
    return response;
};

interface getChatLogsProps {
    chatId: string
}
export const getChatLogs = async (props: getChatLogsProps) => {
    let response = await fetchApi('chat/export', {
        method: 'POST',
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({ chatId: props.chatId }),
    });
    if (response === null) {
        console.error('Recorder: Error Empty Api Response');
        return [{
            message: 'Meow! ~',
            role: 'Meow',
            timestamp: new Date().toLocaleDateString()
        }];
    }
    return response;
}