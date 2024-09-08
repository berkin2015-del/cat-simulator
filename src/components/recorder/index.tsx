import { useState } from "react";
import { PawImage } from "../paw-image"

export const Recorder = () => {

    const [message, setMessage] = useState('');

    const handlePawClick = () => {
        console.log('paw clicked from recorder')
    };

    return (
        <div>
            {/* Image Click Rapper since PawImage cannot pass click */}
            <div onClick={handlePawClick}>
                <PawImage />
            </div>

        </div>
    )
}