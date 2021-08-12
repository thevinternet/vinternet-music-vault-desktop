import React, { useContext } from "react";

import "./Dashboard.scss";
import artistAvatar from "../../assets/images/site/avatar-artist.jpg";
import labelAvatar from "../../assets/images/site/avatar-label.jpg";
import releaseAvatar from "../../assets/images/site/avatar-release.jpg";
import trackAvatar from "../../assets/images/site/avatar-track.jpg";

import { AuthContext } from "../../context/AuthContext";
import DashboardListItem from "../../components/Lists/Dashboard/DashboardListItem";

//===============================================================================================================//

const Dashboard = props => {

	//===============================================================================================================//
	// Set Up Contexts
	//===============================================================================================================//

	const authContext = useContext(AuthContext);

	//===============================================================================================================//
	// Render Dashboard Utility
	//===============================================================================================================//

	let dashboard = (
		<div className="container">
			<h1>Dashboard</h1>
			<h2>User Details</h2>
			<ol className="list--block">
				<DashboardListItem
					name={authContext.name}
					altName={authContext.name}
					picture={ authContext.picture }
					link={authContext.isAuth ? "/profile" : ""}
					descriptionText={authContext.message}
				/>
			</ol>
			<h2>Artists</h2>
			<ol className="list--block">
				<DashboardListItem
					name={"View All Artists"}
					altName={"Artists"}
					picture={artistAvatar}
					link={"/artists"}
				/>
				{ authContext.isAuth ? (
					<DashboardListItem
						name={"Add New Artist"}
						altName={"Artists"}
						picture={artistAvatar}
						link={"/artists/new"}
					/>
				) : null }
			</ol>
			<h2>Labels</h2>
			<ol className="list--block">
				<DashboardListItem
					name={"View All Labels"}
					altName={"Labels"}
					picture={labelAvatar}
					link={"/labels"}
				/>
				{ authContext.isAuth ? (
					<DashboardListItem
						name={"Add New Label"}
						altName={"Labels"}
						picture={labelAvatar}
						link={"/labels/new"}
					/>
				) : null }
			</ol>
			<h2>Releases</h2>
			<ol className="list--block">
				<DashboardListItem
					name={"View All Releases"}
					altName={"Releases"}
					picture={releaseAvatar}
					link={"/releases"}
				/>
				{ authContext.isAuth ? (
					<DashboardListItem
						name={"Add New Release"}
						altName={"Releases"}
						picture={releaseAvatar}
						link={"/releases/new"}
					/>
				) : null }
				{ authContext.isAuth ? (
					<DashboardListItem
						name={"Import Releases"}
						altName={"Releases"}
						picture={releaseAvatar}
						link={"/releases/import"}
					/>
				)	: null }
			</ol>
			<h2>Tracks</h2>
			<ol className="list--block">
				<DashboardListItem
					name={"View All Tracks"}
					altName={"Tracks"}
					picture={trackAvatar}
					link={"/tracks"}
				/>
			</ol>
		</div>
	);
	return dashboard;
}

//===============================================================================================================//

export default Dashboard;
