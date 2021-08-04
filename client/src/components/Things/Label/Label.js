import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import he from "he";

import "./Label.scss";

import { AuthContext } from "../../../context/AuthContext";
import useGetEncodedPicture from "../../../hooks/ui/GetEncodedPicture";

import Auxiliary from "../../../wrappers/Auxiliary/Auxiliary";

//===============================================================================================================//

const Label = props => {

	//===============================================================================================================//
	// Set Up Contexts
	//===============================================================================================================//

	const authContext = useContext(AuthContext);

	//===============================================================================================================//
	// Set Up Component STATE & Initialise HOOKS
	//===============================================================================================================//

	const [getImportedPicture, setImportedPicture] = useState(`${process.env.PUBLIC_URL}/assets/images/site/avatar-label.jpg`);
	const { importedPicture, getEncodedPictureHandler } = useGetEncodedPicture();

	//===============================================================================================================//
	// Setup useEffect Functions
	//===============================================================================================================//

	useEffect(() => {
		let mounted = true
		if (mounted) {
			console.log("Initial Import Label Picture Effect Running!");
			getEncodedPictureHandler(props.picture);
			if (importedPicture) { setImportedPicture(importedPicture); }
		}
    return function cleanup() {
      mounted = false
    }
	}, [getEncodedPictureHandler, props.picture, setImportedPicture, importedPicture]);

	//===============================================================================================================//
	// Render Label Thing
	//===============================================================================================================//

	let label = (
		<Auxiliary>
			<div className="profile__picture">
				<img
					key={props.labelName ? he.decode(props.labelName) : ""}
					src={getImportedPicture}
					alt={props.labelName ? he.decode(props.labelName) : ""}
					height="200px"
					width="200px"
				/>
			</div>
			<div className="profile__details">
				<h1>{props.labelName ? he.decode(props.labelName) : ""}</h1>
				{props.parentLabel.length || props.subsidiaryLabel.length ? (
					<dl>
						{props.parentLabel.length ? (
							<Auxiliary>
								<dt>Parent Label</dt>
								<dd>
									{props.parentLabel.map(parent => (
										<Link key={parent._id} to={`/labels/${parent._id}`}>
											{parent.name ? he.decode(parent.name) : ""}
										</Link>
									))}
								</dd>
							</Auxiliary>
						) : null}
						{props.subsidiaryLabel.length ? (
							<Auxiliary>
								<dt>Subsidiary Labels</dt>
								<dd>
									{props.subsidiaryLabel.map((subsidiary, index, arr) =>
										arr.length - 1 === index ? (
											<span key={subsidiary.name ? he.decode(subsidiary.name) + index : index}>
												<Link to={`/labels/${subsidiary._id}`}>
													{subsidiary.name ? he.decode(subsidiary.name) : ""}
												</Link>
											</span>
										) : (
											<span key={subsidiary.name ? he.decode(subsidiary.name) + index : index}>
												<Link to={`/labels/${subsidiary._id}`}>
													{subsidiary.name ? he.decode(subsidiary.name) : ""}
												</Link>
												,{" "}
											</span>
										)
									)}
								</dd>
							</Auxiliary>
						) : null}
					</dl>
				) : null}
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
				) : null}
				{ authContext.isAuth ? (
					<div className="profile__actions">
						<Link
							to={{ pathname: `/labels/${props.labelId}/edit` }}
							className="btn btn--primary"
						>
							Edit Label
						</Link>
					</div>
				) : null }
			</div>
		</Auxiliary>
	);
	return label;
};

//===============================================================================================================//

export default Label;
