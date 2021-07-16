const path = require('path');

const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');

//===============================================================================================================//

function createWindow() {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	// and load the index.html of the app.
	// win.loadFile("index.html");
	win.loadURL(
		isDev
			? 'http://localhost:3000'
			: `file://${path.join(__dirname, 'client/index.html')}`
	);

	// Chrome Dev Tools
	if (isDev) {
		win.webContents.openDevTools({ mode: 'detach' });
	}
}

//===============================================================================================================//

// Initiate 'React Dev Tools' when app is ready and in development mode
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

//===============================================================================================================//

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

//===============================================================================================================//

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
