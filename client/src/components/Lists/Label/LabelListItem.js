import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import he from "he";

import "./LabelListItem.scss";

import useGetEncodedPicture from "../../../hooks/ui/GetEncodedPicture";

//===============================================================================================================//

const LabelListItem = props => {

	//===============================================================================================================//
	// Set Up Component STATE & Initialise HOOKS
	//===============================================================================================================//

	const [getImportedPicture, setImportedPicture] = useState(`${process.env.PUBLIC_URL}/assets/images/site/avatar-label.jpg`);
	const { importedPicture, getEncodedPictureHandler } = useGetEncodedPicture();

	//===============================================================================================================//
	// Setup useEffect Functions
	//===============================================================================================================//

	useEffect(() => {
		let mounted = true
		if (mounted) {
			console.log("Initial Import Label Pictures Effect Running!");
			getEncodedPictureHandler(props.picture);
			if (importedPicture) { setImportedPicture(importedPicture); }
		}
    return function cleanup() {
      mounted = false
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
