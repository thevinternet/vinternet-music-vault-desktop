import React, { useState, useEffect, useContext } from "react";
import "./Navigation.scss";

import { AuthContext } from "../../../context/AuthContext";

import Auxiliary from "../../../wrappers/Auxiliary/Auxiliary";

import NavigationItem from "./NavigationItem/NavigationItem";
import Button from "../../../components/Utilities/UI/Button/Button";
import Modal from "../../../components/Utilities/Modal/Modal";

//===============================================================================================================//

const Navigation = props => {

	// Create Component CONTEXT
	const authContext = useContext(AuthContext);

	// Setup Component STATE
	const [getShowModal, setShowModal] = useState(false);

	// Setup Component EFFECT to reset Modal when auth status changes
	useEffect(() => {
		if (authContext.isAuth === false) {
			setShowModal(false);
		}
	}, [authContext.isAuth])

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

	let navigation = (
		<Auxiliary>
			<nav>
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
