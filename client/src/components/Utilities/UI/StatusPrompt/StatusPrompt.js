import React, { useRef } from "react";
import he from "he";

import "./StatusPrompt.scss";

import ContentHtml from "../StatusContent/ContentHtml";
import ContentText from "../StatusContent/ContentText";

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
			<p>{he.decode(props.response)}</p>
			{ props.htmlContent ? 
				<ContentHtml message={props.message} />
			: null }
			{ props.textContent ? 
				<ContentText message={props.message} />
			: null }
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
