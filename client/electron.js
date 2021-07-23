const { app, BrowserWindow, ipcMain, dialog } = require('electron');

const { createAuthWindow, createLogoutWindow } = require('./main/auth-process');
const { createAppWindow, destroyAppWindow } = require('./main/app-process');
const authService = require('./services/auth-service');
const isDev = require('electron-is-dev');

//===============================================================================================================//
// Create new application window (Authenticated / Login)
//===============================================================================================================//

// If auth token successfully refreshed create app window else create auth window

async function createWindow() {
	try {
		await authService.refreshTokens();
		return createAppWindow();
	} catch (err) {
		createAuthWindow();
	}
}

//===============================================================================================================//

// Install &initiate 'Dev Tools' when app is ready and in development mode

app.on('ready', () => {
	if (isDev) {
		const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
		[REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS].forEach(extension => {
			installExtension(extension)
					.then((name) => console.log(`Added Extension: ${name}`))
					.catch((err) => console.log('An error occurred: ', err));
		});
	}
});

//===============================================================================================================//

// Electron initialization complete, app is ready so create new window.
// Some APIs can only be used after this event occurs.

app.on("ready", createWindow);


//===============================================================================================================//
// Handle IPC (inter-process-communication) between Main & Renderer process
//===============================================================================================================//

// IPC: Handle User Folder Selection Request Via Native Electron Dialog

ipcMain.handle("elecDialogFolder", async (event, arg) => {
	const options = {
		message: "Please select a directory to import",
		properties: ['openDirectory']
	}
	const dialogValues = await dialog.showOpenDialog(null, options);

	return dialogValues.filePaths;
});

//===============================================================================================================//

// IPC: Establish User Authentication Status

ipcMain.handle("elecUserAuth", async (event, arg) => {
	let isAuth = false;

	const checkAuth = await authService.getAccessToken();
	if (checkAuth !== null) { isAuth = true }

	return isAuth;
});

//===============================================================================================================//

// IPC: Return Authenticated User Details

ipcMain.handle("elecUserDetails", async (event, arg) => {
	let userDetails;

	const profile = await authService.getProfile();

	if (profile !== null) {
		userDetails = {
			name: profile.name,
			picture: profile.picture,
			email: profile.email
		}
	};

	return userDetails;
});

//===============================================================================================================//

// IPC: Handle User Login Request

ipcMain.handle("elecUserLogin", async (event, arg) => {
	let isAuth = false;

	await createWindow();
	destroyAppWindow();

	const checkAuth = await authService.getAccessToken();
	if (checkAuth !== null) { isAuth = true };

	return isAuth;
});

//===============================================================================================================//

// IPC: Handle User Logout Request

ipcMain.handle("elecUserLogout", async (event, arg) => {
	let isAuth = false;
	
	const userLogout = await createLogoutWindow();

	if (userLogout) {
		const checkAuth = await authService.getAccessToken();
		isAuth = checkAuth !== null ? true : false;
	};
	
	return isAuth;
});


//===============================================================================================================//
// Handle App Closures
//===============================================================================================================//

// Quit when all windows are closed.
// macOS may need to explicitly close all windows with Cmd + Q.

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

//===============================================================================================================//

// if app launched for the first time, re-launched if already running or clicked on the app's dock / taskbar icon;
// check if no current windows open and create new window

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
