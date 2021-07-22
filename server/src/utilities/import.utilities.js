const fs = require("fs");
const path = require("path");
const util = require('util');
const dotenv = require("dotenv");

const { createClient } = require("webdav");
const mm = require('music-metadata');

const ReleaseUtilities = require("../utilities/release.utilities");
const ImportUtilities = {}

//===============================================================================================================//
// Initiate Environment Variables
//===============================================================================================================//

dotenv.config();

const {
	MSC_USER,
	MSC_PWD
} = process.env;


//===============================================================================================================//
// Utility - Create Release Document (Managing Linked Data & Linked Tracks)
//===============================================================================================================//

ImportUtilities.importReleasesFromFileSystem = async (folderLocation) => {

	const folderPath = "-00- DJ Vault/-01- Hardcore & Jungle/[Anthill Records] (ANT XX)";
	let results;
	let trackLocation;
	let trackNames = [];
	let tracks = [];

	//===============================================================================================================//

	const client = createClient(
    "http://vinternet-msc:5005/music",
    {
			username: MSC_USER,
			password: MSC_PWD
		}
	);

	//===============================================================================================================//

	if (await client.exists(folderPath) !== false) {

		const directoryItems = await client.getDirectoryContents(folderPath);

		directoryItems.forEach(item => {
			if (item.type === "directory" && item.basename !== "[Artwork]") {
				trackLocation = item.filename;
			}
			if (item.type === "file" && item.mime === "audio/mpeg") {
				trackNames.push(item.basename);
			}
		});

	} else {
		results = {
			error: {
				status: res.error.status,
				errors: res.error.errors
			}
		}
	}

	//===============================================================================================================//

  for (let index = 0; index < trackNames.length; index++) {

		const trackFileName = `${trackLocation}/${trackNames[index]}`;
		const fileStream = client.createReadStream(trackFileName);

		fileStream.on('error', function(err) {
			results += err.stack;
		});

		//===============================================================================================================//

		async function getMetaData(fileStream) {
			try {
				const metaData = await mm.parseStream(fileStream, {mimeType: "audio/mpeg", size: 26838});
				return metaData.common;
			} catch (error) {
				results = {
					error: {
						status: res.error.status,
						errors: res.error.errors
					}
				}
			}
		};

		const trackResults = await getMetaData(fileStream);

		//===============================================================================================================//

		const trackItem = {
			name: trackResults.title,
			artist_name: [],
			release_title: [],
			release_label: [{ name : trackResults.album.split("\(")[0].trim() }],
			release_catalogue: trackResults.album,
			release_ref: "",
			track_number: trackResults.track.no,
			genre: trackResults.genre[0],
			mixkey: trackResults.key,
			bpm: trackResults.bpm,
			year: trackResults.year,
			file_location: trackFileName
		}
	
		if (trackResults.artists.length) {
			trackResults.artists.forEach(artist => {
				trackItem.artist_name.push({ name: artist });
			})
		}
	
		tracks.push(trackItem);
	}

	if (tracks.length === trackNames.length) {
		results = ReleaseUtilities.createImportedReleases(tracks);
	}
	
	return results;
}

//===============================================================================================================//

module.exports = ImportUtilities;
