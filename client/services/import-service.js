const dirTree = require("directory-tree");
const musicMeta = require("music-metadata");

//===============================================================================================================//
// Utility - Create Array Of Track Objects From Given Folder
//===============================================================================================================//

async function importTracks(folderLocation) {

	const tracks = [];
	const regexLabel = /^[^[(]+/; // Match & return string value preceeding either '[' or '('
	const regexExt = /\.(mp3|wav|flac|)$/; // Match & return string value ending with these extensions
	
	//===============================================================================================================//

	// Use 'directory-tree' to create array of tracks names to import from given folder start point
	async function createDirectoryTree(folderLocation) {
		try {
			const tracksToImportArray = [];
			dirTree(
				folderLocation,
				{ extensions: regexExt },
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

		if (trackResult.picture) {
			trackItem.picture.push({
				filename: trackResult.title,
				format: trackResult.picture[0].format,
				location: "",
				data: trackResult.picture[0].data
			});
		}
	
		if (trackResult.artists.length) {
			trackResult.artists.forEach(artist => {
				trackItem.artist_name.push({ name: artist });
			});
		}
	
		// Add new track object to array ready for processing and importing into database
		tracks.push(trackItem);
	};

	// If tracks objects in array equal number of original track names extracted return new array
	if (tracks.length === tracksToImport.length) {
		return tracks;
	}
}

//===============================================================================================================//

module.exports = { importTracks };
