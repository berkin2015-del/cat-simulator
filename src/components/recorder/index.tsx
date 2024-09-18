import { fetchApi } from "../api";


export const queryApi = async (overideApiUrl: string, message: string, chatId: string) => {
    let response = await fetchApi('chat', {
        method: 'POST',
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({ message: message, chatId: chatId }),
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