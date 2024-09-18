import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import * as settings from "../components/settings"
import { PawImage } from "../components/paw-image";
import { StatusThinking } from "../components/recorder/status";
import { playAudio } from "../components/audio-processer";
import { queryApi } from "../components/recorder";

const chatIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const Recorder = () => {

    const [isWriting, setIsWriting] = useState(false);
    const [message, setMessage] = useState("");
    const [apiResponseMessage, setApiResponseMessage] = useState('');
    const [firstUse, setFirstUse] = useState(true);
    const [waitingApi, setWaitingApi] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [overideApiUrl, setOverideApiUrl] = useState('');

    useEffect(() => {
        let queryStringApiUrl = searchParams.get("api_url");
        if (queryStringApiUrl) {
            console.warn("Recorder: Found api url in query strings\n" + queryStringApiUrl + '\n Overiding localStorage');
            setOverideApiUrl(queryStringApiUrl);
        }
    }, []);

    const processApiResponse = async (response: {
        message: string,
        soundtracks: string[]
    }) => {
        console.debug('Recorder: Got Response\n' + JSON.stringify(response));
        setApiResponseMessage(response.message.replace(/\n/g, '<br />'));
        for (const trackId of response.soundtracks) {
            await playAudio(trackId);
        }
        return;
    };

    const handlePawClick = async () => {
        if (!isWriting) {
            console.debug("Recorder: Start Writing");
            setMessage('');
            setIsWriting(true);
            return;
        }
        console.debug("Recorder: Stopped Writing");
        setFirstUse(false);
        setIsWriting(false);
        console.debug('Recorder: Recived \n' + message)
        if (!settings.getAllowEmptyMessage() && !message) {
            console.warn(`Recorder: Empty Message exiting.`);
            if (!apiResponseMessage) {
                setFirstUse(true);
            }
            return;
        } else {
            console.warn('Recorder: Allowed Empty Message')
        }
        setWaitingApi(true);
        if (!chatIdRegex.test(settings.getChatId())) {
            const newChatId = crypto.randomUUID();
            console.warn('Recorder: Found Invalid Chat Id, ', settings.getChatId(), '. Setting to\n', newChatId);
            await settings.setChatId(newChatId);
        }
        const apiResponse = await queryApi(overideApiUrl, message, settings.getChatId());
        setWaitingApi(false);
        await processApiResponse(apiResponse);
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
                    {waitingApi ? <p><StatusThinking /></p> : apiResponseMessage ? !isWriting ? (<p dangerouslySetInnerHTML={{ __html: apiResponseMessage }} ></p>) : null : null}
                </div>
            </div >
        </>
    )
}