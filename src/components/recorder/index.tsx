import { fetchApi } from "../api";
import { chatId as storedChatId, setChatId } from "../settings";

const chatIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const queryApi = async (overideApiUrl: string, message: string) => {
    let chatId = storedChatId;
    if (!chatId || !chatIdRegex.test(chatId)) {
        chatId = crypto.randomUUID();
        console.warn('Recorder: Invalid Chat Id found in storage. Setting to: \n', chatId);
        await setChatId(chatId);
    }
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
        console.warn('Recorder: Api response has no message');
        response.soundtracks = ['meow_01'];
    }
    return response;
};