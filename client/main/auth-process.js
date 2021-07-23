const { BrowserWindow } = require('electron');
const authService = require('../services/auth-service');
const { createAppWindow } = require('../main/app-process');

let authWindow = null;

//===============================================================================================================//
// Initiate User Authentication Window
//===============================================================================================================//

function createAuthWindow() {

	// Reset any existing instance of authWindow
	destroyAuthWindow();

	authWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: false, // Restrict access to local Node resources
			enableRemoteModule: false, // Stop remote communication to Main process
			contextIsolation: true, // Protect against prototype pollution
		}
	});

	// Load login page using the authorization server URL defined in 'auth-service'
	authWindow.loadURL(authService.getAuthenticationURL());

	// Create new session object on authWindow
	const {session: {webRequest}} = authWindow.webContents;

	const filter = {
		urls: [
			'http://localhost/callback*'
		]
	};

	// Setup listener on webRequest that triggers when Auth0 calls the callback URL
	// Goal of listener is to load users' tokens to then create the mainWindow
	webRequest.onBeforeRequest(filter, async ({url}) => {
		await authService.loadTokens(url);
		createAppWindow();
		return destroyAuthWindow();
	});

	// If user authenticated reset instance of authWindow
	authWindow.on('authenticated', () => {
		destroyAuthWindow();
	});

	// If user closed authWindow reset instance of authWindow
	authWindow.on('closed', () => {
		authWindow = null;
	});
}

//===============================================================================================================//

// Reset any existing instance of authWindow
function destroyAuthWindow() {
	if (!authWindow) return;
	authWindow.close();
	authWindow = null;
}

//===============================================================================================================//

// Create user authentication logout window
async function createLogoutWindow() {
	
	const logoutWindow = new BrowserWindow({
		show: false,
	});

	// Load logout page using the Auth0 /v2/logout endpoint defined in 'auth-service'
	logoutWindow.loadURL(authService.getLogOutUrl());

	logoutWindow.on('ready-to-show', async () => {
		logoutWindow.close();
	});

	// Remove persistent authication details from disk
	const logoutSuccess = await authService.logout();

	return logoutSuccess;
}

//===============================================================================================================//

module.exports = {
	createAuthWindow,
	createLogoutWindow,
};
