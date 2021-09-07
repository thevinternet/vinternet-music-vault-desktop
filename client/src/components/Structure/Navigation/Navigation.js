import React, { useState, useEffect, useContext } from "react";

import "./Navigation.scss";

import { AuthContext } from "../../../context/AuthContext";

import Auxiliary from "../../../wrappers/Auxiliary/Auxiliary";

import NavigationItem from "./NavigationItem/NavigationItem";
import Button from "../../../components/Utilities/UI/Button/Button";
import Modal from "../../../components/Utilities/Modal/Modal";

//===============================================================================================================//

const Navigation = props => {

	//===============================================================================================================//
	// Set Up Contexts
	//===============================================================================================================//

	const authContext = useContext(AuthContext);

	//===============================================================================================================//
	// Set Up Component STATE
	//===============================================================================================================//

	const [getShowModal, setShowModal] = useState(false);

	//===============================================================================================================//
	// Setup useEffect Functions
	//===============================================================================================================//

	// Reset Modal On Auth Status Change Effect
	useEffect(() => {
		if (authContext.isAuth === false) {
			setShowModal(false);
		}
	}, [authContext.isAuth])

	//===============================================================================================================//
	// Navigation Action Helpers
	//===============================================================================================================//

	// Open Logout Modal Handler
	const logoutCheckHandler = event => {
		event.preventDefault();
		setShowModal(true);
	};

	// Close Logout Modal Handler
	const logoutCancelHandler = event => {
		event.preventDefault();
		setShowModal(false);
	};

	//===============================================================================================================//
	// Render Navigation Component
	//===============================================================================================================//

	let navigation = (
		<Auxiliary>
			<nav className={"navigation--menu"}>
				<ul>
					<NavigationItem link="/">Dashboard</NavigationItem>
					<NavigationItem link="/artists">Artists</NavigationItem>
					<NavigationItem link="/labels">Labels</NavigationItem>
					<NavigationItem link="/releases">Releases</NavigationItem>
					<NavigationItem link="/tracks">Tracks</NavigationItem>
					{ authContext.isAuth
						? <NavigationItem link="/profile">Profile</NavigationItem>
						: null
					}
					{ authContext.isAuth
						? <li><Button type={"primary"} clicked={logoutCheckHandler}>Logout</Button></li>
						: <li><Button type={"primary"} clicked={authContext.login}>Login</Button></li>
					}
				</ul>
			</nav>
			<Modal
				show={getShowModal}
				hide={logoutCancelHandler}
				action={authContext.logout}
				status={"warning"}
				headline={`Confirm Logout`}
				bespokeText={`Please confirm you wish to logout from Vinternet Music Vault.`}
				buttonText={`Logout`}
			>
				<Button type={"grey"} clicked={logoutCancelHandler}>
					Cancel
				</Button>
			</Modal>
		</Auxiliary>
	);
	return navigation;
};

//===============================================================================================================//

export default Navigation;
