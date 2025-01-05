import { contextBridge, ipcRenderer } from 'electron';
import Store from 'electron-store';
const store = new Store({
	projectName:'ztm',
});

// Expose protected methods from node modules
contextBridge.exposeInMainWorld("electron", {
				createNewWindow: (url) => ipcRenderer.send('create-new-window',url),
        ipcRenderer: {
            send: (channel, data) => {
                // whitelist channels
                let validChannels = ["quitApp", "keyPress", "updateCache", "deleteCache", "openCache", "selectCustomLocation", "selectCacheLocation", "refreshCache", "openPreview", "refreshConfig", "resetConfig", "updateLocation", "openConfigFolder", "selectFile", "openInfoEditor", "newGlobalShortcut", "consoleLog"];
                if (validChannels.includes(channel)) {
                    ipcRenderer.send(channel, data);
                }
            },
            on: (channel, func) => {
                let validChannels = ["displaySettings", "newCustomVideos", "newVideo", "blankTheScreen", "showWelcome", "updateAttribute", "screenNumber"];
                if (validChannels.includes(channel)) {
                    // Deliberately strip event as it includes `sender`
                    ipcRenderer.on(channel, (event, ...args) => func(...args));
                }
            },
            // From render to main and back again.
            invoke: (channel, args) => {
                let validChannels = ["newVideoId"];
                if (validChannels.includes(channel)) {
                    return ipcRenderer.invoke(channel, args);
                }
            }
        },
        store: {
            get: (key) => {
                return store.get(key);
            },
            set: (key, value) => {
                return store.set(key, value);
            }
        },
    }
)