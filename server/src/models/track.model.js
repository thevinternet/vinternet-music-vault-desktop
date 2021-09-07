const TrackModel = require("../schemas/track.schema");

//===============================================================================================================//
// Return Track Documents (All or By First Letter Filter) with Sorting, Limiting & Cursor Pagination 
//===============================================================================================================//

TrackModel.getAllTracks = async (query) => {
	try {
		let queryLetter;
		let searchFilter;
		let sortFilter;

		//===============================================================================================================//
		
		// Setup query string & search filter

		if (query.letter && query.letter !== "all") {
			queryLetter = `^${query.letter}`;
			searchFilter = { name: new RegExp(queryLetter, "i") };
		} else {
			queryLetter = "all";
			searchFilter = {};
		}

		// Setup result sorting parameters

		query.sort
		? sortFilter = { [query.sort]: 1, _id: 1 }
		: sortFilter = { name: 1, _id: 1 }

		//===============================================================================================================//

		// Execute bare query to check results exist
		
		const tracksResult = await TrackModel.find(searchFilter)
		.lean()
		.sort(sortFilter)
		.exec();

		//===============================================================================================================//

		// If no results exist send error response

		if (!tracksResult.length) {
			
			let errorFeedback;
			
			queryLetter !== "all"
			? errorFeedback = `No track results found starting with the letter '${query.letter}'`
			: errorFeedback = 'No track results found'

			return {
				success : {
					status: "Request Successful",
					response: "HTTP Status Code 200 (OK)",
					feedback: errorFeedback,
					tracks: [],
					queryResults: {
						count: 0,
						sliceMin: 0,
						sliceMax: 0,
						next: "",
						hasNext: false,
						prev: "",
						hasPrev: false
					}
				}
			}
		}
		
		// if results exisit construct & execute full query

		else {

			// Setup any required result pagination

			let pageRequest;

			if (query.reqNext && query.next) {
				pageRequest = { $gt: query.next } 
			}
			else if (query.reqPrev && query.prev) {
				pageRequest = { $lt: query.prev } 
			}
			else {
				pageRequest = { $exists: true };
			}

			// Setup query string & search filter

			if (queryLetter !== "all") {
				searchFilter = { 
					$and: [
						{ name: new RegExp(queryLetter, "i") },
						{ name: pageRequest }
					]
				}
			} else {
				searchFilter = { name: pageRequest };
			}

			//===============================================================================================================//
	
			// Execute main query and return response object

			const tracksQuery = await TrackModel.find(searchFilter)
			.populate("release_title", "title")
			.populate("artist_name", "name")
			.populate("release_label", "name")
			.populate("release_picture", "picture")
			.lean()
			.sort(sortFilter)
			.limit(query.limit)
			.exec();

			return { 
				success : {
					status: "Request Successful",
					response: "HTTP Status Code 200 (OK)",
					feedback: null,
					tracks: tracksQuery,
					queryResults: {
						count: tracksResult.length,
						sliceMin: tracksResult.findIndex(track => track._id.equals(tracksQuery[0]._id)) + 1,
						sliceMax: tracksResult.findIndex(track => track._id.equals(tracksQuery[tracksQuery.length - 1]._id)) + 1,
						next: tracksQuery[tracksQuery.length - 1].name,
						hasNext: tracksQuery.length < query.limit ? false : true,
						prev: tracksQuery[0].name,
						hasPrev: tracksResult[0]._id.equals(tracksQuery[0]._id) ? false : true,
					}
				}
			}
		}

	} catch (err) {
		return {
			error : {
				status: `Database Error (Mongoose): ${err.name}`,
				response: "HTTP Status Code 200 (OK)",
				errors: [
					{
						msg: err.message
					}
				]
			}
		}
	}
}

//===============================================================================================================//
// Return Track Document by ID
//===============================================================================================================//

TrackModel.getTrackById = async (id) => {
	try {
		const track = await TrackModel.findById(id);

		if (track === null) {
			return {
				error : {
					status: "Request Successful",
					response: "HTTP Status Code 200 (OK)",
					errors: [
						{
							value: id,
							msg: "The track Id provided was not found",
							param: "id",
							location: "params"
						}
					]
				}
			}
		} else {
			return TrackModel.findById(id)
				.populate("release_title", "title")
				.populate("artist_name", "name")
				.populate("release_label", "name")
				.populate("release_picture", "picture")
				.lean()
				.exec();
		}

	} catch (err) {
		return {
			error : {
				status: `Database Error (Mongoose): ${err.name}`,
				response: "HTTP Status Code 200 (OK)",
				errors: [
					{
						msg: err.message
					}
				]
			}
		}
	}
}

//===============================================================================================================//
// Return Track Documents By Artist ID
//===============================================================================================================//

TrackModel.getTracksByArtist = async (id) => {
	try {
		const tracks = await TrackModel.find({ artist_name : id });

		if (!tracks.length) {
			return {
				error : {
					status: "Request Successful",
					response: "HTTP Status Code 200 (OK)",
					errors: [
						{
							value: id,
							msg: "No tracks for the artist Id provided were found",
							param: "id",
							location: "params"
						}
					]
				}
			}
		} else {
			return TrackModel.find({ artist_name : id })
				.populate("release_title", "title")
				.populate("artist_name", "name")
				.populate("release_label", "name")
				.populate("release_picture", "picture")
				.lean()
				.sort({ catalogue: 1, track_number: 1 })
				.exec();
		}

	} catch (err) {
		return {
			error : {
				status: `Database Error (Mongoose): ${err.name}`,
				response: "HTTP Status Code 200 (OK)",
				errors: [
					{
						msg: err.message
					}
				]
			}
		}
	}
}

//===============================================================================================================//
// Return Track Documents By Label ID
//===============================================================================================================//

TrackModel.getTracksByLabel = async (id) => {
	try {
		const tracks = await TrackModel.find({ release_label : id });

		if (!tracks.length) {
			return {
				error : {
					status: "Request Successful",
					response: "HTTP Status Code 200 (OK)",
					errors: [
						{
							value: id,
							msg: "No tracks for the label Id provided were found",
							param: "id",
							location: "params"
						}
					]
				}
			}
		} else {
			return TrackModel.find({ release_label : id })
				.populate("release_title", "title")
				.populate("artist_name", "name")
				.populate("release_label", "name")
				.populate("release_picture", "picture")
				.lean()
				.sort({ catalogue: 1, track_number: 1 })
				.exec();
		}

	} catch (err) {
		return {
			error : {
				status: `Database Error (Mongoose): ${err.name}`,
				response: "HTTP Status Code 200 (OK)",
				errors: [
					{
						msg: err.message
					}
				]
			}
		}
	}
}

//===============================================================================================================//
// Return Track Documents By Release ID
//===============================================================================================================//

TrackModel.getTracksByRelease = async (id) => {
	try {
		const tracks = await TrackModel.find({ release_title: id });

		if (!tracks.length) {
			return {
				error : {
					status: "Request Successful",
					response: "HTTP Status Code 200 (OK)",
					errors: [
						{
							value: id,
							msg: "No tracks for the release Id provided were found",
							param: "id",
							location: "params"
						}
					]
				}
			}
		} else {
			return TrackModel.find({ release_title: id })
				.populate("release_title", "title")
				.populate("artist_name", "name")
				.populate("release_label", "name")
				.populate("release_picture", "picture")
				.lean()
				.sort({ catalogue: 1, track_number: 1 })
				.exec();
		}

	} catch (err) {
		return {
			error : {
				status: `Database Error (Mongoose): ${err.name}`,
				response: "HTTP Status Code 200 (OK)",
				errors: [
					{
						msg: err.message
					}
				]
			}
		}
	}
}

//===============================================================================================================//
// Create New Track Document
//===============================================================================================================//

TrackModel.createNewTrack = async (props) => {
	try {
		const track = await TrackModel.create({
			name: props.name,
			artist_name: props.artist_name,
			release_title: props.release_title,
			release_label: props.release_label,
			release_picture: props.release_picture,
			release_id: props.release_id,
			catalogue: props.catalogue,
			track_number: props.track_number,
			genre: props.genre,
			mixkey: props.mixkey,
			bpm: props.bpm
		});

		return track;

	} catch (err) {
		return {
			error : {
				status: `Database Error (Mongoose): ${err.name}`,
				response: "HTTP Status Code 200 (OK)",
				errors: [
					{
						msg: err.message
					}
				]
			}
		}
	}
}

//===============================================================================================================//
// Update Existing Track Document
//===============================================================================================================//

TrackModel.updateExistingTrackById = async (id, props) => {
	
	// Create 'Set' Object with updated Track Props
	const trackUpdateProps = {
		$set: {
			name: props.name,
			artist_name: props.artist_name,
			release_title: props.release_title,
			release_label: props.release_label,
			release_picture: props.release_picture,
			release_id: props.release_id,
			catalogue: props.catalogue,
			track_number: props.track_number,
			genre: props.genre,
			mixkey: props.mixkey,
			bpm: props.bpm,
			file_location: props.file_location
		}
	}

	// Submit release update object to model and handle response
	try {
		const track = await TrackModel.updateOne(
			{ _id: id },
			trackUpdateProps,
			{ new: true }
		);
		await track.save();
		return track;

	} catch (err) {
		return {
			error : {
				status: `Database Error (Mongoose): ${err.name}`,
				response: "HTTP Status Code 200 (OK)",
				errors: [
					{
						msg: err.message
					}
				]
			}
		}
	}
}

//===============================================================================================================//
// // Remove Track By ID
//===============================================================================================================//

TrackModel.removeTrackById = async (id) => {
	try {
		const track = await TrackModel.findById(id);

		if (track === null) {
			return {
				error : {
					status: "Request Successful",
					response: "HTTP Status Code 200 (OK)",
					errors: [
						{
							value: id,
							msg: "The track id provided was not found",
							param: "id",
							location: "params"
						}
					]
				}
			}
		} else {
			return TrackModel.deleteOne({ _id: id }).exec();
		}

	} catch (err) {
		return {
			error : {
				status: `Database Error (Mongoose): ${err.name}`,
				response: "HTTP Status Code 200 (OK)",
				errors: [
					{
						msg: err.message
					}
				]
			}
		}
	}
}

//===============================================================================================================//

module.exports = TrackModel;
