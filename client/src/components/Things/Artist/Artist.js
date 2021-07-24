import React, { useContext } from "react";
import { Link } from "react-router-dom";
import he from "he";

import "./Artist.scss";

import { AuthContext } from "../../../context/AuthContext";
import Auxiliary from "../../../wrappers/Auxiliary/Auxiliary";

//===============================================================================================================//

const Artist = props => {

	const authContext = useContext(AuthContext);

	//===============================================================================================================//

	let artist = (
		<Auxiliary>
			<div className="profile__picture">
				<img
					key={props.artistName ? he.decode(props.artistName) : ""}
					src={props.picture.map(picture =>
						picture.location
						? process.env.PUBLIC_URL + `/assets/images/artists/${picture.location}`
						: process.env.PUBLIC_URL + "/assets/images/site/avatar-artist.jpg"
					)}
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
