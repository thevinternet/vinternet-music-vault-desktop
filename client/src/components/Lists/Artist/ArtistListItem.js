import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import he from "he";

import "./ArtistListItem.scss";

import useGetEncodedPicture from "../../../hooks/ui/GetEncodedPicture";

//===============================================================================================================//

const ArtistListItem = props => {

	//===============================================================================================================//
	// Set Up Component STATE & Initialise HOOKS
	//===============================================================================================================//

	const [getImportedPicture, setImportedPicture] = useState(`${process.env.PUBLIC_URL}/assets/images/site/avatar-artist.jpg`);
	const { importedPicture, getEncodedPictureHandler } = useGetEncodedPicture();

	//===============================================================================================================//
	// Setup useEffect Functions
	//===============================================================================================================//

	useEffect(() => {
		let mounted = true
		if (mounted) {
			console.log("Initial Import Artist Pictures Effect Running!");
			getEncodedPictureHandler(props.picture);
			if (importedPicture) { setImportedPicture(importedPicture); }
		}
    return function cleanup() {
      mounted = false
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
							key={props.artistName ? he.decode(props.artistName) : ""}
							src={getImportedPicture}
							alt={props.artistName ? he.decode(props.artistName) : ""}
							width="60px"
							height="60px"
						/>
					</picture>
				</figure>
				<div className="card__details">
					<h2>
						<Link to={{ pathname: `/artists/${props.artistId}` }}>
							{props.artistName ? he.decode(props.artistName) : ""}
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
