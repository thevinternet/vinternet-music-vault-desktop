import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import "./Release.scss";

import ReleaseComponent from "../../../components/Things/Release/Release";

import Loader from "../../../components/Utilities/UI/Loader/Loader";
import Modal from "../../../components/Utilities/Modal/Modal";
import StatusPrompt from "../../../components/Utilities/UI/StatusPrompt/StatusPrompt";

import * as releaseActions from "../../../store/actions/index";

//===============================================================================================================//

const Release = props => {

	//===============================================================================================================//
	// Set Up Component STATE
	//===============================================================================================================//

	const { onFetchRelease, onFetchTracks, onTrackResetStatus, onTrackResetResults, stateTrackError, history, match } = props;
	const [getShouldRedirect, setShouldRedirect] = useState(false);

	if (stateTrackError) { 
		onTrackResetStatus();
	}

	//===============================================================================================================//
	// Setup useEffect Functions
	//===============================================================================================================//

	// Get Release & Tracks Effect
	useEffect(() => {
		onFetchRelease(match.params.id, false);
		onFetchTracks(match.params.id);
	}, [onFetchRelease, onFetchTracks, match]);

	// Redirect To Releases List Effect
	useEffect(() => {
		if (getShouldRedirect) { 
			history.push({ pathname: "/releases/" }); 
		}
	}, [getShouldRedirect, history]);

	// Reset Track Results & Status Props Effect
	useEffect(() => {
		if (stateTrackError) { 
			onTrackResetStatus();
			onTrackResetResults();
		}
	}, [stateTrackError, onTrackResetStatus, onTrackResetResults])

	//===============================================================================================================//
	// Release Action Helpers
	//===============================================================================================================//

	const releaseMessageHandler = (event, redirect) => {
		event.preventDefault();
		props.onReleaseResetStatus();
		props.onTrackResetStatus();
		setShouldRedirect(redirect);
	};

	//===============================================================================================================//
	// Render Release Thing
	//===============================================================================================================//

	let release = <Loader />;
	if (!props.stateLoading && props.stateReleaseError) {
		release = (
			<div className="container">
				<h1>There was a problem with your request</h1>
				<StatusPrompt
					status={"warning"}
					headline={props.stateReleaseError}
					response={props.stateResponse}
					message={props.stateFeedback}
					textContent={true}
					action={event => releaseMessageHandler(event, true)}
					buttonText={`OK`}
				/>
			</div>
		);
	}
	if (!props.stateLoading && props.stateRelease && !props.stateReleaseError) {
		release = (
			<div className="container">
				<div className="panel">
					<ReleaseComponent
						releaseId={props.stateRelease._id}
						releaseArtist={props.stateRelease.artist_name}
						releaseTitle={props.stateRelease.title}
						releaseLabel={props.stateRelease.label_name}
						releaseCat={props.stateRelease.catalogue}
						releaseTracks={props.stateTracks}
						releaseYear={props.stateRelease.year}
						releaseFormat={props.stateRelease.format}
						releasePicture={props.stateRelease.picture}
						releaseLink={props.stateRelease.discogs_url}
					/>
				</div>
				{ props.stateSuccess ? (
					<Modal
						show={true}
						hide={event => releaseMessageHandler(event, false)}
						action={event => releaseMessageHandler(event, false)}
						status={"success"}
						headline={props.stateSuccess}
						response={props.stateResponse}
						message={props.stateFeedback}
						buttonText={`OK`}
					/>
				) : null }
			</div>
		);
	}
	return release;
}

//===============================================================================================================//
// Redux STATE Management
//===============================================================================================================//

const mapStateToProps = state => {
	return {
		stateRelease: state.release.release,
		stateTracks: state.track.tracks,
		stateLoading: state.release.loading,
		stateSuccess: state.release.success,
		stateResponse: state.release.response,
		stateFeedback: state.release.feedback,
		stateReleaseError: state.release.error,
		stateTrackError: state.track.error
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onFetchRelease: (releaseId, edit) =>
			dispatch(releaseActions.fetchReleaseSend(releaseId, edit)),
		onFetchTracks: (releaseId, edit) =>
			dispatch(releaseActions.fetchTracksByReleaseSend(releaseId, edit)),
		onReleaseResetStatus: () =>
			dispatch(releaseActions.releaseResetStatus()),
		onTrackResetStatus: () =>
			dispatch(releaseActions.trackResetStatus()),
		onTrackResetResults: () =>
			dispatch(releaseActions.trackResetResults())
	};
};

//===============================================================================================================//

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Release);

//===============================================================================================================//
