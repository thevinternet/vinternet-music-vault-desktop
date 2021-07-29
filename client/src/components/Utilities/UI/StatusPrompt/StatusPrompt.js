import React from "react";

import "./StatusPrompt.scss";

//===============================================================================================================//

const StatusPrompt = props => {
	let statusPrompt = (
		<div
			className={["status--highlight", ["theme--" + props.status]].join(" ")}
			aria-live="polite"
			role="status"
		>
			<p>{ props.message }</p>
		</div>
	);
	return statusPrompt;
}

//===============================================================================================================//

export default StatusPrompt;
