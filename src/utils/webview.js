import {ipcRenderer} from 'electron';
const openWebview = (url,proxy)=>{
	ipcRenderer.send('create-new-window',url,proxy)
}

export {
	openWebview
};