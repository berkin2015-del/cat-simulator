import { useState } from "react";
import { setApiUrl, apiUrl } from '.'

export const Settings_ApiUrl = () => {

    const [_value, _setValue] = useState(apiUrl);

    const handleSet = () => {
        console.debug(`Settings: Set api to ${_value}`);
        setApiUrl(_value);
    };

    return (
        <tr>
            <td>Api Url</td>
            <td>
                <input
                    name='api-url'
                    onChange={(e) => {
                        _setValue(e.target.value);
                    }}
                    value={_value}
                />
            </td>
            <td>
                <button
                    onClick={() => _setValue('/api')}
                >default
                </button>
                <button
                    onClick={handleSet}
                >set
                </button>
            </td>
        </tr>
    );
};

