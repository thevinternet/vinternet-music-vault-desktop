import React from "react";

import "./File.scss";

import Auxiliary from "../../../../wrappers/Auxiliary/Auxiliary";

//===============================================================================================================//

const File = props => {

	let file = (
		<Auxiliary>
			<fieldset>
				<legend>Profile Image</legend>
				<div className="card">
					<figure>
						<picture>
							<img
								src={
									props.hasUpload
										? props.imageUpload
										: props.elementImage
								}
								alt={props.title}
								height="100px"
								width="100px"
							/>
						</picture>
					</figure>
					<div className="card__details">
						<input
							type={props.elementAttributes.type}
							name={props.elementAttributes.name}
							id={props.elementAttributes.id}
							onChange={props.changed}
						/>
						<label htmlFor={props.elementAttributes.labelFor} className="btn--primary">
							{props.elementAttributes.label}
						</label>
						<p>
							{props.hasUpload ? props.imageNameUpload : props.elementImageName}
						</p>
					</div>
				</div>
			</fieldset>
		</Auxiliary>
	);
	return file;
};

//===============================================================================================================//

export default File;
