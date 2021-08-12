import React, { useRef } from "react";
import he from "he";

import "./StatusPrompt.scss";

import Button from "../Button/Button";

import SetElementFocus from "../../../../hooks/accessibility/SetElementFocus";

//===============================================================================================================//

const StatusPrompt = props => {

	//===============================================================================================================//
	// Initiate Element Focus Hook
	//===============================================================================================================//

	const statusPromptButton = useRef(null);
	SetElementFocus(statusPromptButton);

	//===============================================================================================================//
	// Render Status Prompt
	//===============================================================================================================//

	let statusPrompt = (
		<div
			className={["status--highlight", ["theme--" + props.status]].join(" ")}
			aria-live="polite"
			role="status"
		>
			<h2>{he.decode(props.headline)}</h2>
			<ul>
				{props.message.length ? (
					props.message.map((message, index) =>
						<li key={index}>
							{he.decode(`${message.msg} | value passed = '${message.value}'`)}
						</li>
					)
				) : null }
				<li>{he.decode(props.response)}</li>
			</ul>
			<Button
				type={props.status}
				clicked={props.action}
				elmRef={statusPromptButton}
			>
				{props.buttonText}
			</Button>
		</div>
	);
	return statusPrompt;
};

//===============================================================================================================//

export default StatusPrompt;
