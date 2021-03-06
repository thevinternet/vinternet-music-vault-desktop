import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { HashLink as Link } from "react-router-hash-link";

import "./ReleaseImport.scss";

import Auxiliary from "../../../wrappers/Auxiliary/Auxiliary";

import TrackImportListItem from "../../../components/Lists/Track/TrackImportListItem";

import Loader from "../../../components/Utilities/UI/Loader/Loader";
import LoaderImport from "../../../components/Utilities/UI/LoaderImport/LoaderImport";
import StatusPrompt from "../../../components/Utilities/UI/StatusPrompt/StatusPrompt";
import StatusMessage from "../../../components/Utilities/UI/StatusMessage/StatusMessage";
import Button from "../../../components/Utilities/UI/Button/Button";

import { sortArrayByName } from "../../../utilities/helpers";
import { accordion } from "../../../utilities/interfaceHelpers/accordion";

import * as releaseActions from "../../../store/actions/index";

const ReleaseImport = props => {

	//===============================================================================================================//
	// Set Up Component STATE
	//===============================================================================================================//

	const [getImportLocation, setImportLocation] = useState("No location specified, please choose a folder to import from your computer");
	const [getImportLocationReady, setImportLocationReady] = useState(false);
	const [getLoadingLocationStatus, setLoadingLocationStatus] = useState(false);

	const [getImportFile, setImportFile] = useState("No location specified, please choose a folder to import from your computer");
	const [getImportFileReady, setImportFileReady] = useState(false);
	const [getLoadingImportStatus, setLoadingImportStatus] = useState(false);

	const [getReviewFile, setReviewFile] = useState("There are currently 0 track results awaiting review");
	const [getReviewFileReady, setReviewFileReady] = useState(false);
	const [getLoadingReviewStatus, setLoadingReviewStatus] = useState(false);

	const [getImportFileArray, setImportFileArray] = useState("");

	const { stateError, stateSuccess, history } = props;

	//===============================================================================================================//
	// Setup useEffect Functions
	//===============================================================================================================//

	// Setup Accordion Effect
	useEffect(() => {
		accordion();
	}, []);

	// Handle Form POST Submission Return Success Effect
	useEffect(() => {
		if (stateSuccess !== null) {
			importReset();
		}
	}, [stateSuccess]);
	
	// Handle Form POST Submission Return Errors Effect
	useEffect(() => {
		if (stateError !== null) {
			importReset();
		}
	}, [stateError]);

	//===============================================================================================================//
	// Obtain Import Folder Location From Host Computer
	//===============================================================================================================//

	const getImportLocationHandler = async event => {
		event.preventDefault();
		setLoadingLocationStatus(true);
		const importLocation = await window.api.dialogFolder();
		if (importLocation.length) {
			setImportLocation(importLocation[0]);
			setImportLocationReady(true);
			setImportFile("Location folder specified, ready to import tracks from your computer");
			setImportFileReady(true);
		} else {
			setImportLocation("Folder selection cancelled, please choose a folder to import from your computer");	
		}
		setLoadingLocationStatus(false);
	}

	//===============================================================================================================//
	// Handle File Import From Host Computer
	//===============================================================================================================//

	const getImportFilesHandler = async event => {
		event.preventDefault();
		setLoadingImportStatus(true);
		const importedFiles = await window.api.fileImport(getImportLocation);
		if (importedFiles.length) {
			const importedFilesSorted = await sortArrayByName(importedFiles, "catalogue", "track_number");
			setImportFileArray(importedFilesSorted);
			setImportFile("Success! Files have been imported and are ready for review");
			setReviewFileReady(true);
			setReviewFile(`There are currently ${importedFiles.length} track results awaiting review`);
		} else {
			setImportFileReady(false);
			setImportFile("No valid files loacted in the folder specified, please choose another folder to import from your computer");
		}
		setLoadingImportStatus(false);
	}

	//===============================================================================================================//
	// Create & Handle Track Submission Object
	//===============================================================================================================//

	const trackImportHandler = event => {
		event.preventDefault();
		
		// Prepare API submission (Plain Object)

		const trackData = { 
			tracks: getImportFileArray
		};

		setLoadingReviewStatus(true);
		props.onSendImportedReleases(trackData);
	}

	//===============================================================================================================//
	// Track Import Action Helpers
	//===============================================================================================================//

	const importMessageHandler = event => {
		event.preventDefault();
		props.onResetStatus();
		importReset();
	};

	const importSuccessHandler = event => {
		event.preventDefault();
		props.onResetStatus();
		history.push({ pathname: "/releases" });
	};

	const importResetHandler = event => {
		event.preventDefault();
		importReset();
	}

	const importReset = () => {
		setImportLocation("No location specified, please choose a folder to import from your computer");
		setImportLocationReady(false);
		setLoadingLocationStatus(false);
		setImportFile("No location specified, please choose a folder to import from your computer");
		setImportFileReady(false);
		setLoadingImportStatus(false);
		setReviewFile("There are currently 0 track results awaiting review");
		setReviewFileReady(false);
		setLoadingReviewStatus(false);
		setImportFileArray("");
	};

	//===============================================================================================================//
	// Render Track Import Form
	//===============================================================================================================//

	let releaseImportForm = <Loader />;
	if (!props.stateLoading) {
		releaseImportForm = (
			<div className="container">
				<h1>Import Releases</h1>
				{ props.stateError ? (
					<Auxiliary>
						<StatusPrompt
							status={"warning"}
							headline={props.stateError}
							response={props.stateResponse}
							message={props.stateFeedback}
							textContent={true}
							action={importMessageHandler}
							buttonText={`Close`}
						/>
					</Auxiliary>
				) : null }
				{ props.stateSuccess ? (
					<Auxiliary>
						<StatusPrompt
							status={"success"}
							headline={props.stateSuccess}
							response={props.stateResponse}
							message={props.stateFeedback}
							htmlContent={true}
							action={importSuccessHandler}
							buttonText={`OK`}
						/>
					</Auxiliary>
				) : null }
				<div className={"importform"}>
					<fieldset>
						<legend>Step 1: Choose Folder Location</legend>
						<StatusMessage
							status={getImportLocationReady ? "success" : "warning"}
							message={getImportLocation}
						/>
						{ getLoadingLocationStatus
							? <LoaderImport />
							: null
						}
						<div className="importform--actions">
							<Button type={"primary"} clicked={getImportLocationHandler}>
								Choose Folder To Import
							</Button>
						</div>
					</fieldset>
					<fieldset>
						<legend>Step 2: Import Tracks From Folder Location</legend>
						<StatusMessage
							status={getImportFileReady ? "success" : "warning"}
							message={getImportFile}
						/>
						{ getLoadingImportStatus
							? <LoaderImport />
							: null
						}
						<div className="importform--actions">
							<Button type={getImportLocationReady ? "primary" : "disabled"}
								disabled={!getImportLocationReady}
								clicked={getImportFilesHandler}>
								Import Tracks From Computer
							</Button>
						</div>
					</fieldset>
					<fieldset>
						<legend>Step 3: Review Tracks &amp; Submit To Database</legend>
						<StatusMessage
							status={getReviewFileReady ? "success" : "warning"}
							message={getReviewFile}
						/>
						{ getImportFileArray.length ? (
							<details key={"accordionImport"}>
								<summary aria-expanded="false" data-accordion-control="true" aria-controls={`accordionContainerImport`} id={`accordionControlImport`}>
									View Tracks Ready For Import
								</summary>
								<div id={`accordionContainerImport`} role="region" aria-labelledby={`accordionControlImport`} data-accordion-content="true">
									<ol className="list--block">
										{getImportFileArray.map((track, index) => (
											<TrackImportListItem
												key={index}
												trackName={track.name}
												trackArtist={track.artist_name}
												trackCat={track.catalogue}
												trackGenre={track.genre}
												trackYear={track.year}
												trackPicture={track.release_picture}
											/>
										))}
									</ol>
								</div>
								<Link smooth to="#accordionControlImport">
									Back To Top
								</Link>
							</details>
						) : null }
						{ getLoadingReviewStatus
							? <LoaderImport />
							: null
						}
						<div className="importform--actions">
							<Button type={getReviewFileReady ? "primary" : "disabled"}
								disabled={!getReviewFileReady}
								clicked={trackImportHandler}>
								Submit Imported Tracks To Database
							</Button>
						</div>
					</fieldset>
					<div className={"userform--actions"}>
						<Button type={"warning"} clicked={importResetHandler}>
							Reset Import Form
						</Button>
					</div>
				</div>
			</div>
		);
	}
	return releaseImportForm;
}

//===============================================================================================================//
// Redux STATE Management
//===============================================================================================================//

const mapStateToProps = state => {
	return {
		stateLoading: state.release.loading,
		stateError: state.release.error,
		stateSuccess: state.release.success,
		stateResponse: state.release.response,
		stateFeedback: state.release.feedback
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onResetStatus: () => 
			dispatch(releaseActions.releaseResetStatus()),
		onSendImportedReleases: (trackData) =>
			dispatch(releaseActions.importReleaseSend(trackData))
	};
};

//===============================================================================================================//

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ReleaseImport);
