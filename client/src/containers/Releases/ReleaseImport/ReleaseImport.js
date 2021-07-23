import React, { useState } from "react";
import { connect } from "react-redux";

import "./ReleaseImport.scss";

import Auxiliary from "../../../wrappers/Auxiliary/Auxiliary";

import Loader from "../../../components/Utilities/UI/Loader/Loader";
import StatusMessage from "../../../components/Utilities/UI/StatusMessage/StatusMessage";
import Button from "../../../components/Utilities/UI/Button/Button";

import * as releaseActions from "../../../store/actions/index";

const ReleaseImport = props => {

	const [getImportLocation, setImportLocation] = useState("");

	//===============================================================================================================//

	const releaseMessageHandler = event => {
		event.preventDefault();
		props.onResetStatus();
	};

	const getImportLocationHandler = event => {
		event.preventDefault();
		(async () => {
			const ImportLocation = await window.api.dialogFolder();
			setImportLocation(ImportLocation[0]);
		})();
	}

	//===============================================================================================================//

	let releaseImportForm = <Loader />;
	if (!props.stateLoading) {
		releaseImportForm = (
			<div className="container">
				<h1>Import Releases</h1>
				{ props.stateError ? (
					<Auxiliary>
						<StatusMessage
							status={"warning"}
							headline={props.stateError}
							response={props.stateResponse}
							message={props.stateFeedback}
							action={releaseMessageHandler}
							buttonText={`Close`}
						/>
					</Auxiliary>
				) : null }
				<div className="userform">
					<Button type={"primary"} clicked={getImportLocationHandler}>
						Choose Folder
					</Button>
					<p>{ getImportLocation }</p>
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
			dispatch(releaseActions.releaseResetStatus())
	};
};

//===============================================================================================================//

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ReleaseImport);
