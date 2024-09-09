import { Settings_ApiUrl } from "../components/settings/api-url";
import { Settings_AllowEmptyMessage } from "../components/settings/allow-empty-message";

export const Settings = () => {

	return (
		<div className="place-h-center">
			<h2>Settings</h2>
			<table style={{marginLeft: 'auto', marginRight: 'auto'}}>
				<thead><tr><td>Property</td><td>Value</td><td>Action</td></tr>
				</thead>
				<tbody>
					<Settings_ApiUrl />
					<Settings_AllowEmptyMessage />
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