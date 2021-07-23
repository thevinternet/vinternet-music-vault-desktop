import React, { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";
import UserComponent from "../../components/Things/User/User";

import Loader from "../../components/Utilities/UI/Loader/Loader";
import StatusMessage from "../../components/Utilities/UI/StatusMessage/StatusMessage";

//===============================================================================================================//

const Profile = props => {

	const authContext = useContext(AuthContext);

	//===============================================================================================================//

	let profile = <Loader />;
	if (!authContext.isAuth) {
		profile = (
			<div className="container">
				<h1>There was a problem with your request</h1>
				<StatusMessage
					status={"primary"}
					headline={"Unregistered User"}
					message={""}
					response={"No user is currently logged into Vinternet Music Vault. Please login to view your profile."}
					action={authContext.login}
					buttonText={`Login`}
				/>
			</div>
		);
	}
	if (authContext.isAuth) {
		profile = (
			<div className="container">
				<div className="panel">
					<UserComponent
						name={authContext.name}
						email={authContext.email}
						picture={authContext.picture}
					/>
				</div>
			</div>
		);
	}
	return profile;
}

export default Profile;
