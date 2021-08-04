const ArtistModel = require("../models/artist.model");
const LabelModel = require("../models/label.model");
const TrackModel = require("../models/track.model");
const DocumentUtilities = require("../utilities/document.utilities");
const TrackUtilities = {}

//===============================================================================================================//
// Utility - Create/Update Track Documents (Managing Linked Data & Release Links)
//===============================================================================================================//

TrackUtilities.createTrackDocuments = async (tracks, releaseId) => {

	const tracksArray = [...tracks];
	let releaseTrackProps = {
		trackId: [],
		artistId: [],
	};
	let updatedTrack;

	if (tracksArray.length) {
		for (let index = 0; index < tracksArray.length; index++) {

			// Loop through tracksArray, updating track object props with linked data
			tracksArray[index].artist_name = await DocumentUtilities.manageLinkedData(tracksArray[index].artist_name, ArtistModel);
			tracksArray[index].release_title = [{ _id: releaseId }];
			tracksArray[index].release_label = await DocumentUtilities.manageLinkedData(tracksArray[index].release_label, LabelModel);
			tracksArray[index].release_catalogue = [{ _id: releaseId }];
			tracksArray[index].release_picture = [{ _id: releaseId }];
			tracksArray[index].release_ref = releaseId;

			// Handle Track Document creation & updating respectively

			if (tracksArray[index]._id) {
				// If Track has existing ID, update existing Track Document & push existing ID to trackIds array
				updatedTrack = await TrackModel.updateExistingTrackById(tracksArray[index]._id, tracksArray[index]);
				releaseTrackProps.trackId.push({ _id: tracksArray[index]._id });
			}

			if (!tracksArray[index]._id) {
				// If Track has no existing ID, search exisitng Track Documents to find possible match against existing release
				let trackExists = await TrackModel.find({ name: tracksArray[index].name, catalogue: tracksArray[index].catalogue });

				if (!trackExists.length) {
					// If no existing track matches found against release create new Track Document and push new ID to props obj
					let newTrack = await TrackModel.createNewTrack(tracksArray[index]);
					releaseTrackProps.trackId.push({ _id: newTrack._id });
				}

				if (trackExists.length === 1) {
					// If Track matach found grab existing ID, update existing Track Document & push ID to trackIds array
					let trackId = trackExists[0]._id;
					updatedTrack = await TrackModel.updateExistingTrackById(trackId, tracksArray[index]);
					releaseTrackProps.trackId.push({ _id: trackId });
				} else {
					console.log("PROBLEM - DUPLICATE TRACKS ON RELEASE FOUND!!");
				}
			}

			// Loop through updated artist_name Ids & push to artistId array
			if (tracksArray[index].artist_name.length) {
				for (let artistIndex = 0; artistIndex < tracksArray[index].artist_name.length; artistIndex++) {
					releaseTrackProps.artistId.push(tracksArray[index].artist_name[artistIndex]);
				}
			}
		}
	}

	return releaseTrackProps;
}

//===============================================================================================================//
// Utility - Remove Track Documents (During Update Release Process)
//===============================================================================================================//

TrackUtilities.removeExistingTrackDocuments = async (updatedTracks, releaseId) => {

	let updatedTrackIds = [];
	let existingTrackIds = [];

	// If updatedTracks array has values, push Ids to new updatedTrackIds array
	if (updatedTracks.length) {
		updatedTracks.forEach(track => {
			updatedTrackIds.push(track._id.toString())
		})
	}

	// Check DB for existing Tracks associated with Release
	const existingTracks = await TrackModel.find({ release_title: releaseId });

	// If existingTracks array has values, push Ids to new existingTracksIds array
	if (existingTracks.length) {
		existingTracks.forEach(track => {
			existingTrackIds.push(track._id.toString())
		})
	}
	
	// Filter out existingTracks & updatedTracks to leave remaining Tracks for deletion
	const tracksToRemove = existingTrackIds.filter(item => !updatedTrackIds.includes(item));

	// Delete remaining Tracks from database
	if (tracksToRemove.length) {
		for (let index = 0; index < tracksToRemove.length; index++) {
			await TrackModel.deleteOne({ _id: tracksToRemove[index] }).exec();
		}
	}

	return;
}

//===============================================================================================================//

module.exports = TrackUtilities;
