import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import he from "he";

import "./ArtistListItem.scss";
import artistAvatar from "../../../assets/images/site/avatar-artist.jpg";

import useGetEncodedPicture from "../../../hooks/ui/GetEncodedPicture";

//===============================================================================================================//

const ArtistListItem = props => {

	//===============================================================================================================//
	// Set Up Component STATE & Initialise HOOKS
	//===============================================================================================================//

	const [getImportedPicture, setImportedPicture] = useState(artistAvatar);
	const { importedPicture, getEncodedPictureHandler } = useGetEncodedPicture();

	//===============================================================================================================//
	// Setup useEffect Functions
	//===============================================================================================================//

	// Import Artist Pictures Via Electron IPC Effect
	useEffect(() => {
		getEncodedPictureHandler(props.picture);
		if (importedPicture) { 
			setImportedPicture(importedPicture);
		}
		return function cleanup() {
			setImportedPicture(artistAvatar);
		}
	}, [getEncodedPictureHandler, props.picture, setImportedPicture, importedPicture]);

	//===============================================================================================================//
	// Render Artist List Item
	//===============================================================================================================//

	let artistListItem = (
		<li>
			<div className="card--small">
				<figure>
					<picture>
						<img
							key={ props.artistName ? he.decode(props.artistName) : "" }
							src={ getImportedPicture }
							alt={ props.artistName ? he.decode(props.artistName) : "" }
							width="60px"
							height="60px"
						/>
					</picture>
				</figure>
				<div className="card__details">
					<h2>
						<Link to={{ pathname: `/artists/${props.artistId}` }}>
							{ props.artistName ? he.decode(props.artistName) : "" }
						</Link>
					</h2>
				</div>
			</div>
		</li>
	);
	return artistListItem;
};

//===============================================================================================================//

export default ArtistListItem;
