//===============================================================================================================//
// Shallow copy Object / Array
//===============================================================================================================//

export const updateObject = (oldObject, updatedProperties) => {
	return {
		...oldObject,
		...updatedProperties
	};
};

//===============================================================================================================//
// Create Title Case strings from Camel Case strings
//===============================================================================================================//

export const labelCreator = string => {
	const label = string.split(/(?=[A-Z])/).join(" ");
	return label[0].toUpperCase() + label.substring(1);
};

//===============================================================================================================//
// Apply Show/Hide styling to element
//===============================================================================================================//

export const displayToggle = event => {
	const targetElement = event.target.nextElementSibling;
	if (targetElement.classList.contains("visually-hidden")) {
		targetElement.classList.remove("visually-hidden");
		event.target.className="open";
	} else {
		targetElement.classList.add("visually-hidden");
		event.target.className="closed";
	}
}

//===============================================================================================================//
// Sort Array By String
//===============================================================================================================//

export const sortArrayByName = async (arr, arrFilter1, arrFilter2=null) => {

	let sortedArr = [...arr];

	sortedArr.sort(function(arrItem1, arrItem2) {

		// Move item up array on 1st filter
		if (arrItem1[arrFilter1] < arrItem2[arrFilter1]) return -1;
		// Move item down array on 1st filter
		if (arrItem1[arrFilter1] > arrItem2[arrFilter1]) return 1;

		if (arrFilter2) {
			// Move item up array on 2nd filter
			if (arrItem1[arrFilter2] < arrItem2[arrFilter2]) return -1;
			// Move item down array on 2nd filter
			if (arrItem1[arrFilter2] > arrItem2[arrFilter2]) return 1;
		}

		// Hold position in array, strings match
		return 0;
	});

	return sortedArr;
}

//===============================================================================================================//
