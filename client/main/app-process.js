const { BrowserWindow } = require('electron');

const path = require("path");
const isDev = require('electron-is-dev');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

let mainWindow;

//===============================================================================================================//
// Initiate New Authenticated App Window
//===============================================================================================================//

function createAppWindow() {

	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: false, // Restrict access to local Node resources
			enableRemoteModule: false, // Stop remote communication to Main process
			contextIsolation: true, // Protect against prototype pollution
			preload: path.join(__dirname, "preload.js") // use preload script (ipcRenderer & ContextBridge)
		}
	});

	// Load app
	mainWindow.loadURL(
		isDev
			? 'http://localhost:3000'
			: `file://${path.join(__dirname, 'index.html')}`
	);

	// Chrome Dev Tools
	if (isDev) {
		mainWindow.webContents.openDevTools({ mode: 'detach' });
	}

	// If user closed mainWindow reset instance of mainWindow
	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

//===============================================================================================================//

// Reset any existing instance of mainWindow
function destroyAppWindow() {
	if (!mainWindow) return;
	mainWindow.close();
	mainWindow = null;
}

//===============================================================================================================//

module.exports = { 
	createAppWindow,
	destroyAppWindow 
};
