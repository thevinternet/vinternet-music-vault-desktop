import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import he from "he";

import "./Artist.scss";
import artistAvatar from "../../../assets/images/site/avatar-artist.jpg";

import { AuthContext } from "../../../context/AuthContext";
import useGetEncodedPicture from "../../../hooks/ui/GetEncodedPicture";

import Auxiliary from "../../../wrappers/Auxiliary/Auxiliary";

//===============================================================================================================//

const Artist = props => {

	//===============================================================================================================//
	// Set Up Contexts
	//===============================================================================================================//

	const authContext = useContext(AuthContext);

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
	// Render Artist Thing
	//===============================================================================================================//

	let artist = (
		<Auxiliary>
			<div className="profile__picture">
				<img
					key={props.artistName ? he.decode(props.artistName) : ""}
					src={getImportedPicture}
					alt={props.artistName ? he.decode(props.artistName) : ""}
					height="200px"
					width="200px"
				/>
			</div>
			<div className="profile__details">
				<h1>{props.artistName ? he.decode(props.artistName) : ""}</h1>
				{props.realName || props.aliasName.length ? (
					<dl>
						{props.realName ? (
							<Auxiliary>
								<dt>Real Name</dt>
								<dd>{props.realName ? he.decode(props.realName) : ""}</dd>
							</Auxiliary>
						) : null }
						{props.aliasName.length ? (
							<Auxiliary>
								<dt>Aliases</dt>
								<dd>
									{props.aliasName.map((alias, index, arr) =>
										arr.length - 1 === index ? (
											<span key={alias.name ? he.decode(alias.name) + index : index}>
												<Link to={`/artists/${alias._id}`}>
													{alias.name ? he.decode(alias.name) : ""}
												</Link>
											</span>
										) : (
											<span key={alias.name ? he.decode(alias.name) + index : index}>
												<Link to={`/artists/${alias._id}`}>
													{alias.name ? he.decode(alias.name) : ""}
												</Link>
												,{" "}
											</span>
										)
									)}
								</dd>
							</Auxiliary>
						) : null }
					</dl>
				) : null }
				<h2>Profile</h2>
				<p>{props.profile ? he.decode(props.profile) : ""}</p>
				{props.website.length ? (
					<Auxiliary>
						<h3>Websites</h3>
						<ul>
							{props.website.map(site =>
								site.url ? (
									<li key={site.name ? he.decode(site.name) : ""}>
										<a
											href={site.url ? he.decode(site.url) : ""}
											target="_blank"
											rel="noopener noreferrer"
										>
											{site.name ? he.decode(site.name) : ""}
										</a>
									</li>
								) : null
							)}
						</ul>
					</Auxiliary>
				) : null }
				{ authContext.isAuth ? (
					<div className="profile__actions">
						<Link
							to={{ pathname: `/artists/${props.artistId}/edit` }}
							className="btn btn--primary"
						>
							Edit Artist
						</Link>
					</div>
				) : null }
			</div>
		</Auxiliary>
	);
	return artist;
};

//===============================================================================================================//

export default Artist;
