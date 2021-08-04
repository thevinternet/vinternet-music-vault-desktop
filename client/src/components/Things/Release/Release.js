import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import he from "he";

import "./Release.scss";

import { AuthContext } from "../../../context/AuthContext";
import useGetEncodedPicture from "../../../hooks/ui/GetEncodedPicture";

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

	const [getImportedPicture, setImportedPicture] = useState(`${process.env.PUBLIC_URL}/assets/images/site/avatar-release.jpg`);
	const { importedPicture, getEncodedPictureHandler } = useGetEncodedPicture();

	//===============================================================================================================//
	// Setup useEffect Functions
	//===============================================================================================================//

	useEffect(() => {
		let mounted = true
		if (mounted) {
			console.log("Initial Import Release Picture Effect Running!");
			getEncodedPictureHandler(props.releasePicture);
			if (importedPicture) { setImportedPicture(importedPicture); }
		}
    return function cleanup() {
      mounted = false
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
							<li key={track.name ? he.decode(track.name) : ""}>
								<div className="card--small">
									<figure>
										<picture>
											<img
												src={getImportedPicture}
												alt={track.track_number}
												width="60px"
												height="60px"
											/>
										</picture>
									</figure>
									<div className="card__details">
										<h2>
											{track.artist_name.map((artist, index, array) =>
												array.length - 1 === index ? (
													<span key={artist.name ? he.decode(artist.name) : ""}>
														{artist.name ? he.decode(artist.name) : ""}
													</span>
												) : (
													<span key={artist.name ? he.decode(artist.name) : ""}>
														{artist.name ? he.decode(artist.name) : ""}{" & "}
													</span>
												)
											)}
											{" - "}{track.name ? he.decode(track.name) : ""}
										</h2>
										<ul className="details--inline">
											<li><strong>Track:</strong> {track.track_number}</li>
											<li><strong>Genre:</strong> {track.genre ? he.decode(track.genre) : ""}</li>
											<li><strong>Key:</strong> {track.mixkey ? he.decode(track.mixkey) : ""}</li>
										</ul>
									</div>
								</div>
							</li>
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
