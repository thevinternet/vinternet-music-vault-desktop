import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import he from "he";

import "./TrackListItem.scss";

import useGetEncodedPicture from "../../../hooks/ui/GetEncodedPicture";

import Auxiliary from "../../../wrappers/Auxiliary/Auxiliary";

//===============================================================================================================//

const TrackListItem = props => {

	//===============================================================================================================//
	// Set Up Component STATE & Initialise HOOKS
	//===============================================================================================================//

	const [getImportedPicture, setImportedPicture] = useState(`${process.env.PUBLIC_URL}/assets/images/site/avatar-track.jpg`);
	const { importedPicture, getEncodedPictureHandler } = useGetEncodedPicture();

	//===============================================================================================================//
	// Setup useEffect Functions
	//===============================================================================================================//

	useEffect(() => {
		let mounted = true
		if (mounted) {
			console.log("Initial Import Track Pictures Effect Running!");
			getEncodedPictureHandler(props.trackPicture);
			if (importedPicture) { setImportedPicture(importedPicture); }
		}
    return function cleanup() {
      mounted = false
    }
	}, [getEncodedPictureHandler, props.trackPicture, setImportedPicture, importedPicture]);

	//===============================================================================================================//
	// Render Track List Item
	//===============================================================================================================//

	let trackListItem = (
		<li>
			<div className="card--small">
				<figure>
					<picture>
						<img
							key={props.trackName ? he.decode(props.trackName) : ""}
							src={getImportedPicture}
							alt={props.trackName ? he.decode(props.trackName) : ""}
							width="60px"
							height="60px"
						/>
					</picture>
				</figure>
				<div className="card__details">
					<h2>
						{ props.trackArtist.map((artist, index, array) =>
							array.length - 1 === index ? (
								<span key={artist._id}>
									<Link to={`/artists/${artist._id}`}>
										{artist.name ? he.decode(artist.name) : ""}
									</Link>
									{" - "}
								</span>
							) : (
								<span key={artist._id}>
									<Link to={`/artists/${artist._id}`}>
										{artist.name ? he.decode(artist.name) : ""}
									</Link>
									{" & "}
								</span>
							)
						) }
						<Link to={`/tracks/${props.trackId}`}>
							{props.trackName ? he.decode(props.trackName) : ""}
						</Link>
					</h2>
					{ props.trackCat.length ? (
						<Auxiliary>
							<ul className="details--inline">
								{ props.trackCat.map((catalogue) =>
									<li key={catalogue._id}>
										<span>
											<Link to={`/releases/${catalogue._id}`}>
												{catalogue.catalogue ? he.decode(catalogue.catalogue) : ""}
											</Link>
										</span>
									</li>
								) }
							</ul>
						</Auxiliary>
					) : null }
				</div>
			</div>
		</li>
	);
	return trackListItem;
};

//===============================================================================================================//

export default TrackListItem;
