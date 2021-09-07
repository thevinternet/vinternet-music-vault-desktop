import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import he from "he";

import "./TrackListItem.scss";
import trackAvatar from "../../../assets/images/site/avatar-track.jpg";

import useGetEncodedPicture from "../../../hooks/ui/GetEncodedPicture";

import Auxiliary from "../../../wrappers/Auxiliary/Auxiliary";

//===============================================================================================================//

const TrackListItem = props => {

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
	// Render Track List Item
	//===============================================================================================================//

	let trackListItem = (
		<li>
			<div className="card--small">
				<figure>
					<picture>
						<img
							key={ props.trackName ? he.decode(props.trackName) : "" }
							src={ getImportedPicture }
							alt={ props.trackName ? he.decode(props.trackName) : "" }
							width="60px"
							height="60px"
						/>
					</picture>
				</figure>
				<div className="card__details">
					<h2>
						<Link to={`/tracks/${props.trackId}`}>
							{ props.trackName ? he.decode(props.trackName) : "" }
						</Link>
					</h2>
					<Auxiliary>
						<ul className="details--inline">
							<li key={props.trackId}>
							<b>Artist(s): </b>
							{ props.trackArtist.map((artist, index, array) =>
								array.length - 1 === index ? (
									<span key={artist._id}>
										<Link to={`/artists/${artist._id}`}>
											{ artist.name ? he.decode(artist.name) : "" }
										</Link>
										{" - "}
									</span>
								) : (
									<span key={artist._id}>
										<Link to={`/artists/${artist._id}`}>
											{ artist.name ? he.decode(artist.name) : "" }
										</Link>
										{" & "}
									</span>
								)
							) }
							</li>
							<li key={props.trackCatalogue}>
								<b>Release: </b>
								<Link to={`/releases/${props.trackReleaseId}`}>
									{ he.decode(props.trackCatalogue) }
								</Link>
							</li>
						</ul>
					</Auxiliary>
					<Auxiliary>
						<ul className="details--inline">
							{ props.trackNumber ? <li><strong>Track:</strong> { props.trackNumber } </li> : null }
							{ props.trackGenre ? <li><strong>Genre:</strong> { he.decode(props.trackGenre) } </li> : null }
							{ props.trackMixKey ? <li><strong>Key:</strong> { he.decode(props.trackMixKey) } </li> : null }
							{ props.trackBpm ? <li><strong>BPM:</strong> { props.trackBpm } </li> : null }
						</ul>
					</Auxiliary>
				</div>
			</div>
		</li>
	);
	return trackListItem;
};

//===============================================================================================================//

export default TrackListItem;
