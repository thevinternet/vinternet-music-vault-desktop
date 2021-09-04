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
		picture: release.picture ? release.picture : ""
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
	let regexReleaseTitle = /(?<=\[)(.*?)(?=\])/; // Match & return string value between '[' and ']' characters

	//===============================================================================================================//

	// Loop tracks & push each catalogue data prop to new array
	tracksArray.forEach(track => {
		releaseArray.push(track.catalogue);
	});

	// Filter new array leaving only unique catalogue data strings
	const uniqueReleases = releaseArray.filter((object, index) => 
		index === releaseArray.findIndex(obj => 
			JSON.stringify(obj) === JSON.stringify(object)
		)
	);

	// Loop filtered array and crate Release objects
	uniqueReleases.forEach(release => {
		let newRelease = {};
		let trackPictures = [];
		newRelease.release = {};
		newRelease.tracks = [];

		// Loop tracks & push each track matching current catalogue prop to tracks array within Release object
		tracksArray.forEach(track => {
			if (track.catalogue === release) {
				newRelease.tracks.push(track);

				// If track has picture prop push it to isolated array
				if (track.release_picture.length) {
					trackPictures.push(track.release_picture[0]);
				}
			}
		});

		// Add Release object props using associated track data props
		newRelease.release.title = regexReleaseTitle.exec(newRelease.tracks[0].catalogue)[0];
		newRelease.release.label_name = newRelease.tracks[0].release_label;
		newRelease.release.catalogue = newRelease.tracks[0].catalogue;
		newRelease.release.year = newRelease.tracks[0].year;
		newRelease.release.format = [];
		newRelease.release.discogs_url = "";
		newRelease.release.discogs_id = "";

		// Use isolated track array to populate Release picture prop (or assign default avatar) 
		newRelease.release.picture = [{
			filename: trackPictures[0] ? trackPictures[0].filename : "avatar.jpg",
			format: trackPictures[0] ? trackPictures[0].format : "image/jpeg",
			location: trackPictures[0] ? trackPictures[0].location : "releases"
		}]

		newReleases.push(newRelease);
	})

	return newReleases;
}

//===============================================================================================================//

module.exports = ReleaseUtilities;
