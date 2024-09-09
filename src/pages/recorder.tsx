import { useEffect, useState } from "react";

import { PawImage } from "../components/paw-image"
import { fetchApi } from "../components/api"
import { StatusSending } from "../components/api/status";
import { FailoverStatusCode } from "aws-cdk-lib/aws-cloudfront";

export const Recorder = () => {

    const [isWriting, setIsWriting] = useState(false);
    const [message, setMessage] = useState("");
    const [apiStatus, setApiStatue] = useState('');
    const [firstUse, setFirstUse] = useState(true);
    const [waitingApi, setWaitingApi] = useState(false);

    const queryApi = async () => {
        setWaitingApi(true);
        let apiResponse = await fetchApi('/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                message: message,
            }),
        });
        if (apiResponse === null) {
            console.error('Recorder: Error Fetching Api');
            setApiStatue('Recorder: Error Fetching Api');
            setWaitingApi(false);
            return;
        };
        console.log('Recorder: Got Response' + apiResponse.toString());
        if (!apiResponse.hasOwnProperty('message')) {
            console.warn('Recorder: Api response has no message');
        };
        let apiResponseMessage = apiResponse.message ? apiResponse.message : '';
        setApiStatue('Got Message: ' + apiResponseMessage);
        setWaitingApi(false);

        // Todo: handle api response
        return;
    };

    const handlePawClick = async () => {
        if (!isWriting) {
            console.log("Recorder: Start Writing");
            setIsWriting(true);
            return;
        };
        console.log("Recorder: Stopped Writing");
        setFirstUse(false);
        setIsWriting(false);
        console.log('Recorder: Recived' + message)
        if (!message) {
            console.warn(`Recorder: Empty Message exiting.`);
            if (!apiStatus) {
                setFirstUse(true);
            }
            return;
        };
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
                    <div style={{ marginTop: "10vmin" }}>
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