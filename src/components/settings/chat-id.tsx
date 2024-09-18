import { useState } from "react";

import { chatId, setChatId } from '.';

export const Settings_ChatId = () => {

    const [_value, _setValue] = useState(chatId);

    const handleSet = () => {
        console.debug(`Settings: Set Chat ID to ${_value}`);
        setChatId(_value);
    };

    const handleRandom = () => {
        const _value = crypto.randomUUID();
        console.debug(`Settings: Random Chat ID to ${_value}`);
        _setValue(_value);
    };

    return (
        <tr>
            <td>Chat ID</td>
            <td>
                <input
                    name='chat-id'
                    onChange={(e) => {
                        _setValue(e.target.value);
                    }}
                    value={_value}
                />
            </td>
            <td>
                <button
                    onClick={handleRandom}
                >randomise
                </button>
                <button
                    onClick={handleSet}
                >set
                </button>
            </td>
        </tr>
    );
};

