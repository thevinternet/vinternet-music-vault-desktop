import React from "react";

import "./NavigationLetter.scss";

const NavigationLetter = props => {

	let alphabet = ["all", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

	let navigationLetter = (
		<nav className={"navigation--letter"}>
			{alphabet.length ? (
				<ol>
					{alphabet.map(letter => (
						<li 
							key={letter}
							className={letter === props.queryLetter ? "active" : ""}
							onClick={props.clicked}
						>
							{letter}
						</li>
					))}
				</ol>
			) : null }
		</nav>
	);
	return navigationLetter;
};

export default NavigationLetter;
