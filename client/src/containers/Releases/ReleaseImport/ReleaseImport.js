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

	const importFilesHandler = event => {
		event.preventDefault();
		(async () => {
			const importedFiles = await window.api.fileImport(getImportLocation);
			console.log(importedFiles);
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
				<form>
					<div className={"userform"}>
						<fieldset>
							<p>{ getImportLocation }</p>
						</fieldset>
						<div className={"userform--actions"}>
							<Button type={"primary"} clicked={getImportLocationHandler}>
								Choose Folder
							</Button>
							<Button type={"success"} clicked={importFilesHandler}>
								Import Files
							</Button>
							<Button type={"warning"}>
								Cancel
							</Button>
						</div>
					</div>
				</form>
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
