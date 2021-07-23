import React from "react";
import { Link } from "react-router-dom";

import "./DashboardListItem.scss";

//===============================================================================================================//

const dashboardListItem = props => {
	return (
		<li>
			<div className="card--small">
				<figure>
					<picture>
						<img
							key={ props.name }
							src={ props.picture }
							alt={ props.altName }
							width="60px"
							height="60px"
						/>
					</picture>
				</figure>
				<div className="card__details">
					<h2>
						<Link to={{ pathname: props.link }}>
							{ props.name }
						</Link>
					</h2>
					<p>{ props.descriptionText }</p>
				</div>
			</div>
		</li>
	);
};

//===============================================================================================================//

export default dashboardListItem;
