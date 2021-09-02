import React from "react";
import he from "he";

import Auxiliary from "../../../../wrappers/Auxiliary/Auxiliary";

//===============================================================================================================//

const ContentHtml = props => {
	let contentHtml = (
		<Auxiliary>
			{ props.message.length ? (
				<ol>
					{ props.message.length ? (
						props.message.map((message, index) =>
							<li
								key={index}
								dangerouslySetInnerHTML={{ __html: he.decode(message.msg) }}>
							</li>
						)
					) : null }
				</ol>
			) : null }
		</Auxiliary>
	)
	return contentHtml;
}

//===============================================================================================================//

export default ContentHtml;
