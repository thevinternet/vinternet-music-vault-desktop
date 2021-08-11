import React, { useState, useEffect } from "react";

import "./TrackListItem.scss";
import trackAvatar from "../../../assets/images/site/avatar-track.jpg";

import useGetEncodedPicture from "../../../hooks/ui/GetEncodedPicture";

import Auxiliary from "../../../wrappers/Auxiliary/Auxiliary";

//===============================================================================================================//

const TrackImportListItem = props => {

	//===============================================================================================================//
	// Set Up Component STATE & Initialise HOOKS
	//===============================================================================================================//

	const [getImportedPicture, setImportedPicture] = useState(trackAvatar);
	const { importedPicture, getEncodedPictureHandler } = useGetEncodedPicture();

	//===============================================================================================================//
	// Setup useEffect Functions
	//===============================================================================================================//

	// Import Track Pictures Via Electron IPC Effect
	useEffect(() => {
		getEncodedPictureHandler(props.trackPicture);
		if (importedPicture) { 
			setImportedPicture(importedPicture);
		}
		return function cleanup() {
			setImportedPicture(trackAvatar);
		}
	}, [getEncodedPictureHandler, props.trackPicture, setImportedPicture, importedPicture]);

	//===============================================================================================================//
	// Render Imported Track List Item
	//===============================================================================================================//

	let trackImportListItem = (
		<li>
			<div className="card--small">
				<figure>
					<picture>
						<img
							key={props.trackName}
							src={getImportedPicture}
							alt={props.trackName}
							width="60px"
							height="60px"
						/>
					</picture>
				</figure>
				<div className="card__details">
						<h2>
							{ props.trackArtist.map((artist, index, array) =>
								array.length - 1 === index ? (
									<span key={index}>
										{ artist.name }{" - "}
									</span>
								) : (
									<span key={index}>
										{ artist.name }{" & "}
									</span>
								)
							)}
							{ props.trackName }
						</h2>
						{ props.trackCat ? (
						<Auxiliary>
							<ul className="details--inline" key={props.trackCat}>
								<li><strong>Label/Release:</strong> { props.trackCat }</li>
								<li><strong>Genre:</strong> {props.trackGenre}</li>
								<li><strong>Year:</strong> {props.trackYear}</li>
							</ul>
						</Auxiliary>
					) : null }
				</div>
			</div>
		</li>
	);
	return trackImportListItem
}

//===============================================================================================================//

export default TrackImportListItem;
