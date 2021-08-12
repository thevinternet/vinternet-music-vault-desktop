import React from "react";

import "./StatusMessage.scss";

//===============================================================================================================//

const StatusMessage = props => {

	//===============================================================================================================//
	// Render Status Message
	//===============================================================================================================//

	let statusMessage = (
		<div
			className={["status--highlight", ["theme--" + props.status]].join(" ")}
			aria-live="polite"
			role="status"
		>
			<p>{ props.message }</p>
		</div>
	);
	return statusMessage;
}

//===============================================================================================================//

export default StatusMessage;
