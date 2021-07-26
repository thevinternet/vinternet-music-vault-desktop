const { contextBridge, ipcRenderer } = require("electron");

//===============================================================================================================//

// Expose protected methods (via contextBridge) allowing the renderer
// process to use the ipcRenderer without exposing the entire object

contextBridge.exposeInMainWorld(
	"api", {
		dialogFolder: async (arg) => {
			return await ipcRenderer.invoke("elecDialogFolder", arg);
		},
		fileImport: async (arg) => {
			return await ipcRenderer.invoke("elecFileImport", arg);
		},
		userAuth: async (arg) => {
			return await ipcRenderer.invoke("elecUserAuth", arg);
		},
		userDetails: async (arg) => {
			return await ipcRenderer.invoke("elecUserDetails", arg);
		},
		userLogin: async (arg) => {
			return await ipcRenderer.invoke("elecUserLogin", arg);
		},
		userLogout: async (arg) => {
			return await ipcRenderer.invoke("elecUserLogout", arg);
		}
	}
);
