import { useState } from "react";

import { PawImage } from "../components/paw-image"
import { fetchApi } from "../components/api"

export const Recorder = () => {

    const [isWriting, setIsWriting] = useState(false);
    const [message, setMessage] = useState("");
    const [apiStatus, setApiStatue] = useState('');

    const queryApi = async () => {
        setApiStatue('Loading...');
        let apiResponse = await fetchApi('/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                message: message,
            }),
        });
        if (apiResponse === null) {
            console.error('Recorder: Error Fetching Api');
            setApiStatue('Recorder: Error Fetching Api');
            return;
        };
        // Todo: handle api response
        console.log('Recorder: Got Response' + apiResponse);
        if (!apiResponse.hasOwnProperty('message')) {
            console.warn('Recorder: Api response has no message');
        };
        let apiResponseMessage = apiResponse.message ? apiResponse.message : '';
        setApiStatue('Got Message: ' + apiResponseMessage);
        return;
    };

    const handlePawClick = async () => {
        if (!isWriting) {
            console.log("Recorder: Start Writing");
            setIsWriting(true);
            return;
        };
        console.log("Recorder: Stopped Writing");
        setApiStatue('');
        setIsWriting(false);
        console.log('Recorder: Recived' + message)
        if (!message) {
            console.warn(`Recorder: Empty Message exiting.`);
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
                    spinning={isWriting}
                    ignoreClick={true}
                />
            </span>
            {isWriting ?
                (<div style={{ marginTop: "5vmin" }}>
                    <textarea
                        name="message"
                        onChange={(e) => { setMessage(e.target.value) }}
                        rows={5}
                        cols={30}
                    />
                </div>) :
                (<p>click to record, click again to stop.</p>)}
            {apiStatus ? (<p>{apiStatus}</p>) : null}
        </div>
    )
}