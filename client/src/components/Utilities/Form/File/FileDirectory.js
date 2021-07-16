import React from "react";

import "./FileDirectory.scss";

import Auxiliary from "../../../../wrappers/Auxiliary/Auxiliary";

//===============================================================================================================//

const fileDirectory = props => {
	return (
		<Auxiliary>
			<fieldset>
				<legend>{props.importTypeTitle}</legend>
				<div className="card">
					<figure>
						<picture>
							<img
								src={process.env.PUBLIC_URL + `/assets/images/${props.image}`}
								alt={props.importTypeTitle}
								height="100px"
								width="100px"
							/>
						</picture>
					</figure>
					<div className="card__details">
						<input
							type={props.type}
							name={props.name}
							id={props.id}
							directory=""
							webkitdirectory=""
							onChange={props.changed}
						/>
						<label htmlFor={props.labelFor} className="btn--primary">
							{props.label}
						</label>
						<p>
							{props.hasUpload ? props.directoryUpload : props.directoryDefault}
						</p>
					</div>
				</div>
			</fieldset>
		</Auxiliary>
	);
};

//===============================================================================================================//

export default fileDirectory;
