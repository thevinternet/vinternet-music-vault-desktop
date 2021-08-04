import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import he from "he";

import "./Track.scss";

import useGetEncodedPicture from "../../../hooks/ui/GetEncodedPicture";

import Auxiliary from "../../../wrappers/Auxiliary/Auxiliary";

//===============================================================================================================//

const Track = props => {

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
			console.log("Initial Import Track Picture Effect Running!");
			getEncodedPictureHandler(props.trackPicture);
			if (importedPicture) { setImportedPicture(importedPicture); }
		}
    return function cleanup() {
      mounted = false
    }
	}, [getEncodedPictureHandler, props.trackPicture, setImportedPicture, importedPicture]);

	//===============================================================================================================//
	// Render Track Thing
	//===============================================================================================================//

	let track = (
		<Auxiliary>
			<div className="profile__picture">
				<img
					key={props.trackName ? he.decode(props.trackName) : ""}
					src={getImportedPicture}
					alt={props.trackName ? he.decode(props.trackName) : ""}
					height="200px"
					width="200px"
				/>
			</div>
			<div className="profile__details">
				<h1>{props.trackName ? he.decode(props.trackName) : ""}</h1>
				<dl>
					{props.trackArtist.length ? (
						<Auxiliary>
							<dt>Artists</dt>
							<dd>
								{props.trackArtist.map((artist, index, array) =>
									array.length - 1 === index ? (
										<span key={artist.name ? he.decode(artist.name) : ""}>
											<Link to={`/artists/${artist._id}`}>
												{artist.name ? he.decode(artist.name) : ""}
											</Link>
										</span>
									) : (
										<span key={artist.name ? he.decode(artist.name) : ""}>
											<Link to={`/artists/${artist._id}`}>
												{artist.name ? he.decode(artist.name) : ""}
											</Link>
											,{" "}
										</span>
									)
								)}
							</dd>
						</Auxiliary>
					) : null}
					{props.trackLabel.length ? (
						<Auxiliary>
							<dt>Label</dt>
							<dd>
								{props.trackLabel.map((label) =>
									<Link key={label.name ? he.decode(label.name) : ""} to={`/labels/${label._id}`}>
										{label.name ? he.decode(label.name) : ""}
									</Link>
								)}
							</dd>
						</Auxiliary>
					) : null }
					{props.trackCat.length ? (
						<Auxiliary>
							<dt>Release</dt>
							<dd>
								{props.trackCat.map((catalogue) =>
									<Link key={catalogue.catalogue_id} to={`/releases/${catalogue._id}`}>
										{catalogue.catalogue ? he.decode(catalogue.catalogue) : ""}
									</Link>
								)}
							</dd>
						</Auxiliary>
					) : null}
					<Auxiliary>
						<dt>Genre</dt>
						<dd>{props.trackGenre ? he.decode(props.trackGenre) : ""}</dd>
						<dt>Key</dt>
						<dd>{props.trackMixkey ? he.decode(props.trackMixkey) : ""}</dd>
					</Auxiliary>
				</dl>
			</div>
		</Auxiliary>
	);
	return track;
};

//===============================================================================================================//

export default Track;
