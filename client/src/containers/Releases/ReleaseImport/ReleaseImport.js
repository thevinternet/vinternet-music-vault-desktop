import React, { useState } from "react";
import { connect } from "react-redux";

import "./ReleaseImport.scss";

import Auxiliary from "../../../wrappers/Auxiliary/Auxiliary";

import FileDirectoryInput from "../../../components/Utilities/Form/File/FileDirectory";

import Loader from "../../../components/Utilities/UI/Loader/Loader";
import StatusMessage from "../../../components/Utilities/UI/StatusMessage/StatusMessage";

import * as releaseActions from "../../../store/actions/index";


const ReleaseImport = props => {

	const [getAvatar, setAvatar] = useState("releases/avatar.jpg");
	const [getAvatarName, setAvatarName] = useState("No directory selected");
	const [getAvatarFile, setAvatarFile] = useState("");
	const [getFormIsValid, setFormIsValid] = useState(true);

	//===============================================================================================================//

	const imageUploadPreviewHandler = event => {
		event.preventDefault();
		console.log(event);
		console.log(URL.createObjectURL(event.target.files[0]));
	}

	const releaseMessageHandler = event => {
		event.preventDefault();
		props.onResetStatus();
	};

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
					<form>
						<div className="input-wrapper">
							<FileDirectoryInput
								key={1}
								type={"file"}
								id={"directoryUpload"}
								name={"directoryUpload"}
								label={"Choose Directory"}
								labelFor={"directoryUpload"}
								image={getAvatar}
								directoryDefault={
									getAvatarFile
										? getAvatarFile
										: getAvatarName
								}
								hasUpload={getAvatarFile ? true : false}
								directoryUpload={getAvatarFile}
								importTypeTitle={"Import Releases From WebDav Server"}
								changed={event => imageUploadPreviewHandler(event)}
							/>
						</div>
					</form>
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
