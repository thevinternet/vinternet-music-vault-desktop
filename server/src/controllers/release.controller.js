const ReleaseModel = require("../models/release.model");
const { body, param, validationResult } = require('express-validator');
const ReleaseUtilities = require("../utilities/release.utilities");
const ReleaseController = {};

//===============================================================================================================//
// Controller - Validate Release Input Data (Express Validator Middleware)
//===============================================================================================================//

ReleaseController.validate = (method) => {
	switch (method) {	
		case "checkReleaseId": {
			return [
				param("id")
					.isMongoId()
					.withMessage("The value passed for Release Id is not valid")
			]
		}
		case "checkReleaseInput": {
			return [
				body("release._id")
					.optional().isMongoId()
					.withMessage("The value for the Release Id provided is not valid"),
				body("release.title")
					.notEmpty().escape().trim()
					.withMessage("Please provide the name of the release"),
				body("release.label_name")
					.isArray()
					.withMessage("Label array is malformed and not valid"),
				body("release.label_name.*._id")
					.isMongoId().optional()
					.withMessage("The value for the Label Id provided is not valid"),
				body("release.label_name.*.name")
					.optional().escape().trim(),
				body("release.catalogue")
					.optional().escape().trim(),
				body("release.year")
					.optional().escape().trim(),
				body("release.format")
					.isArray()
					.withMessage("Format array is malformed and not valid"),
				body("release.format.*._id")
					.isMongoId().optional()
					.withMessage("The value for the Format Id provided is not valid"),
				body("release.format.*.name")
					.notEmpty().escape().trim()
					.withMessage("Please provide the name/type of the media format"),
				body("release.format.*.released")
					.optional().escape().trim(),
				body("label.discogs_url")
					.optional().escape().trim(),
				body("label.discogs_id")
					.optional().escape().trim()
			]
		}
		case "checkTrackInput": {
			return [
				// Track ID
				body("tracks.*._id")
					.optional().isMongoId()
					.withMessage("The value for the Track Id provided is not valid"),
				// Track Name
				body("tracks.*.name")
					.notEmpty().escape().trim()
					.withMessage("Please provide the name of the track"),
				// Artist Name
				body("tracks.*.artist_name")
					.isArray()
					.withMessage("Artist Name array is malformed and not valid"),
				body("tracks.*.artist_name.*._id")
					.optional().isMongoId()
					.withMessage("The value for the Artist Id provided is not valid"),
				body("tracks.*.artist_name.*.name")
					.optional().escape().trim(),
				// Track Number
				body("tracks.*.track_number")
					.optional().escape().trim(),
				// Track Genre
				body("tracks.*.genre")
					.optional().escape().trim(),
				// Track Mixkey
				body("tracks.*.mixkey")
					.optional().escape().trim(),
				// Track BPM
				body("tracks.*.bpm")
					.optional().escape().trim(),
				// Release Label
				body("tracks.*.release_label")
					.isArray()
					.withMessage("Release Label Name array is malformed and not valid"),
				body("tracks.*.release_label.*._id")
					.optional().isMongoId()
					.withMessage("The value for the Label Id provided is not valid"),
				body("tracks.*.release_label.*.name")
					.optional().escape().trim(),
				// Release Title
				body("tracks.*.release_title")
					.isArray().optional({ nullable: true, checkFalsy: true })
					.withMessage("Release Title array is malformed and not valid"),
				body("tracks.*.release_title.*._id")
					.optional().isMongoId()
					.withMessage("The value for the Release Title Id provided is not valid"),
				// Track Catalogue
				body("tracks.*.catalogue")
					.optional().escape().trim(),
				// Release Id
				body("tracks.*.release_id")
					.isMongoId().optional({ nullable: true, checkFalsy: true })
					.withMessage("The value for the Release Reference Id provided is not valid")
			]
		}
	}
}

//===============================================================================================================//
// Controller - Retrieve All Releases
//===============================================================================================================//

ReleaseController.getAllReleases = async (req, res, next) => {
	try {
		const releases = await ReleaseModel.getAllReleases();

		if (res.error) {
			return res.json({
				error: {
					status: res.error.status,
					errors: res.error.errors
				}
			});
		} else {
			return res.json(releases);
		}
	} catch(err) {
		return next(err)
	}
}

//===============================================================================================================//
// Controller - Retrieve Single Release By Id
//===============================================================================================================//

ReleaseController.getReleaseById = async (req, res, next) => {
	try {
		// Check for validation errors in request and return error object
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.json({ 
				error: {
					status: "Request Failed",
					response: "HTTP Status Code 422 (Unprocessable Entities)",
					errors: errors.array()
				}
			});
		}

		// If no validation errors, run query request and return result
		const id = req.params.id;
		let release = await ReleaseModel.getReleaseById(id);

		if (res.error) {
			return res.json({
				error: {
					status: res.error.status,
					errors: res.error.errors
				}
			});
		} else {
			return res.json(release);
		}
	} catch(err) {
		return next(err)
	}
}

//===============================================================================================================//
// Controller - Retrieve All Releases By Label Id
//===============================================================================================================//

ReleaseController.getReleasesByLabel = async (req, res, next) => {
	try {
		// Check for validation errors in request and return error object
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.json({ 
				error: {
					status: "Request Failed",
					response: "HTTP Status Code 422 (Unprocessable Entities)",
					errors: errors.array()
				}
			});
		}

		// If no validation errors, run query request and return result
		const id = req.params.id;
		let releases = await ReleaseModel.getReleasesByLabel(id);

		if (res.error) {
			return res.json({
				error: {
					status: res.error.status,
					errors: res.error.errors
				}
			});
		} else {
			return res.json(releases);
		}
	} catch(err) {
		return next(err)
	}
}

//===============================================================================================================//
// Controller - Retrieve All Releases By Artist Id
//===============================================================================================================//

ReleaseController.getReleasesByArtist = async (req, res, next) => {
	try {
		// Check for validation errors in request and return error object
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.json({ 
				error: {
					status: "Request Failed",
					response: "HTTP Status Code 422 (Unprocessable Entities)",
					errors: errors.array()
				}
			});
		}

		// If no validation errors, run query request and return result
		const id = req.params.id;
		let releases = await ReleaseModel.getReleasesByArtist(id);

		if (res.error) {
			return res.json({
				error: {
					status: res.error.status,
					errors: res.error.errors
				}
			});
		} else {
			return res.json(releases);
		}
	} catch(err) {
		return next(err)
	}
}

//===============================================================================================================//
// Controller - Create New Releases Using Track Import From User File System
//===============================================================================================================//

ReleaseController.importNewReleases = async (req, res, next) => {

	try {
		let releaseImportProps;
		let releaseImportId;
		let releaseImport;
		let updatedCount = 0;
		let updatedReleases = "";
		let updatedReleasesList = "";
		let addedCount = 0;
		let addedReleases = "";
		let addedReleasesList = "";

		// If validation errors in request return error object
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.json({ 
				error: {
					status: "Request Failed",
					response: "HTTP Status Code 422 (Unprocessable Entities)",
					errors: errors.array()
				}
			});
		}

		// If all checks pass prepare release objects with linked properties from imported Tracks
		const filesToImport = await ReleaseUtilities.createImportedReleases(req.body.tracks);

		// Loop through each release object, adding or updating Release documents accordingly
		for (let index = 0; index < filesToImport.length; index++) {

			// Check to see if release catalogue identifier prop already exists in the database
			let releaseExists = await ReleaseModel.find({ catalogue : filesToImport[index].release.catalogue })

			//===============================================================================================================//

			// If release to import is unique create new Release Document
			if (!releaseExists.length) {

				releaseImportProps = await ReleaseUtilities.createReleaseDocument(filesToImport[index].release, filesToImport[index].tracks);
				
				// Grab Id from new newly created release object
				releaseImportId = releaseImportProps._id;
				
				// Submit release object to model and handle response
				releaseImport = await ReleaseModel.createNewRelease(releaseImportId, releaseImportProps);

				// Increase added release counter and add catalogue prop to list item variable
				addedCount++;
				addedReleases += `<li>${releaseImportProps.catalogue}<\/li>`;

			//===============================================================================================================//

			// If the release to import already exists update existing Release Document
			} else if (releaseExists.length === 1) {

				// Grab existing Release Id
				releaseImportId = releaseExists[0]._id;

				// Create updated Release Document with imported data
				releaseImportProps = await ReleaseUtilities.updateReleaseDocument(releaseImportId, filesToImport[index].release, filesToImport[index].tracks);

				// Submit updated release object to model and handle response
				releaseImport = await ReleaseModel.updateExistingImportedReleaseById(releaseImportId, releaseImportProps);

				// Increase update release counter and add catalogue prop to list item variable
				updatedCount++;
				updatedReleases += `<li>${releaseImportProps.catalogue}<\/li>`;

			//===============================================================================================================//

			} else {
				return res.json({
					error: {
						status: "Duplicate Release Error",
						errors: ["Duplicate Releases with the same Catalogue Id found!"]
					}
				});
			}
		}

		//===============================================================================================================//

		if (res.error) {
			return res.json({
				error: {
					status: res.error.status,
					errors: res.error.errors
				}
			});
		} else {

			addedCount !== 0
			? addedReleasesList = `Releases successfully added: <b>${addedCount}<\/b><ol>${addedReleases}<\/ol>`
			: addedReleasesList = `Releases added: <b>0<\/b>`;

			updatedCount !== 0
			? updatedReleasesList = `Releases successfully updated: <b>${updatedCount}<\/b><ol>${updatedReleases}<\/ol>`
			: updatedReleasesList = `Releases updated: <b>0<\/b>`;

			return res.json({
				success: {
					status: "Import Successful",
					response: "HTTP Status Code 200 (OK)",
					feedback: [
						{ msg: addedReleasesList },
						{ msg: updatedReleasesList }
					]
				}
			});
		}
	} catch(err) {
		return next(err)
	}
}

//===============================================================================================================//
// Controller - Create New Release With Text Properties & Image File
//===============================================================================================================//

ReleaseController.createNewRelease = async (req, res, next) => {
	try {
		// If validation errors in request return error object
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.json({ 
				error: {
					status: "Request Failed",
					response: "HTTP Status Code 422 (Unprocessable Entities)",
					errors: errors.array()
				}
			});
		}

		// If release title already exists return error object
		const releaseCheck = await ReleaseModel.find({ catalogue: req.body.release.catalogue }).exec();

		if (releaseCheck.length) {
			return res.json({
				error : {
					status: "Request Successful",
					response: "HTTP Status Code 200 (OK)",
					errors: [
						{
							value: req.body.release.title,
							msg: `This release provided is already in the database | see: ${req.body.release.catalogue}`,
							param: "releaseTitle",
							location: "body"
						}
					]
				}
			});
		}

		// If all checks pass prepare release object with linked properties
		const props = await ReleaseUtilities.createReleaseDocument(req.body.release, req.body.tracks);

		// Handle picture file props and append to release object
		if (req.file) {
			props.picture = [{
				location: "releases",
				filename: req.file.originalname,
				format: req.file.mimetype
			}]
		} else {
			props.picture = [{
				location: "site",
				filename: "avatar-release.jpg",
				format: "image/jpeg"
			}]
		}

		// Grab Id from new newly created release object
		const id = props._id;
		
		// Submit release object to model and handle response
		const release = await ReleaseModel.createNewRelease(id, props);

		if (res.error) {
			return res.json({
				error: {
					status: res.error.status,
					errors: res.error.errors
				}
			});
		} else {
			return res.json({
				success: {
					status: "Request Successful",
					response: "HTTP Status Code 200 (OK)",
					feedback: [
						{
							msg: `${props.catalogue} successfully added`,
							value: release
						}
					]
				}
			});
		}
	} catch(err) {
		return next(err)
	}
};

//===============================================================================================================//
// Controller - Update Release Text Properties & Image File By Id
//===============================================================================================================//

ReleaseController.updateExistingReleaseById = async (req, res, next) => {
	try {
		// If validation errors in request return error object
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.json({ 
				error: {
					status: "Request Failed",
					response: "HTTP Status Code 422 (Unprocessable Entities)",
					errors: errors.array()
				}
			});
		}

		// If release id does not exist return error object
		const id = req.params.id;
		const releaseCheck = await ReleaseModel.find({ _id: id }).exec();

		if (!releaseCheck.length) {
			return res.json({
				error : {
					status: "Request Successful",
					response: "HTTP Status Code 200 (OK)",
					errors: [
						{
							value: req.params.id,
							msg: "The release id provided was not found",
							param: "id",
							location: "body"
						}
					]
				}
			});
		}

		// If all checks pass prepare release object with linked properties
		const props = await ReleaseUtilities.updateReleaseDocument(id, req.body.release, req.body.tracks);

		// Handle optional picture file and append to release object
		if (req.file) {
			props.picture = [{
				location: "releases",
				filename: req.file.originalname,
				format: req.file.mimetype
			}]
		}

		// Submit release object to model and handle response
		const release = await ReleaseModel.updateExistingReleaseById(id, props);

		if (res.error) {
			return res.json({
				error: {
					status: res.error.status,
					errors: res.error.errors
				}
			});
		} else {
			return res.json({
				success: {
					status: "Request Successful",
					response: "HTTP Status Code 200 (OK)",
					feedback: [
						{
							msg: `${props.catalogue} successfully updated`,
							value: release
						}
					]
				}
			});
		}
	} catch(err) {
		return next(err)
	}
};

//===============================================================================================================//
// Controller - Remove Single Release By Id
//===============================================================================================================//

ReleaseController.removeReleaseById = async (req, res, next) => {
	try {
		// Check for validation errors in request and return error object
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.json({ 
				error: {
					status: "Request Failed",
					response: "HTTP Status Code 422 (Unprocessable Entities)",
					errors: errors.array()
				}
			});
		}

		// If no validation errors run query request and return result
		const id = req.params.id;
		const release = await ReleaseModel.removeReleaseById(id)

		if (res.error) {
			return res.json({
				error: {
					status: res.error.status,
					errors: res.error.errors
				}
			});
		} else {
			return res.json({
				success: {
					status: "Request Successful",
					response: "HTTP Status Code 200 (OK)",
					feedback: [
						{
							msg: `Release removed from database`,
							value: release
						}
					]
				}
			});
		}
	} catch(err) {
		return next(err)
	}
}

//===============================================================================================================//

module.exports = ReleaseController;
