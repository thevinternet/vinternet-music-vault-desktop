import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import he from "he";

import "./ReleaseListItem.scss";
import releaseAvatar from "../../../assets/images/site/avatar-release.jpg";

import useGetEncodedPicture from "../../../hooks/ui/GetEncodedPicture";

//===============================================================================================================//

const ReleaseListItem = props => {

	//===============================================================================================================//
	// Set Up Component STATE & Initialise HOOKS
	//===============================================================================================================//

	const [getImportedPicture, setImportedPicture] = useState(releaseAvatar);
	const { importedPicture, getEncodedPictureHandler } = useGetEncodedPicture();

	//===============================================================================================================//
	// Setup useEffect Functions
	//===============================================================================================================//

	// Import Release Pictures Via Electron IPC Effect
	useEffect(() => {
		getEncodedPictureHandler(props.picture);
		if (importedPicture) { 
			setImportedPicture(importedPicture);
		}
		return function cleanup() {
			setImportedPicture(releaseAvatar);
		}
	}, [getEncodedPictureHandler, props.picture, setImportedPicture, importedPicture]);

	//===============================================================================================================//
	// Render Release List Item
	//===============================================================================================================//

	let releaseListItem = (
		<li>
			<div className="card--small">
				<figure>
					<picture>
						<img
							key={ props.releaseName ? he.decode(props.releaseName) : "" }
							src={ getImportedPicture }
							alt={ props.releaseName ? he.decode(props.releaseName) : "" }
							width="60px"
							height="60px"
						/>
					</picture>
				</figure>
				<div className="card__details">
					<h2>
						<Link to={{ pathname: `/releases/${props.releaseId}` }}>
							{ props.releaseName ? he.decode(props.releaseName) : "" }
						</Link>
					</h2>
					<ul className="details--inline">
						{ props.releaseCat ? <li><strong>Label: </strong>{ he.decode(props.releaseCat) }</li> : null }
						{ props.releaseYear ? <li><strong>Released: </strong>{ props.releaseYear }</li> : null }
					</ul>
				</div>
			</div>
		</li>
	);
	return releaseListItem;
};

//===============================================================================================================//

export default ReleaseListItem;
