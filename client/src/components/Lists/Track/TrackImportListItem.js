import React from "react";

import "./TrackListItem.scss";

import Auxiliary from "../../../wrappers/Auxiliary/Auxiliary";

//===============================================================================================================//

const TrackImportListItem = props => {

	let trackImportListItem = (
		<li>
			<div className="card--small">
				<figure>
					<picture>
						<img
							key={props.trackName}
							src={props.trackPicture.map(picture =>
								picture.data
									? `data:${picture.format};base64,${Buffer.from(picture.data).toString('base64')}`
									: process.env.PUBLIC_URL + "/assets/images/site/avatar-track.jpg"
							)}
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
