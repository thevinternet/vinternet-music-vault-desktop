import React from "react";
import { Link } from "react-router-dom";

import "./User.scss";

import Auxiliary from "../../../wrappers/Auxiliary/Auxiliary";

//===============================================================================================================//

const user = props => {
	return (
		<Auxiliary>
			<div className="profile__picture">
				<img
					key={props.name}
					src={props.picture}
					alt={props.name}
					height="200px"
					width="200px"
				/>
			</div>
			<div className="profile__details">
				<h1>{props.name}</h1>
				<dl>
					<dt>Real Name</dt>
					<dd>{props.name}</dd>
					<dt>Email Address</dt>
					<dd>{props.email}</dd>
				</dl>
				<div className="profile__actions">
					<Link
						to={{ pathname: `/profile/edit` }}
						className="btn btn--primary"
					>
						Edit Profile
					</Link>
				</div>
			</div>
		</Auxiliary>
	);
};

//===============================================================================================================//

export default user;
