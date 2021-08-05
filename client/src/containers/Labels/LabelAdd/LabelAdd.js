import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import "./LabelAdd.scss";

import Auxiliary from "../../../wrappers/Auxiliary/Auxiliary";

import Input from "../../../components/Utilities/Form/Input/Input";
import FileInput from "../../../components/Utilities/Form/File/File";
import FuzzyInput from "../../../components/Utilities/Form/FuzzyInput/FuzzyInput";
import FuzzyInputDelete from "../../../components/Utilities/Form/FuzzyInput/FuzzyInputDelete";

import Button from "../../../components/Utilities/UI/Button/Button";
import Loader from "../../../components/Utilities/UI/Loader/Loader";
import StatusMessage from "../../../components/Utilities/UI/StatusMessage/StatusMessage";

import * as objBuilderLabel from "../../../utilities/objectHelpers/objectBuilderLabel"
import { dropdownDatalistSetup } from "../../../utilities/formHelpers/formFuzzyDropdown";

import useHandleInputChange from "../../../hooks/form/HandleInputChange";
import useHandleFuzzyInputChange from "../../../hooks/form/HandleFuzzyInputChange";
import useHandleInputAddition from "../../../hooks/form/HandleInputAddition";
import useHandleInputDeletion from "../../../hooks/form/HandleInputDeletion";
import useHandleDropdownItemSelect from "../../../hooks/form/HandleDropdownItemSelect";

import * as labelActions from "../../../store/actions/index";

//===============================================================================================================//

const LabelAdd = props => {

	//===============================================================================================================//
	// Set Up Component STATE & Initialise HOOKS
	//===============================================================================================================//

	const [getAvatar, setAvatar] = useState("site/avatar-label.jpg");
	const [getAvatarName, setAvatarName] = useState("No file(s) selected");
	const [getAvatarFile, setAvatarFile] = useState("");
	const [getFormIsValid, setFormIsValid] = useState(false);

	const { onCreateLabelForm, onFetchLabels, onEditLocalLabel, stateSuccess, history } = props;
	const { updatedFormStd, formIsValidStd, inputChangeHandler } = useHandleInputChange();
	const { updatedFormFzy, formIsValidFzy, dataListIdFzy, fuzzyInputChangeHandler } = useHandleFuzzyInputChange();
	const { updatedFormAdd, inputAddHandler } = useHandleInputAddition();
	const { updatedFormDel, inputDeleteHandler } = useHandleInputDeletion();
	const { updatedFormDds, dropdownItemSelectHandler } = useHandleDropdownItemSelect();
	
	//===============================================================================================================//
	// Setup useEffect Functions
	//===============================================================================================================//

	// Get Labels & Create Add New Label Form Effect
	useEffect(() => {
		onCreateLabelForm();
		onFetchLabels();
	}, [onCreateLabelForm, onFetchLabels]);

	//===============================================================================================================//

	// Handle Standard Input Change Effect
	useEffect(() => {
		if (updatedFormStd) {
			setFormIsValid(formIsValidStd);
			onEditLocalLabel(updatedFormStd);
		}
	}, [formIsValidStd, updatedFormStd, onEditLocalLabel]);

	// Handle Fuzzy Input Change Effect
	useEffect(() => {
		if (updatedFormFzy && dataListIdFzy) {
			dropdownDatalistSetup(dataListIdFzy);
			setFormIsValid(formIsValidFzy);
			onEditLocalLabel(updatedFormFzy);
		}
	}, [dataListIdFzy, formIsValidFzy, updatedFormFzy, onEditLocalLabel]);

	// Handle Fuzzy DropDown Selection Effect
	useEffect(() => {
		if (updatedFormDds) {
			onEditLocalLabel(updatedFormDds); 
		}
	}, [updatedFormDds, onEditLocalLabel]);

	//===============================================================================================================//

	// Handle Add New Input Element Effect
	useEffect(() => {
		if (updatedFormAdd) {
			onEditLocalLabel(updatedFormAdd); 
		}
	}, [updatedFormAdd, onEditLocalLabel]);

	// Handle Delete Input Element Effect
	useEffect(() => {
		if (updatedFormDel) {
			onEditLocalLabel(updatedFormDel); 
		}
	}, [updatedFormDel, onEditLocalLabel]);
	
	//===============================================================================================================//

	// Handle Form POST Submission Effect
	useEffect(() => {
		if (stateSuccess !== null) {
			history.push({ pathname: "/labels/" });
		}
	}, [stateSuccess, history]);

	//===============================================================================================================//
	// Create & Handle Form Submission Object
	//===============================================================================================================//

	const labelCreateHandler = event => {
		event.preventDefault();
		
		const labelDataObject = objBuilderLabel.baseLabelObject();
		let fileFlag = false;

		// Create Label Object for API submission

		const labelDataMap = new Map(Object.entries(props.stateLabelForm));

		labelDataMap.forEach(function(value, key) {
			switch (key) {
				case "labelName":
					labelDataObject.name = value.value;
				break;
				case "parentLabel":
					value.forEach(function(element) {
						element.linkedRecord ?
						labelDataObject.parent_label.push({ _id: element.fuzzyRef }) :
						labelDataObject.parent_label.push({ name: element.value });
					});
				break;
				case "subsidiaryLabels": 
					value.forEach(function(element) {
						element.linkedRecord ?
						labelDataObject.subsidiary_label.push({ _id: element.fuzzyRef }) :
						labelDataObject.subsidiary_label.push({ name: element.value });
					});
				break;
				case "profile":
					labelDataObject.profile = value.value;
				break;
				case "websites":
					value.forEach(function(element) {
						labelDataObject.website.push({
							name: element.label,
							url: element.value
						});
					});
				break;
				case "discogsId":
					labelDataObject.discogs_id = value.value;
				break;
				default : 
					labelDataObject[key] = value.value;		
			}
		});

		// Prepare API submission (Plain Object / Form Data)
		
		const labelData = { label: labelDataObject };
		let newLabelData = labelData;

		if (getAvatarFile) { 
			newLabelData = new FormData();
			newLabelData.append("image", getAvatarFile);
			newLabelData.append("label", JSON.stringify(labelData));
			fileFlag = true;
		}

		props.onAddLabel(newLabelData, fileFlag);
	};

	//===============================================================================================================//
	// Prepare HTML Form Using Processed LabelForm Object Array From Redux Store
	//===============================================================================================================//

	const labelFormRender = (arrayElement, arrayIndex) => {
		switch (arrayElement.id) {
			case "labelForm":
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
			case "labelName":
				return <FuzzyInput
					key={arrayIndex}
					elementAttributes={arrayElement.attributes}
					elementValid={!arrayElement.attributes.valid}
					clicked={event =>
						dropdownItemSelectHandler(
							event,
							props.stateLabelForm[arrayElement.id],
							`${arrayElement.id}`,
							props.stateLabelForm
						)
					}
					changed={event =>
						fuzzyInputChangeHandler(
							event,
							props.stateLabelForm[arrayElement.id],
							`${arrayElement.id}`,
							props.stateLabelForm,
							`${arrayElement.attributes.labelFor}List`,
							props.stateLabels
						)
					}
					keyup={event =>
						dropdownItemSelectHandler(
							event,
							props.stateLabelForm[arrayElement.id],
							`${arrayElement.id}`,
							props.stateLabelForm,
							`${arrayElement.attributes.labelFor}List`
						)
					}
				/>
			case "parentLabel":
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
								props.stateLabelForm[arrayElement.id][labelIndex],
								`${arrayElement.id}[${labelIndex}]`,
								props.stateLabelForm
							)
						}
						changed={event =>
							fuzzyInputChangeHandler(
								event,
								props.stateLabelForm[arrayElement.id][labelIndex],
								`${arrayElement.id}[${labelIndex}]`,
								props.stateLabelForm,
								`${labelElement.labelFor}List`,
								props.stateLabels
							)
						}
						keyup={event =>
							dropdownItemSelectHandler(
								event,
								props.stateLabelForm[arrayElement.id][labelIndex],
								`${arrayElement.id}[${labelIndex}]`,
								props.stateLabelForm,
								`${labelElement.labelFor}List`
							)
						}
					/>
					)}
				</Auxiliary>
			case "subsidiaryLabels":
				return <fieldset key={arrayIndex}>
					<legend>Subsidiary Labels</legend>
					{arrayElement.attributes.map((labelElement, labelIndex) =>
						<FuzzyInputDelete
							key={labelIndex}
							elementIndex={labelIndex}
							elementAttributes={labelElement}
							elementValid={!labelElement.valid}
							clicked={event =>
								dropdownItemSelectHandler(
									event,
									props.stateLabelForm[arrayElement.id][labelIndex],
									`${arrayElement.id}[${labelIndex}]`,
									props.stateLabelForm
								)
							}
							changed={event =>
								fuzzyInputChangeHandler(
									event,
									props.stateLabelForm[arrayElement.id][labelIndex],
									`${arrayElement.id}[${labelIndex}]`,
									props.stateLabelForm,
									`${labelElement.labelFor}List`,
									props.stateLabels
								)
							}
							keyup={event =>
								dropdownItemSelectHandler(
									event,
									props.stateLabelForm[arrayElement.id][labelIndex],
									`${arrayElement.id}[${labelIndex}]`,
									props.stateLabelForm,
									`${labelElement.labelFor}List`
								)
							}
							delete={event => 
								inputDeleteHandler(
									event,
									props.stateLabelForm[arrayElement.id],
									`${arrayElement.id}`,
									props.stateLabelForm,
									labelIndex
								)
							}
						/>
					)}
					<Button 
						type={"primary"}
						clicked={event => 
							inputAddHandler(
								event,
								props.stateLabelForm[arrayElement.id],
								`${arrayElement.id}`,
								props.stateLabelForm,
								`subsidiaryLabels`
							)
						}
					>
						Add Subsidiary Label
					</Button>
				</fieldset>
			case "websites":
				return <fieldset key={arrayIndex}>
					<legend>Websites</legend>
					{arrayElement.attributes.map((websiteElement, websiteIndex) =>
						<Input
							key={websiteIndex}
							elementAttributes={websiteElement}
							elementValid={!websiteElement.valid}
							changed={event =>
								inputChangeHandler(
									event,
									props.stateLabelForm[arrayElement.id][websiteIndex],
									`${arrayElement.id}[${websiteIndex}]`,
									props.stateLabelForm
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
						props.stateLabelForm[arrayElement.id],
						`${arrayElement.id}`,
						props.stateLabelForm
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
	// Label Action Helpers
	//===============================================================================================================//

	const labelRedirectHandler = event => {
		event.preventDefault();
		props.onResetStatus();
		props.history.push({ pathname: "/" });
	};

	const labelMessageHandler = event => {
		event.preventDefault();
		props.onResetStatus();
	};

	//===============================================================================================================//
	// Render Add Label Form
	//===============================================================================================================//

	let formElements = [];

	if (!props.stateLoading && props.stateLabelForm) {
		for (let key in props.stateLabelForm) {
			formElements.push({
				id: key,
				attributes: props.stateLabelForm[key]
			});
		}
	}

	//===============================================================================================================//

	let labelForm = <Loader />;
	if (!props.stateLoading && props.stateLabelForm) {
		labelForm = (
			<div className="container">
				<h1>Add New Label</h1>
				{ props.stateError ? (
					<Auxiliary>
						<StatusMessage
							status={"warning"}
							headline={props.stateError}
							response={props.stateResponse}
							message={props.stateFeedback}
							action={labelMessageHandler}
							buttonText={`Close`}
						/>
					</Auxiliary>
				) : null }
				<div className="userform">
					<form onSubmit={labelCreateHandler}>
						<div className="input-wrapper">
							{formElements.map((element, index) =>
								labelFormRender(element, index)
							)}
						</div>
						<div className={"userform--actions"}>
							<Button
								type={getFormIsValid ? "primary" : "disabled"}
								disabled={!getFormIsValid}
							>
								Save
							</Button>
							<Button
								type={"warning"}
								clicked={labelRedirectHandler}>
								Cancel
							</Button>
						</div>
					</form>
				</div>
			</div>
		);
	}
	return labelForm;
}

//===============================================================================================================//
// Redux STATE Management
//===============================================================================================================//

const mapStateToProps = state => {
	return {
		stateLabelForm: state.label.labelForm,
		stateLabels: state.label.labels,
		stateLoading: state.label.loading,
		stateError: state.label.error,
		stateSuccess: state.label.success,
		stateResponse: state.label.response,
		stateFeedback: state.label.feedback
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onCreateLabelForm: () => dispatch(labelActions.addLabelClientPrep()),
		onFetchLabels: () => dispatch(labelActions.fetchLabelsSend()),
		onEditLocalLabel: updatedLabelForm =>
			dispatch(labelActions.editLabelClientInput(updatedLabelForm)),
		onAddLabel: (newLabelData, fileFlag) =>
			dispatch(labelActions.addLabelSend(newLabelData, fileFlag)),
		onResetStatus: () => dispatch(labelActions.labelResetStatus())
	};
};

//===============================================================================================================//

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LabelAdd);
