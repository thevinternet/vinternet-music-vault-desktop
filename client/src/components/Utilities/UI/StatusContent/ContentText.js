import React from "react";
import he from "he";

import Auxiliary from "../../../../wrappers/Auxiliary/Auxiliary";

//===============================================================================================================//

const ContentText = props => {
	let contentText = (
		<Auxiliary>
			{ props.message.length ? (
				<ol>
					{ props.message.map((message, index) =>
						<li key={index}>{ he.decode(message.msg) }
							{message.value || message.param || message.location ?
								<ul>
									{ message.value ? <li key={message.value}>value passed = '{ he.decode(message.value) }'</li> : null }
									{ message.param ? <li key={message.param}>param = '{ he.decode(message.param) }'</li> : null }
									{ message.location ? <li key={message.location}>location = '{ he.decode(message.location) }'</li> : null }
								</ul>
							: null }
						</li>
					) }
				</ol>
			) : null }
		</Auxiliary>
	)
	return contentText;
}

//===============================================================================================================//

export default ContentText;
