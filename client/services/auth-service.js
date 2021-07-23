const axios = require('axios');
const dotenv = require("dotenv");
const jwtDecode = require('jwt-decode');
const keytar = require('keytar');
const os = require('os');
const url = require('url');

//===============================================================================================================//

// Process Environmental Variables
dotenv.config();

const {
	API_IDENTIFIER,
	AUTH0_TENANT,
	AUTH0_CLIENT_ID
} = process.env;

//===============================================================================================================//

//  Auth0 callback after finishing the authentication process
const redirectUri = 'http://localhost/callback';

//===============================================================================================================//

// Setup Keytar refresh token persistance service
const keytarService = 'electron-openid-oauth';
const keytarAccount = os.userInfo().username;

let accessToken = null;
let profile = null;
let refreshToken = null;

// Return current accessToken
function getAccessToken() {
	return accessToken;
}

// Return user profile object extracted from the ID Token sent by Auth0.
function getProfile() {
	return profile;
}

//===============================================================================================================//

// Construct Authentication Request URL
function getAuthenticationURL() {
	return `https://${AUTH0_TENANT}/authorize?audience=${API_IDENTIFIER}&scope=openid profile email offline_access&response_type=code&client_id=${AUTH0_CLIENT_ID}&redirect_uri=${redirectUri}`;
}

//===============================================================================================================//
// Handle Auth0 Refresh Tokens
//===============================================================================================================//

async function refreshTokens() {

	// Check if existing password present on disk
	const refreshToken = await keytar.getPassword(keytarService, keytarAccount);

	// Construct POST to Auth0 service containing credentials
	if (refreshToken) {
		const refreshOptions = {
			method: 'POST',
			url: `https://${AUTH0_TENANT}/oauth/token`,
			headers: {'content-type': 'application/json'},
			data: {
				grant_type: 'refresh_token',
				client_id: AUTH0_CLIENT_ID,
				refresh_token: refreshToken,
			}
		};
	
		try {
			// POST to Auth0 service and save response to local variales
			const response = await axios(refreshOptions);
			accessToken = response.data.access_token;
			profile = jwtDecode(response.data.id_token);
		} catch (error) {
			await logout();
	
			throw error;
		}
	} else {
		throw new Error("No available refresh token.");
	}
}

//===============================================================================================================//
// Handle Auth0 Authentication Request (New & Refresh)
//===============================================================================================================//

async function loadTokens(callbackURL) {
	const urlParts = url.parse(callbackURL, true);
	const query = urlParts.query;

	// Set auth exchange (request type & return) options
	const exchangeOptions = {
		'grant_type': 'authorization_code',
		'client_id': AUTH0_CLIENT_ID,
		'code': query.code,
		'redirect_uri': redirectUri,
	};

	// Create auth POST request
	const options = {
		method: 'POST',
		url: `https://${AUTH0_TENANT}/oauth/token`,
		headers: {
			'content-type': 'application/json'
		},
		data: JSON.stringify(exchangeOptions),
	};

	try {
		// POST to Auth0 service and save response to local variales
		const response = await axios(options);
		accessToken = response.data.access_token;
		profile = jwtDecode(response.data.id_token);
		refreshToken = response.data.refresh_token;

		// If refresh token granted save to persistent disk service 
		if (refreshToken) {
			await keytar.setPassword(keytarService, keytarAccount, refreshToken);
		}
	} catch (error) {
		await logout();

		throw error;
	}
}

//===============================================================================================================//

// Clears local session by removing refresh token from disk (nullifies accessToken, profile & refreshToken variables)
async function logout() {
	await keytar.deletePassword(keytarService, keytarAccount);

	accessToken = null;
	profile = null;
	refreshToken = null;

	return true;
}

//===============================================================================================================//

// Returns the URL of the /v2/logout endpoint from Auth0 tenant (used to clear user sessions in the Auth0 layer)
function getLogOutUrl() {
	return `https://${AUTH0_TENANT}/v2/logout`;
}

//===============================================================================================================//

module.exports = {
	getAccessToken,
	getAuthenticationURL,
	getLogOutUrl,
	getProfile,
	loadTokens,
	logout,
	refreshTokens,
};
