import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import "./ReleaseAdd.scss";
import releaseAvatar from "../../../assets/images/site/avatar-release.jpg";

import Auxiliary from "../../../wrappers/Auxiliary/Auxiliary";

import Input from "../../../components/Utilities/Form/Input/Input";
import FileInput from "../../../components/Utilities/Form/File/File";
import FuzzyInput from "../../../components/Utilities/Form/FuzzyInput/FuzzyInput";
import FuzzyInputDelete from "../../../components/Utilities/Form/FuzzyInput/FuzzyInputDelete";

import Button from "../../../components/Utilities/UI/Button/Button";
import Loader from "../../../components/Utilities/UI/Loader/Loader";
import StatusPrompt from "../../../components/Utilities/UI/StatusPrompt/StatusPrompt";

import * as objBuilderRelease from "../../../utilities/objectHelpers/objectBuilderRelease"
import { dropdownDatalistSetup } from "../../../utilities/formHelpers/formFuzzyDropdown";
import { accordion } from "../../../utilities/interfaceHelpers/accordion";

import useHandleInputChange from "../../../hooks/form/HandleInputChange";
import useHandleFuzzyInputChange from "../../../hooks/form/HandleFuzzyInputChange";
import useHandleInputAddition from "../../../hooks/form/HandleInputAddition";
import useHandleInputDeletion from "../../../hooks/form/HandleInputDeletion";
import useHandleDropdownItemSelect from "../../../hooks/form/HandleDropdownItemSelect";

import * as releaseActions from "../../../store/actions/index";

//===============================================================================================================//

const ReleaseAdd = props => {

	//===============================================================================================================//
	// Set Up Component STATE & Initialise HOOKS
	//===============================================================================================================//

	const [getAvatar, setAvatar] = useState(releaseAvatar);
	const [getAvatarName, setAvatarName] = useState("No file(s) selected");
	const [getAvatarFile, setAvatarFile] = useState("");
	const [getFormIsValid, setFormIsValid] = useState(false);

	const { onCreateReleaseForm, onCreateTrackForm, onFetchArtists, onFetchLabels, onEditLocalRelease, onEditLocalTrack, stateSuccess, history } = props;
	const { updatedFormStd, formIsValidStd, inputChangeHandler } = useHandleInputChange();
	const { updatedFormFzy, formIsValidFzy, dataListIdFzy, fuzzyInputChangeHandler } = useHandleFuzzyInputChange();
	const { updatedFormAdd, inputAddHandler } = useHandleInputAddition();
	const { updatedFormDel, inputDeleteHandler } = useHandleInputDeletion();
	const { updatedFormDds, dropdownItemSelectHandler } = useHandleDropdownItemSelect();
	
	//===============================================================================================================//
	// Setup useEffect Functions
	//===============================================================================================================//

	// Get Artists, Labels, Create New Release & Track Forms Effect
	useEffect(() => {
		onCreateReleaseForm();
		onCreateTrackForm();
		onFetchArtists();
		onFetchLabels();
		accordion();
	}, [onCreateReleaseForm, onCreateTrackForm, onFetchArtists, onFetchLabels]);

	//===============================================================================================================//
	
	// Handle Standard Input Change (Release & Tracks) Effect
	useEffect(() => {
		if (updatedFormStd) {
			setFormIsValid(formIsValidStd);

			if (updatedFormStd.releaseForm) {
				onEditLocalRelease(updatedFormStd); 
			}
			else if (updatedFormStd[0].trackForm) {
				onEditLocalTrack(updatedFormStd); 
			}
		}
	}, [formIsValidStd, updatedFormStd, onEditLocalRelease, onEditLocalTrack]);

	//===============================================================================================================//

	// Handle Fuzzy Input Change (Release & Tracks) Effect
	useEffect(() => {
		if (updatedFormFzy && dataListIdFzy) {
			dropdownDatalistSetup(dataListIdFzy);
			setFormIsValid(formIsValidFzy);

			if (updatedFormFzy.releaseForm) {
				onEditLocalRelease(updatedFormFzy); 
			}
			else if (updatedFormFzy[0].trackForm) {
				onEditLocalTrack(updatedFormFzy); 
			}
		}
	}, [dataListIdFzy, formIsValidFzy, updatedFormFzy, onEditLocalRelease, onEditLocalTrack]);

	// Handle Fuzzy DropDown Selection (Release & Tracks) Effect
	useEffect(() => {
		if (updatedFormDds) {
			if (updatedFormDds.releaseForm) {
				onEditLocalRelease(updatedFormDds); 
			}
			else if (updatedFormDds[0].trackForm) {
				onEditLocalTrack(updatedFormDds); 
			}
		}
	}, [updatedFormDds, onEditLocalRelease, onEditLocalTrack]);

	//===============================================================================================================//
	
	// Handle Add New Input Element (Track Only) Effect
	useEffect(() => {
		if (updatedFormAdd) {
			onEditLocalTrack(updatedFormAdd);
		}
	}, [updatedFormAdd, onEditLocalTrack]);

	// Handle Delete Input Element (Track Only) Effect
	useEffect(() => {
		if (updatedFormDel) {
			onEditLocalTrack(updatedFormDel);
		}
	}, [updatedFormDel, onEditLocalTrack]);
	
	//===============================================================================================================//

	// Handle Form POST Submission Effect
	useEffect(() => {
		if (stateSuccess !== null) {
			history.push({ pathname: "/releases/" });
		}
	}, [stateSuccess, history]);

	//===============================================================================================================//
	// Create & Handle Form Submission Object
	//===============================================================================================================//

	const releaseCreateHandler = event => {
		event.preventDefault();

		const releaseDataObject = objBuilderRelease.baseReleaseObject();
		const tracksDataArray = [];
		let fileFlag = false;

		// Create Release Object for API submission

		const releaseDataMap = new Map(Object.entries(props.stateReleaseForm));

		releaseDataMap.forEach(function(value, key) {
			switch (key) {
				case "releaseTitle":
					releaseDataObject.title = value.value;
				break;
				case "label": 
					value.forEach(function(element) {
						element.linkedRecord ?
						releaseDataObject.label_name.push({ _id: element.fuzzyRef }) :
						releaseDataObject.label_name.push({ name: element.value });
					});
				break;
				case "catalogue":
					releaseDataObject.catalogue = value.value;
				break;
				case "releaseYear":
					releaseDataObject.year = value.value;
				break;
				case "formats":
					value.forEach(function(element) {
						releaseDataObject.format.push({
							name: element.label,
							release: element.value
						});
					});
				break;
				case "discogsLink":
					releaseDataObject.discogs_url = value.value;
				break;
				case "discogsId":
					releaseDataObject.discogs_id = value.value;
				break;
				default : 
					releaseDataObject[key] = value.value;		
			}
		});

		// Create Track Object for API submission

		const tracksDataMap = new Map(Object.entries(props.stateTrackForm));

		tracksDataMap.forEach(function(value, key) {
			let track = objBuilderRelease.baseTrackObject();
			for (let key in value) {
				switch (key) {
					case "artists": 
						value[key].forEach(function(element) {
							element.linkedRecord ?
							track.artist_name.push({ _id: element.fuzzyRef }) :
							track.artist_name.push({ name: element.value });
						});
					break;
					case "trackTitle":
						track.name = value[key].value;
					break;
					case "trackNumber":
						track.track_number = value[key].value;
					break;
					case "genre":
						track.genre = value[key].value;
					break;
					case "mixKey":
						track.mixkey = value[key].value;
					break;
					default : 
						track[key] = value[key].value;
				}
			}
			if (releaseDataObject.label_name[0]._id) {
				track.release_label.push({ _id: releaseDataObject.label_name[0]._id });
			}
			tracksDataArray.push(track);
		})

		// Prepare API submission (Plain Object / Form Data)

		const releaseData = {
			release: releaseDataObject,
			tracks: tracksDataArray
		};

		let newReleaseData = releaseData;

		if (getAvatarFile) { 
			newReleaseData = new FormData();
			newReleaseData.append("image", getAvatarFile);
			newReleaseData.append("release", JSON.stringify(releaseData));
			fileFlag = true;
		}

		props.onAddRelease(newReleaseData, fileFlag);
	};

	//===============================================================================================================//
	// Prepare HTML Form Using Processed ReleaseForm Object Array From Redux Store
	//===============================================================================================================//

	const releaseFormRender = (arrayElement, arrayIndex) => {
		switch (arrayElement.id) {
			case "releaseForm":
				break;
			case "imageUpload": 
				return <FileInput
					key={arrayIndex}
					elementAttributes={arrayElement.attributes}
					elementImage={getAvatar}
					elementImageName={getAvatarName}
					hasUpload={getAvatarFile ? true : false}
					imageUpload={getAvatar}
					imageNameUpload={getAvatarName}
					title={""}
					changed={event => imageUploadPreviewHandler(event)}
				/>
			case "label":
				return <Auxiliary key={arrayIndex}>
				{arrayElement.attributes.map((labelElement, labelIndex) =>
					<FuzzyInput
						key={labelIndex}
						elementIndex={labelIndex}
						elementAttributes={labelElement}
						elementValid={!labelElement.valid}
						clicked={event =>
							dropdownItemSelectHandler(
								event,
								props.stateReleaseForm[arrayElement.id][labelIndex],
								`${arrayElement.id}[${labelIndex}]`,
								props.stateReleaseForm
							)
						}
						changed={event =>
							fuzzyInputChangeHandler(
								event,
								props.stateReleaseForm[arrayElement.id][labelIndex],
								`${arrayElement.id}[${labelIndex}]`,
								props.stateReleaseForm,
								`${labelElement.labelFor}List`,
								props.stateLabels
							)
						}
						keyup={event =>
							dropdownItemSelectHandler(
								event,
								props.stateReleaseForm[arrayElement.id][labelIndex],
								`${arrayElement.id}[${labelIndex}]`,
								props.stateReleaseForm,
								`${labelElement.labelFor}List`
							)
						}
					/>
					)}
				</Auxiliary>
			case "formats":
				return <fieldset key={arrayIndex}>
					<legend>Release Formats</legend>
					{arrayElement.attributes.map((formatElement, formatIndex) =>
						<Input
							key={formatIndex}
							elementAttributes={formatElement}
							elementValid={!formatElement.valid}
							changed={event =>
								inputChangeHandler(
									event,
									props.stateReleaseForm[arrayElement.id][formatIndex],
									`${arrayElement.id}[${formatIndex}]`,
									props.stateReleaseForm
								)
							}
						/>	
					)}
				</fieldset>
			default:
				return <Input
					key={arrayIndex}
					elementAttributes={arrayElement.attributes}
					elementValid={!arrayElement.attributes.valid}
					changed={event =>
						inputChangeHandler(
							event,
							props.stateReleaseForm[arrayElement.id],
							`${arrayElement.id}`,
							props.stateReleaseForm
						)
					}
				/>
		}
	}

	//===============================================================================================================//
	// Prepare HTML Form Using Processed TrackForm Object Array From Redux Store
	//===============================================================================================================//

	const trackFormRender = (arrayElement, arrayIndex, trackIndex) => {
		switch (arrayElement.id) {
			case "trackForm":
				break;
			case "trackId":
				break;
			case "artists":
				return <fieldset key={arrayIndex}>
				<legend>Artists</legend>
					{arrayElement.attributes.map((artistElement, artistIndex) =>
						<FuzzyInputDelete
							key={artistIndex}
							elementIndex={artistIndex}
							elementAttributes={artistElement}
							elementValid={!artistElement.valid}
							clicked={event =>
								dropdownItemSelectHandler(
									event,
									props.stateTrackForm[trackIndex][arrayElement.id][artistIndex],
									`[${trackIndex}]${arrayElement.id}[${artistIndex}]`,
									props.stateTrackForm
								)
							}
							changed={event =>
								fuzzyInputChangeHandler(
									event,
									props.stateTrackForm[trackIndex][arrayElement.id][artistIndex],
									`[${trackIndex}]${arrayElement.id}[${artistIndex}]`,
									props.stateTrackForm,
									`${artistElement.labelFor}List`,
									props.stateArtists
								)
							}
							keyup={event =>
								dropdownItemSelectHandler(
									event,
									props.stateTrackForm[trackIndex][arrayElement.id][artistIndex],
									`[${trackIndex}]${arrayElement.id}[${artistIndex}]`,
									props.stateTrackForm,
									`${artistElement.labelFor}List`
								)
							}
							delete={event =>
								inputDeleteHandler(
									event,
									props.stateTrackForm[trackIndex][arrayElement.id],
									`[${trackIndex}][${arrayElement.id}]`,
									props.stateTrackForm,
									artistIndex
								)
							}
						/>
					)}
					<Button 
						type={"primary"}
						clicked={event =>
							this.inputAddHandler(
								event,
								props.stateTrackForm[trackIndex][arrayElement.id],
								`[${trackIndex}][${[arrayElement.id]}]`,
								props.stateTrackForm,
								`artists`
							)
						}
					>
						Add Artist
					</Button>
				</fieldset>
			default:
				return <Input
					key={arrayIndex}
					elementAttributes={arrayElement.attributes}
					elementValid={!arrayElement.attributes.valid}
					changed={event =>
						inputChangeHandler(
							event,
							props.stateTrackForm[trackIndex][arrayElement.id],
							`[${trackIndex}]${arrayElement.id}`,
							props.stateTrackForm
						)
					}
				/>
		}
	}

	//===============================================================================================================//

	const imageUploadPreviewHandler = event => {
		setAvatar(URL.createObjectURL(event.target.files[0]));
		setAvatarName(event.target.files[0].name);
		setAvatarFile(event.target.files[0]);
	};

	//===============================================================================================================//
	// Release Action Helpers
	//===============================================================================================================//

	const releaseRedirectHandler = event => {
		event.preventDefault();
		props.onResetStatus();
		props.history.push({ pathname: "/" });
	};

	const releaseMessageHandler = event => {
		event.preventDefault();
		props.onResetStatus();
	};

	//===============================================================================================================//
	// Render Add Release Form
	//===============================================================================================================//

	let releaseFormElements = [];
	let trackFormElements = [];

	if (!props.stateLoading && props.stateReleaseForm && props.stateTrackForm) {
		for (let key in props.stateReleaseForm) {
			releaseFormElements.push({
				id: key,
				attributes: props.stateReleaseForm[key]
			});
		}
		props.stateTrackForm.forEach((track) => {
			let trackElement = [];
			for (let key in track) {
				trackElement.push({
					id: key,
					value: track[key].value,
					attributes: track[key]
				});
			}
			trackFormElements.push(trackElement);
		});
	}

	//===============================================================================================================//

	let releaseForm = <Loader />;
	if (!props.stateLoading && props.stateReleaseForm && props.stateTrackForm) {
		releaseForm = (
			<div className="container">
				<h1>Add New Release</h1>
				{ props.stateError ? (
					<Auxiliary>
						<StatusPrompt
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
					<form onSubmit={releaseCreateHandler}>
						<div className="input-wrapper">

							{releaseFormElements.map((element, index) =>
								releaseFormRender(element, index)
							)}
							<fieldset data-accordion-group="true">
								<legend>Tracks ({trackFormElements.length})</legend>
									{trackFormElements.map((trackElement, trackIndex) =>
										<details key={trackIndex}>
											<summary
												aria-expanded="false"
												data-accordion-control="true"
												aria-controls={`accordionContainer${trackIndex}`}
												id={`accordionControl${trackIndex}`}
											>
												Add Track {trackIndex + 1}: {trackElement[3].value}
											</summary>
											<div
												id={`accordionContainer${trackIndex}`}
												role="region"
												aria-labelledby={`accordionControl${trackIndex}`}
												data-accordion-content="true"
											>
												{trackElement.map((element, index) =>
													trackFormRender(element, index, trackIndex)
												)}
												<Button
													type={"warning"}
													clicked={event => 
														inputDeleteHandler(
															event,
															props.stateTrackForm,
															"root",
															props.stateTrackForm,
															trackIndex
														)
													}
												>
													Delete Track
												</Button>									
											</div>
										</details>
									)}
								<Button 
									type={"primary"}
									clicked={event => 
										inputAddHandler(
											event,
											props.stateTrackForm,
											"root",
											props.stateTrackForm,
											"tracks"
										)
									}
								>
									Add New Track
								</Button>
							</fieldset>
						</div>
						<div className={"userform--actions"}>
							<Button
								type={getFormIsValid ? "primary" : "disabled"}
								disabled={!getFormIsValid}
							>
								Save Release
							</Button>
							<Button
								type={"warning"}
								clicked={releaseRedirectHandler}>
								Cancel
							</Button>
						</div>
					</form>
				</div>
			</div>
		);
	}
	return releaseForm;
}

//===============================================================================================================//
// Redux STATE Management
//===============================================================================================================//

const mapStateToProps = state => {
	return {
		stateReleaseForm: state.release.releaseForm,
		stateTrackForm: state.track.trackForm,
		stateArtists: state.artist.artists,
		stateLabels: state.label.labels,
		stateLoading: state.release.loading,
		stateError: state.release.error,
		stateSuccess: state.release.success,
		stateResponse: state.release.response,
		stateFeedback: state.release.feedback
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onCreateReleaseForm: () => 
			dispatch(releaseActions.addReleaseClientPrep()),
		onCreateTrackForm: () => 
			dispatch(releaseActions.addTrackClientPrep()),
		onFetchArtists: () => 
			dispatch(releaseActions.fetchArtistsSend()),
		onFetchLabels: () => 
			dispatch(releaseActions.fetchLabelsSend()),
		onEditLocalRelease: updatedReleaseForm =>
			dispatch(releaseActions.editReleaseClientInput(updatedReleaseForm)),
		onEditLocalTrack: updatedTrackForm =>
			dispatch(releaseActions.editTrackClientInput(updatedTrackForm)),
		onAddRelease: (newReleaseData, fileFlag) =>
			dispatch(releaseActions.addReleaseSend(newReleaseData, fileFlag)),
		onResetStatus: () => 
			dispatch(releaseActions.releaseResetStatus())
	};
};

//===============================================================================================================//

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ReleaseAdd);
