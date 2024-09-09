import { useState } from "react";
import { allowEmptyMessage, setAllowEmptyMessage } from ".";

export const Settings_AllowEmptyMessage = () => {

    const [_value, _setValue] = useState(allowEmptyMessage);

    const handleSet = () => {
        console.log(`Settings: Set Allow Empty Message to ${_value}`);
        setAllowEmptyMessage(_value);
    }

    return (
        <tr>
            <td>Allow Empty Message</td>
            <td>
                <input
                    type="radio"
                    value={'true'}
                    name='AllowedEmptyMessage'
                    onChange={() => { _setValue(true) }}
                    checked={_value}
                /> Allowed
                <input
                    type="radio"
                    value={'false'}
                    name='AllowedEmptyMessage'
                    onChange={() => { _setValue(false) }}
                    checked={!_value}
                /> Denied
            </td>
            <td><button onClick={handleSet}>set</button></td>
        </tr>
    )
}