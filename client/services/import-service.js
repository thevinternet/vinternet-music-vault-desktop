const path = require("path");
const fs = require("fs");

const dirTree = require("directory-tree");
const musicMeta = require("music-metadata");

//===============================================================================================================//
// Utility - Create Array Of Track Objects From Given Folder
//===============================================================================================================//

async function importTracks(folderLocation) {

	const tracks = [];
	const regexArtist = /(?:&|&amp;|Feat\.)+/; // Return string values before any match criteria string
	const regexLabel = /^[^[(]+/; // Match & return string value preceeding either '[' or '('
	const regexExtensions = /\.(mp3|wav|flac|)$/; // Match & return string value ending with these extensions
	const regexImageExtension = /(?<=\/).*/ // Match & retrun string values after match criteria string
	
	//===============================================================================================================//

	// Use 'directory-tree' to create array of tracks names to import from given folder start point
	async function createDirectoryTree(folderLocation) {
		try {
			const tracksToImportArray = [];
			dirTree(
				folderLocation,
				{ extensions: regexExtensions },
				(item, path, stats) => { tracksToImportArray.push(item.path) }
			);
			return tracksToImportArray;

		} catch (error) {
			console.error(error.message);
		}
	};

	//===============================================================================================================//

	// Use 'music-metadata' to read each track in array and create array of track objects containing common metadata
	async function createTrackMetaData(trackLocation) {
		try {
			const trackMetaData = await musicMeta.parseFile(trackLocation);
			return trackMetaData.common;

		} catch (error) {
			console.error(error.message);
		}
	};

	//===============================================================================================================//

	// Save picture file to disk and catch any error
	async function saveTrackPicture(path, data) {
			try {
				fs.writeFileSync(path, data);

			} catch (error) {
				console.error(error.message);
			}
	}

	//===============================================================================================================//

	// Spilt the tracks 'album' meta data prop to create release label prop fro track object
	function createReleaseLabelProp(trackAlbumString) {
		let releaseLabel = regexLabel.exec(trackAlbumString)[0];
		return releaseLabel.trim();
	};

	//===============================================================================================================//

	// Create array of track names to import
	const tracksToImport = await createDirectoryTree(folderLocation);

	// Loop through each track in array, parse file, abstract metadata and create new track obj ready for import 
	for (let index = 0; index < tracksToImport.length; index ++) {

		// Parse file name and return extract track result containing metadata
		const trackResult = await createTrackMetaData(tracksToImport[index]);

		// Build new track object using newly extracted metadata
		const trackItem = {
			name: trackResult.title ? trackResult.title : "",
			artist_name: [],
			release_title: [],
			release_label: trackResult.album ? [{ name: createReleaseLabelProp(trackResult.album) }] : "",
			release_catalogue: trackResult.album ? trackResult.album : "",
			release_ref: "",
			track_number: trackResult.track.no ? trackResult.track.no : "",
			genre: trackResult.genre.length ? trackResult.genre[0] : "",
			mixkey: trackResult.key ? trackResult.key : "",
			bpm: trackResult.bpm ? trackResult.bpm : "",
			year: trackResult.year ? trackResult.year : "",
			picture: [],
			file_location: tracksToImport[index]
		};

		if (trackResult.artists.length) {
			// Create new array of Artist prop strings by spliting artists string using regex query
			let splitArtists = trackResult.artists[0].split(regexArtist);

			// For each remaining artist prop create own object prop in 'artist_name' array
			splitArtists.forEach(artist => {
				trackItem.artist_name.push({ name: artist });
			});
		}

		// If track has embedded picture, save image to disk and props to track item 
		if (trackResult.picture) {

			// Create file format extension from embedded picture format prop
			const fileFormat = regexImageExtension.exec(trackResult.picture[0].format);

			// Create file name and desired save path
			const fileName = `${trackResult.album}.${fileFormat}`;
			const filePath = path.join('assets', 'images', 'releases', fileName);

			// Save picture to disk
			await saveTrackPicture(filePath, trackResult.picture[0].data);

			// Add props to track item 
			trackItem.picture.push({
				filename: fileName,
				format: trackResult.picture[0].format,
				location: "releases"
			});
		}

		// Add new track object to array ready for processing and importing into database
		tracks.push(trackItem);
	}

	//===============================================================================================================//

	if (tracks.length === tracksToImport.length) {
		return tracks;
	}

}

//===============================================================================================================//
// Utility - Return Base64 Encoded Picture From Given Folder
//===============================================================================================================//

async function importPicture(location, filename) {

	const filePath = path.join('assets', 'images', location, filename);

	try {
		const file = fs.readFileSync(filePath, 'base64');
		return file;

	} catch (error) {
		return false;
	}
}

//===============================================================================================================//

module.exports = { importTracks, importPicture };
