import { useState, useCallback } from "react";

//===============================================================================================================//
// Hook to handle importing pictures via Electron IPC communication framework
//===============================================================================================================//

const useGetEncodedPicture = () => {

	const [getImportedPicture, setImportedPicture] = useState('')
	
	const getEncodedPictureHandler = useCallback(async (picture) => {

		if (picture.length) {
			const location = picture[0].location;
			const filename = picture[0].filename;

			const imageFile = await window.api.imageImport(location, filename);
		
			if (imageFile) {
				setImportedPicture(`data:${picture[0].format};base64,${imageFile}`)
			} 
		}
	}, []);

	return {
		importedPicture: getImportedPicture,
		getEncodedPictureHandler: getEncodedPictureHandler
	}
}

//===============================================================================================================//

export default useGetEncodedPicture;
