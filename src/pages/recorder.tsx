import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { fetchApi } from "../components/api";
import { PawImage } from "../components/paw-image";
import { StatusSending } from "../components/api/status";
import { playAudio } from "../components/audio-processer";

export const Recorder = () => {

    const [isWriting, setIsWriting] = useState(false);
    const [message, setMessage] = useState("");
    const [apiStatus, setApiStatus] = useState('');
    const [firstUse, setFirstUse] = useState(true);
    const [waitingApi, setWaitingApi] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [overideApiUrl, setOverideApiUrl] = useState('');

    useEffect(() => {
        let queryStringApiUrl = searchParams.get("api_url");
        if (queryStringApiUrl) {
            console.log("Recorder: Found api url in query strings\n" + queryStringApiUrl + '\n Overiding localStorage');
            setOverideApiUrl(queryStringApiUrl);
        };
    }, []);

    const audioPlayer = async (audioList: string[]) => {
        for (const trackId of audioList) {
            await playAudio(trackId);
        }
    };

    const queryApi = async () => {
        setWaitingApi(true);
        let apiResponse = await fetchApi('chat', {
            method: 'POST',
            body: JSON.stringify({
                message: message,
            }),
        }, overideApiUrl);
        if (apiResponse === null) {
            console.error('Recorder: Error Fetching Api');
            setApiStatus('Recorder: Error Fetching Api');
            setWaitingApi(false);
            return;
        };
        console.log('Recorder: Got Response\n' + JSON.stringify(apiResponse));
        if (!apiResponse.hasOwnProperty('message')) {
            console.warn('Recorder: Api response has no message');
        };
        setWaitingApi(false);
        let apiResponseMessage = apiResponse.message ? apiResponse.message : '';
        setApiStatus(apiResponseMessage);
        if (apiResponse.hasOwnProperty('soundtracks')) {
            audioPlayer(apiResponse.soundtracks);
        };
        return;
    };

    const handlePawClick = async () => {
        if (!isWriting) {
            console.log("Recorder: Start Writing");
            setApiStatus('');
            setIsWriting(true);
            return;
        };
        console.log("Recorder: Stopped Writing");
        setFirstUse(false);
        setIsWriting(false);
        console.log('Recorder: Recived' + message)
        if (localStorage.getItem('allow_empty_message') !== 'true') {
            if (!message) {
                console.warn(`Recorder: Empty Message exiting.`);
                if (!apiStatus) {
                    setFirstUse(true);
                }
                return;
            };
        } else {
            console.warn('Recorder: Allowed Empty Message')
        }
        await queryApi();
        setMessage('');
        return;
    };

    return (
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
            {waitingApi ? <p><StatusSending /></p> : apiStatus ? <p>{apiStatus}</p> : null}
        </div>
    )
}