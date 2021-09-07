import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { HashLink as Link } from "react-router-hash-link";

import "./TrackList.scss";

import TrackListItem from "../../../components/Lists/Track/TrackListItem";
import NavigationLetter from "../../../components/Utilities/Navigation/NavigationLetter/NavigationLetter";
import Auxiliary from "../../../wrappers/Auxiliary/Auxiliary";

import Loader from "../../../components/Utilities/UI/Loader/Loader";
import StatusPrompt from "../../../components/Utilities/UI/StatusPrompt/StatusPrompt";
import StatusMessage from "../../../components/Utilities/UI/StatusMessage/StatusMessage";

import * as trackActions from "../../../store/actions/index";

//===============================================================================================================//

const TrackList = props => {

	//===============================================================================================================//
	// Set Up Component STATE
	//===============================================================================================================//

	const { onFetchTracks, stateQuery, stateQueryResults, history } = props;
	const [getShouldRedirect, setShouldRedirect] = useState(false);
	const [getActiveLetter, setActiveLetter] = useState("all");
	const [getSortAxis, setSortAxis] = useState("name");
	const [getQueryLimit, setQueryLimit] = useState(50);

	//===============================================================================================================//
	// Setup useEffect Functions
	//===============================================================================================================//

	// Get Tracks Effect
	useEffect(() => {
		setActiveLetter("all")
		onFetchTracks(stateQuery);
	}, [onFetchTracks, stateQuery]);

	// Redirect To Tracks List Effect
	useEffect(() => {
		if(getShouldRedirect) { history.push({ pathname: "/tracks/" }); }
	}, [getShouldRedirect, history])

	//===============================================================================================================//
	// Track Action Helpers
	//===============================================================================================================//

	const trackByFirstLetterHandler = (event) => {
		event.preventDefault();
		let letter = event.target.innerHTML;
		setActiveLetter(letter);

		const query = {
			letter: letter,
			sort: getSortAxis,
			limit : getQueryLimit,
		}

		onFetchTracks(query);
	}

	const trackMessageHandler = (event, redirect) => {
		event.preventDefault();
		props.onResetStatus();
		setShouldRedirect(redirect);
	};

	//===============================================================================================================//

	let trackList = <Loader />;
	if (!props.stateLoading && props.stateError) {
		trackList = (
			<div className="container">
				<h1>There was a problem with your request</h1>
				<StatusPrompt
					status={"warning"}
					headline={props.stateError}
					response={props.stateResponse}
					message={props.stateFeedback}
					textContent={true}
					action={event => trackMessageHandler(event, true)}
					buttonText={`OK`}
				/>
			</div>
		);
	}
	if (!props.stateLoading && props.stateTracks && !props.stateError) {
		trackList = (
			<div className="container">
				<h1>Tracks</h1>
				<p>Showing { stateQueryResults.sliceMin }{ stateQueryResults.sliceMax !== 0 ? `-${stateQueryResults.sliceMax}` : "" } of { stateQueryResults.count } results</p>
				<NavigationLetter
					queryLetter={getActiveLetter}
					clicked={event => trackByFirstLetterHandler(event) }
				/>
				<Auxiliary>
					{props.stateTracks.length ? (
						<ol className="list--block">
							{props.stateTracks.map(track => (
								<TrackListItem
									key={track.createdAt}
									trackId={track._id}
									trackName={track.name}
									trackArtist={track.artist_name}
									trackCatalogue={track.catalogue}
									trackReleaseId={track.release_id}
									trackPicture={track.release_picture[0].picture}
								/>
							))}
						</ol>
					) :
						<div className="list--block">
							<StatusMessage
								status={"warning"}
								message={props.stateFeedback}
							/>
						</div>
					}
				</Auxiliary>
				<Link smooth to="#content">
					Back To Top
				</Link>
			</div>
		);
	}
	return trackList;
}

//===============================================================================================================//
// Redux STATE Management
//===============================================================================================================//

const mapStateToProps = state => {
	return {
		stateTracks: state.track.tracks,
		stateQuery: state.track.query,
		stateQueryResults: state.track.queryResults,
		stateLoading: state.track.loading,
		stateError: state.track.error,
		stateSuccess: state.track.success,
		stateResponse: state.track.response,
		stateFeedback: state.track.feedback
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onFetchTracks: (query) => 
			dispatch(trackActions.fetchTracksSend(query)),
		onResetStatus: () => 
			dispatch(trackActions.trackResetStatus())
	};
};

//===============================================================================================================//

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TrackList);

//===============================================================================================================//
