import { useState } from "react";
import { PawImage } from "../components/paw-image"

export const Recorder = () => {
    const [recorderIsWriting, setRecorderIsWriting] = useState(false);

    const [message, setMessage] = useState("");

    const handlePawClick = () => {
        if (!recorderIsWriting) {
            console.log("Recorder: Start Writing");
            setRecorderIsWriting(true);
            return;
        };
        console.log("Recorder: Stopped Writing");
        setRecorderIsWriting(false);
        if (message) {
            console.log(`Recorder: Recived "${message}"`)
        };
        // TODO: Make request to api
    };

    return (
        <div className="place-h-center">
            {/* Image Click Rapper since PawImage cannot pass click */}
            <span onClick={handlePawClick}>
                <PawImage
                    spinning={recorderIsWriting}
                    ignoreClick={true}
                />
            </span>
            {recorderIsWriting ?
                (<div style={{ marginTop: "5vmin" }}>
                    <textarea
                        name="message"
                        onChange={(e) => { setMessage(e.target.value) }}
                        rows={5}
                        cols={30}
                    />
                </div>) :
                (<p>click to record, click again to stop.</p>)}
        </div>
    )
}