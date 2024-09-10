import { fetchApi } from "../api";

export const queryApi = async (overideApiUrl: string, message: string) => {
    let response = await fetchApi('chat', {
        method: 'POST',
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({ message: message, }),
    }, overideApiUrl);
    if (response === null) {
        console.error('Recorder: Error Empty Api Response');
        return {
            message: 'Meow! ~',
            soundtracks: ["meow_01"]
        };
    };
    if (!response.hasOwnProperty('message')) {
        console.warn('Recorder: Api response has no message');
        response.message = 'Meow!! ~'
    };
    if (!response.hasOwnProperty('soundtracks')) {
        console.warn('Recorder: Api response has no message');
        response.soundtracks = ['meow_01']
    };
    return response;
};

const processApiResponse = async (response: {
    message: string,
    soundtracks: string[]
}) => {
    console.log('Recorder: Got Response\n' + JSON.stringify(response));
    setApiStatus(response.message);
    for (const trackId of response.soundtracks) {
        await playAudio(trackId);
    };
    return;
};