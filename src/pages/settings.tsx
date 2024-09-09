import { useEffect, useState } from "react";

import { getApiUrl, setApiUrl } from "../components/api";


export const Settings = () => {

	const [settingsApiUrl, setSettingsApiUrl] = useState('');

	useEffect(() => {
		setSettingsApiUrl(getApiUrl());
	}, [])

	return (
		<div className="place-h-center">
			<h2>Settings</h2>
			<table className="table-h-center">
				<thead><tr><td>Property</td><td>Value</td><td>Action</td></tr>
				</thead>
				<tbody>
					<tr>
						<td>Apfi Url</td>
						<td>
							<input
								onChange={(e) => { setSettingsApiUrl(e.target.value) }}
								value={settingsApiUrl}
							/>
						</td>
						<td>
							<button onClick={() => {
								console.log(`Settings: Set api to ${settingsApiUrl}`);
								setApiUrl(settingsApiUrl);
							}}>set</button>
						</td>
					</tr>
				</tbody>
			</table>
			<div style={{ marginTop: '2vh' }} />
			<button onClick={() => { window.location.pathname = '/' }}>Go Back</button>
			<p>* Expected url:<br />
				"https://123456789.execute-api.us-east-1.amazonaws.com/prod" or <br />
				"/api"
			</p>
		</div>
	);
};