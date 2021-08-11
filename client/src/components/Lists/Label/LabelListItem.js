import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import he from "he";

import "./LabelListItem.scss";
import labelAvatar from "../../../assets/images/site/avatar-label.jpg";

import useGetEncodedPicture from "../../../hooks/ui/GetEncodedPicture";

//===============================================================================================================//

const LabelListItem = props => {

	//===============================================================================================================//
	// Set Up Component STATE & Initialise HOOKS
	//===============================================================================================================//

	const [getImportedPicture, setImportedPicture] = useState(labelAvatar);
	const { importedPicture, getEncodedPictureHandler } = useGetEncodedPicture();

	//===============================================================================================================//
	// Setup useEffect Functions
	//===============================================================================================================//

	// Import Label Pictures Via Electron IPC Effect
	useEffect(() => {
		getEncodedPictureHandler(props.picture);
		if (importedPicture) { 
			setImportedPicture(importedPicture);
		}
		return function cleanup() {
			setImportedPicture(labelAvatar);
		}
	}, [getEncodedPictureHandler, props.picture, setImportedPicture, importedPicture]);

	//===============================================================================================================//
	// Render Label List Item
	//===============================================================================================================//

	let labelListItem = (
		<li>
			<div className="card--small">
				<figure>
					<picture>
						<img
							key={props.labelName ? he.decode(props.labelName) : ""}
							src={getImportedPicture}
							alt={props.labelName ? he.decode(props.labelName) : ""}
							width="60px"
							height="60px"
						/>
					</picture>
				</figure>
				<div className="card__details">
					<h2>
						<Link to={{ pathname: `/labels/${props.labelId}` }}>
							{props.labelName ? he.decode(props.labelName) : ""}
						</Link>
					</h2>
				</div>
			</div>
		</li>
	);
	return labelListItem;
};

//===============================================================================================================//

export default LabelListItem;
