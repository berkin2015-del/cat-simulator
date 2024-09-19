import { useState } from "react";
import { getCatMode, setCatMode } from ".";

export const Settings_CatMode = () => {

    const [_value, _setValue] = useState(getCatMode());

    const handleSet = () => {
        console.debug(`Settings: Set Cat Mode to ${_value}`);
        setCatMode(_value);
    }

    return (
        <tr>
            <td>Cat Mode</td>
            <td>
                <input
                    type="radio"
                    value={'true'}
                    name='CatMode'
                    onChange={() => { _setValue(true) }}
                    checked={_value}
                /> Meow
                <input
                    type="radio"
                    value={'false'}
                    name='CatMode'
                    onChange={() => { _setValue(false) }}
                    checked={!_value}
                /> No
            </td>
            <td><button onClick={handleSet}>set</button></td>
        </tr>
    )
}