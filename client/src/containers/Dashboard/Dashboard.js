import React, { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";
import DashboardListItem from "../../components/Lists/Dashboard/DashboardListItem";

//===============================================================================================================//

const Dashboard = props => {

	const authContext = useContext(AuthContext);

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
					picture={ process.env.PUBLIC_URL + "/assets/images/site/avatar-artist.jpg" }
					link={"/artists"}
				/>
				{ authContext.isAuth
					? <DashboardListItem
						name={"Add New Artist"}
						altName={"Artists"}
						picture={ process.env.PUBLIC_URL + "/assets/images/site/avatar-artist.jpg" }
						link={"/artists/new"}
					/>
					: null
				}
			</ol>
			<h2>Labels</h2>
			<ol className="list--block">
				<DashboardListItem
					name={"View All Labels"}
					altName={"Labels"}
					picture={ process.env.PUBLIC_URL + "/assets/images/site/avatar-label.jpg" }
					link={"/labels"}
				/>
				{ authContext.isAuth
					? <DashboardListItem
						name={"Add New Label"}
						altName={"Labels"}
						picture={ process.env.PUBLIC_URL + "/assets/images/site/avatar-label.jpg" }
						link={"/labels/new"}
					/>
					: null
				}
			</ol>
			<h2>Releases</h2>
			<ol className="list--block">
				<DashboardListItem
					name={"View All Releases"}
					altName={"Releases"}
					picture={ process.env.PUBLIC_URL + "/assets/images/site/avatar-release.jpg" }
					link={"/releases"}
				/>
				{ authContext.isAuth
					? <DashboardListItem
						name={"Add New Release"}
						altName={"Releases"}
						picture={ process.env.PUBLIC_URL + "/assets/images/site/avatar-release.jpg" }
						link={"/releases/new"}
					/>
					: null
				}
				{ authContext.isAuth
					? <DashboardListItem
						name={"Import Releases"}
						altName={"Releases"}
						picture={ process.env.PUBLIC_URL + "/assets/images/site/avatar-release.jpg" }
						link={"/releases/import"}
					/>
					: null
				}
			</ol>
			<h2>Tracks</h2>
			<ol className="list--block">
				<DashboardListItem
					name={"View All Tracks"}
					altName={"Tracks"}
					picture={ process.env.PUBLIC_URL + "/assets/images/site/avatar-track.jpg" }
					link={"/tracks"}
				/>
			</ol>
		</div>
	);
	return dashboard;
}

export default Dashboard;
