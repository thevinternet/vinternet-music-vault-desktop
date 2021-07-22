const ReleaseModel = require("../models/release.model");
const LabelModel = require("../models/label.model");
const DocumentUtilities = require("../utilities/document.utilities");
const TrackUtilities = require("../utilities/track.utilities");
const ReleaseUtilities = {}

//===============================================================================================================//
// Utility - Create Release Document (Managing Linked Data & Linked Tracks)
//===============================================================================================================//

ReleaseUtilities.createReleaseDocument = async (release, tracks) => {

	// Manage linked Label Name data properties
	const labelNames = await DocumentUtilities.manageLinkedData(release.label_name, LabelModel);

	// Create new Release Document
	const newRelease = await ReleaseModel.create({
		title: release.title,
		label_name: labelNames,
		catalogue: release.catalogue,
		year: release.year,
		format: release.format,
		discogs_url: release.discogs_url,
		discogs_id: release.discogs_id,
	});

	// Grab new Release ID
	const newReleaseId = newRelease._id;

	// Create new Track documents with linked data and return new linked Track & Artist IDs
	const linkedProps = await TrackUtilities.createTrackDocuments(tracks, newReleaseId);

	// Append Track IDs array to newRelease object
	newRelease.tracks = linkedProps.trackId;

	// Remove any duplicate Artist Ids
	const artistIds = [...linkedProps.artistId];

	const uniqueArtistIds = artistIds.filter((object, index) => 
		index === artistIds.findIndex(obj => 
			JSON.stringify(obj) === JSON.stringify(object)
		)
	);

	// Append unique Artist IDs array to newRelease object
	newRelease.artist_name = uniqueArtistIds;
  
	return newRelease;
}

//===============================================================================================================//
// Utility - Update Existing Release Document (Managing Linked Data & Linked Tracks)
//===============================================================================================================//

ReleaseUtilities.updateReleaseDocument = async (id, release, tracks) => {

	// Create updated Release object
	const updatedRelease = {
		title: release.title,
		catalogue: release.catalogue,
		year: release.year,
		format: release.format,
		discogs_url: release.discogs_url,
		discogs_id: release.discogs_id,
		picture: release.picture
	}

	// Manage linked Label Name data properties
	updatedRelease.label_name = await DocumentUtilities.manageLinkedData(release.label_name, LabelModel);

	// Create new Track documents with linked data and return new linked Track & Artist IDs
	const linkedProps = await TrackUtilities.createTrackDocuments(tracks, id);

	// Append Track IDs array to updatedRelease object
	updatedRelease.tracks = linkedProps.trackId;

	// Remove any existing Tracks not part of the updated Release
	if (updatedRelease.tracks.length) {
		await TrackUtilities.removeExistingTrackDocuments(updatedRelease.tracks, id);
	}

	// Remove any duplicate Artist Ids
	const artistIds = [...linkedProps.artistId];

	const uniqueArtistIds = artistIds.filter((object, index) => 
		index === artistIds.findIndex(obj => 
			JSON.stringify(obj) === JSON.stringify(object)
		)
	);

	// Append unique Artist IDs array to updatedRelease object
	updatedRelease.artist_name = uniqueArtistIds;

	return updatedRelease;
}

//===============================================================================================================//
// Utility - Create Raw Release Documents (From Imported Track Utility)
//===============================================================================================================//

ReleaseUtilities.createImportedReleases = async (tracks) => {

	const tracksArray = [...tracks];
	let releaseArray = [];
	let newReleases = [];
	let regex = /(?<=\[)(.*?)(?=\])/;

	tracksArray.forEach(track => {
		releaseArray.push(track.release_catalogue);
	});

	const uniqueReleases = releaseArray.filter((object, index) => 
		index === releaseArray.findIndex(obj => 
			JSON.stringify(obj) === JSON.stringify(object)
		)
	);

	//console.log(uniqueReleases);

	uniqueReleases.forEach(release => {
		const newRelease = {};
		newRelease.release = {};
		newRelease.tracks = [];

		tracksArray.forEach(track => {
			if (track.release_catalogue === release) {
				newRelease.tracks.push(track);
			}
		});

		newRelease.release.title = regex.exec(newRelease.tracks[0].release_catalogue)[0];
		newRelease.release.label_name = newRelease.tracks[0].release_label;
		newRelease.release.catalogue = newRelease.tracks[0].release_catalogue;
		newRelease.release.year = newRelease.tracks[0].year;
		newRelease.release.format = [];
		newRelease.release.discogs_url = "";
		newRelease.release.discogs_id = "";
		newRelease.release.picture = [{
			location: "avatar.jpg",
			filename: "avatar.jpg",
			format: "image/jpeg"
		}]

		newReleases.push(newRelease);
	})

	return newReleases;
}

//===============================================================================================================//

module.exports = ReleaseUtilities;
