import React, { useState, useEffect, useCallback } from "react";

//===============================================================================================================//
// Create Auth Context used in function components (Object propulated with values from Provider)
//===============================================================================================================//

export const AuthContext = React.createContext({
	isAuth: false,
	name: "",
	picture: "",
	message: "",
	authStatus: "",
	authDetails: "",
	login: "",
	logout: ""
});

//===============================================================================================================//
// Create Auth Context Provider passing on functionality to any component listening 
//===============================================================================================================//

const AuthContextProvider = props => {

	// Set up state
	const [getAuthenticatedStatus, setAutenticatedStatus] = useState(false);
	const [getAuthUserName, setAuthUserName] = useState("Unregistered User");
	const [getAuthUserEmail, setAuthUserEmail] = useState("");
	const [getAuthUserPicture, setAuthUserPicture] = useState(process.env.PUBLIC_URL + "/assets/images/site/avatar-artist.jpg");
	const [getAuthText, setAuthText] = useState("No user currently logged into Vinternet Music Vault");

	//===============================================================================================================//

	// Return profile details user currently held via Electron app & update state
	const checkAuthDetails = async () => {
		const profile = await window.api.userDetails();
		if (profile) {
			setAuthUserName(profile.name);
			setAuthUserPicture(profile.picture);
			setAuthUserEmail(profile.email);
			setAuthText(`Hi ${profile.name} (${profile.email}), welcome to the Vinternet Music Vault.`);
		} else {
			setAuthUserName("Unregistered User");
			setAuthUserPicture(process.env.PUBLIC_URL + "/assets/images/site/avatar-artist.jpg");
			setAuthUserEmail("");
			setAuthText("No user currently logged into Vinternet Music Vault");
		};
	};

	// Check current Auth Status by checking for Access Token via Electron app & update state
	const checkAuthStatus = useCallback(async () => {
		const isAuth = await window.api.userAuth();
		await checkAuthDetails();
		setAutenticatedStatus(isAuth);
	}, []);

	// Initiate Auth0 logout process via Electron app & update state
	const logoutHandler = async () => {
		const isAuth = await window.api.userLogout();
		if (!isAuth) {
			await checkAuthDetails();
			setAutenticatedStatus(isAuth);
		};
	};

	// Initiate Auth0 login process via Electron app & update state
	const loginHandler = async () => {
		const isAuth = await window.api.userLogin();
		if (isAuth) {
			await checkAuthDetails();
			setAutenticatedStatus(isAuth);
		};
	};

	//===============================================================================================================//

	// Initiate hook to check Auth status if AuthenticatedStatus state changes
	useEffect(() => {
		console.log("Get Auth Status Effect Running!");
		checkAuthStatus();
	}, [checkAuthStatus, getAuthenticatedStatus]);

	//===============================================================================================================//

	return (
		<AuthContext.Provider value={{
			authStatus: checkAuthStatus,
			authDetails: checkAuthDetails,
			login: loginHandler,
			logout: logoutHandler,
			isAuth: getAuthenticatedStatus,
			name: getAuthUserName,
			picture: getAuthUserPicture,
			email: getAuthUserEmail,
			message: getAuthText
		}}>
			{ props.children }
		</AuthContext.Provider>
	);
}

	//===============================================================================================================//

export default AuthContextProvider;
