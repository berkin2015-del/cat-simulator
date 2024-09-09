import { useEffect, useState } from "react";

import { getApiUrl, setApiUrl } from "../components/api";

export const Settings = () => {

	const [apiUrlSet, setApiUrlSet] = useState('');
	const [allowEmptyMessageSet, setAllowEmptyMessageSet] = useState(false);

	useEffect(() => {
		setApiUrlSet(getApiUrl());
		setAllowEmptyMessageSet(localStorage.getItem('allow_empty_message') === 'true');
	}, [])

	const settingApiUrl = () => {
		console.log(`Settings: Set api to ${apiUrlSet}`);
		setApiUrl(apiUrlSet);
	};
	const settingAllowEmptyMessage = () => {
		console.log(`Settings: Allow Empty Message set to ${allowEmptyMessageSet}`);
		localStorage.setItem('allow_empty_message', allowEmptyMessageSet ? 'true' : 'false');
	};

	return (
		<div className="place-h-center">
			<h2>Settings</h2>
			<table className="table-h-center">
				<thead><tr><td>Property</td><td>Value</td><td>Action</td></tr>
				</thead>
				<tbody>
					<tr>
						<td>Api Url</td>
						<td><input onChange={(e) => { setApiUrlSet(e.target.value) }} value={apiUrlSet} /></td>
						<td><button onClick={settingApiUrl}>set</button></td>
					</tr>
					<tr>
						<td>Allow Empty Message</td>
						<td>
							<input
								type="radio"
								value={'true'}
								name='AllowedEmptyMessage'
								onChange={() => { setAllowEmptyMessageSet(true) }}
								checked={allowEmptyMessageSet === true}
							/> Allowed
							<input
								type="radio"
								value={'false'}
								name='AllowedEmptyMessage'
								onChange={() => { setAllowEmptyMessageSet(false) }}
								checked={allowEmptyMessageSet === false}
							/> Denied
						</td>
						<td><button onClick={settingAllowEmptyMessage}>set</button></td>
					</tr>
				</tbody>
			</table>
			<div style={{ marginTop: '2vh' }} />
			<button onClick={() => { window.location.pathname = '/' }}>Go Back</button>
			<p>* Expected url:<br />
				"https://123456789.execute-api.us-east-1.amazonaws.com/prod/api" or <br />
				"/api"
			</p>
		</div>
	);
};