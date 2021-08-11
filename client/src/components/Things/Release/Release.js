import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import he from "he";

import "./Release.scss";
import releaseAvatar from "../../../assets/images/site/avatar-release.jpg";

import { AuthContext } from "../../../context/AuthContext";
import useGetEncodedPicture from "../../../hooks/ui/GetEncodedPicture";

import TrackListItem from "../../Lists/Track/TrackListItem";
import Auxiliary from "../../../wrappers/Auxiliary/Auxiliary";

//===============================================================================================================//

const Release = props => {

	//===============================================================================================================//
	// Set Up Contexts
	//===============================================================================================================//

	const authContext = useContext(AuthContext);

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
		getEncodedPictureHandler(props.releasePicture);
		if (importedPicture) { 
			setImportedPicture(importedPicture);
		}
		return function cleanup() {
			setImportedPicture(releaseAvatar);
		}
	}, [getEncodedPictureHandler, props.releasePicture, setImportedPicture, importedPicture]);

	//===============================================================================================================//
	// Render Release Thing
	//===============================================================================================================//

	let release = (
		<Auxiliary>
			<div className="profile__picture">
				<img
					key={props.releaseTitle ? he.decode(props.releaseTitle) : ""}
					src={getImportedPicture}
					alt={props.releaseTitle ? he.decode(props.releaseTitle) : ""}
					height="200px"
					width="200px"
				/>
			</div>
			<div className="profile__details">
				<h1>{props.releaseTitle ? he.decode(props.releaseTitle) : ""}</h1>
				<dl>
					{props.releaseArtist.length ? (
						<Auxiliary>
							<dt>Artists</dt>
							<dd>
								{props.releaseArtist.map((artist, index, arr) =>
									arr.length - 1 === index ? (
										<span key={artist.name ? he.decode(artist.name) + index : index}>
											<Link to={`/artists/${artist._id}`}>
												{artist.name ? he.decode(artist.name) : ""}
											</Link>
										</span>
									) : (
										<span key={artist.name ? he.decode(artist.name) + index : index}>
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
					{props.releaseLabel.length ? (
						<Auxiliary>
							<dt>Label</dt>
							<dd>
								{props.releaseLabel.map((label, index, arr) =>
									<Link key={label.name ? he.decode(label.name) : ""} to={`/labels/${label._id}`}>
										{label.name ? he.decode(label.name) : ""}
									</Link>
								)}
							</dd>
							<dt>Catalogue</dt>
							<dd>{props.releaseCat ? he.decode(props.releaseCat) : ""}</dd>
							<dt>Year</dt>
							<dd>{props.releaseYear}</dd>
						</Auxiliary>
					) : null }
					{props.releaseFormat.length ? (
						<Auxiliary>
							<dt>Format</dt>
							<dd>
								{ props.releaseFormat.map((format, index, arr) =>
									arr.length - 1 === index ? (
										format.released === "yes" ? (
											<span key={format.name ? he.decode(format.name) : ""}>
												{format.name ? he.decode(format.name) : ""}
											</span>
										) : null
									) : (
										format.released === "yes" ? (
											<span key={format.name ? he.decode(format.name) : ""}>
												{format.name ? he.decode(format.name) : ""}{", "}
											</span>
										) : null
									)
								)}
							</dd>
						</Auxiliary>
					) : null}
					{props.releaseLink ? (
						<Auxiliary>
							<dt>Reference Website</dt>
							<dd>
								<a href={props.releaseLink ? he.decode(props.releaseLink) : ""} target="_blank" rel="noopener noreferrer">Discogs</a>
							</dd>
						</Auxiliary>
					) : null }
				</dl>
				<h2>Tracks</h2>
				{props.releaseTracks.length ? (
					<ol className={"list--block"}>
						{props.releaseTracks.map((track, index) =>
							<TrackListItem
								key={track._id}
								trackId={track._id}
								trackName={track.name}
								trackArtist={track.artist_name}
								trackCat={track.release_catalogue}
								trackPicture={track.release_picture[0].picture}
								trackNumber={track.track_number}
								trackGenre={track.genre}
								trackMixKey={track.mixkey}
								trackBpm={track.bpm}
							/>
						)}
					</ol>
				) : (
					<p className="list--block">There are currently no tracks associated with this release.</p>
				)}
				{ authContext.isAuth ? (
					<div className="profile__actions">
						<Link
							to={{ pathname: `/releases/${props.releaseId}/edit` }}
							className="btn btn--primary"
						>
							Edit Release
						</Link>
					</div>
				) : null }
			</div>
		</Auxiliary>
	);
	return release;
};

//===============================================================================================================//

export default Release;
