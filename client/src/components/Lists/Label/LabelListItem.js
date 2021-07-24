import React from "react";
import { Link } from "react-router-dom";
import he from "he";

import "./LabelListItem.scss";

//===============================================================================================================//

const labelListItem = props => {
	return (
		<li>
			<div className="card--small">
				<figure>
					<picture>
						<img
							key={props.labelName ? he.decode(props.labelName) : ""}
							src={props.picture.map(picture =>
								picture.location
									? process.env.PUBLIC_URL + `/assets/images/labels/${picture.location}`
									: process.env.PUBLIC_URL + "/assets/images/site/avatar-label.jpg"
						)}
							alt={props.labelName ? he.decode(props.labelName) : ""}
							width="60px"
							height="60px"
						/>
					</picture>
				</figure>
				<div className="card__details">
					<h2>
						<Link to={{ pathname: `/labels/${props.labelId}` }}>
							{props.labelName ? he.decode(props.labelName) : ""}
						</Link>
					</h2>
				</div>
			</div>
		</li>
	);
};

//===============================================================================================================//

export default labelListItem;
