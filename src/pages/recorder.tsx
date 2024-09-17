import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import * as settings from "../components/settings"
import { PawImage } from "../components/paw-image";
import { StatusThinking } from "../components/recorder/status";
import { playAudio } from "../components/audio-processer";
import { queryApi } from "../components/recorder";

const chatIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const Recorder = () => {

    const [localChatId, setLocalChatId] = useState('');
    const [isWriting, setIsWriting] = useState(false);
    const [message, setMessage] = useState("");
    const [apiResponseMessage, setApiResponseMessage] = useState('');
    const [firstUse, setFirstUse] = useState(true);
    const [waitingApi, setWaitingApi] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [overideApiUrl, setOverideApiUrl] = useState('');

    useEffect(() => {
        setLocalChatId(settings.chatId);
        if (!localChatId || chatIdRegex.test(localChatId)) {
            let newChatId = crypto.randomUUID();
            console.warn('Recorder: Invalid chat id found in settings, setting to\n', newChatId);
            settings.setChatId(newChatId);
            setLocalChatId(newChatId);
        }
    }, []);

    useEffect(() => {
        let queryStringApiUrl = searchParams.get("api_url");
        if (queryStringApiUrl) {
            console.log("Recorder: Found api url in query strings\n" + queryStringApiUrl + '\n Overiding localStorage');
            setOverideApiUrl(queryStringApiUrl);
        };
    }, []);

    const processApiResponse = async (response: {
        message: string,
        soundtracks: string[]
    }) => {
        console.log('Recorder: Got Response\n' + JSON.stringify(response));
        setApiResponseMessage(response.message.replace(/\n/g, '<br />'));
        for (const trackId of response.soundtracks) {
            await playAudio(trackId);
        };
        return;
    };

    const handlePawClick = async () => {
        if (!isWriting) {
            console.log("Recorder: Start Writing");
            setApiResponseMessage('');
            setIsWriting(true);
            return;
        };
        console.log("Recorder: Stopped Writing");
        setFirstUse(false);
        setIsWriting(false);
        console.log('Recorder: Recived \n' + message)
        if (!settings.allowEmptyMessage && !message) {
            console.warn(`Recorder: Empty Message exiting.`);
            if (!apiResponseMessage) {
                setFirstUse(true);
            };
            return;
        } else {
            console.warn('Recorder: Allowed Empty Message')
        };
        setWaitingApi(true);
        let apiResponse = await queryApi(overideApiUrl, message, localChatId);
        setWaitingApi(false)
        await processApiResponse(apiResponse);
        setMessage('');
        return;
    };

    return (
        <>
            <div className="place-h-center">
                {/* Image Click Rapper since PawImage cannot pass click */}
                <span onClick={handlePawClick}>
                    <PawImage
                        spinning={!isWriting}
                        ignoreClick={true}
                    />
                </span>
                {isWriting ?
                    <>
                        {firstUse ? <p>click to stop.</p> : null}
                        <div style={{ marginTop: "2em" }}>
                            <textarea
                                name="message"
                                placeholder="Message to cat"
                                onChange={(e) => { setMessage(e.target.value) }}
                                rows={5}
                                cols={30}
                            />
                        </div>
                    </> :
                    <> {firstUse ? <p>click to start.</p> : null}</>}
                <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                    {waitingApi ? <p><StatusThinking /></p> : apiResponseMessage ? <p>{apiResponseMessage}</p> : null}
                </div>
            </div>
            <div>Chat Id: {localChatId}</div>
        </>
    )
}