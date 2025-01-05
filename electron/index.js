import {app,session, BaseWindow,BrowserWindow,BrowserView,WebContentsView, ipcMain, screen, contextBridge, ipcRenderer} from 'electron';
import { join } from 'path';

// 创建窗口
let win
const createWindow = (width, height) => {
	
	session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
	  callback({
	    responseHeaders: {
	      ...details.responseHeaders,
	      'Content-Security-Policy': ['default-src \'self\'; style-src \'self\' http://127.0.0.1:* \'unsafe-inline\';']
	    }
	  })
	})
	const devTools = import.meta.env.VITE_APP_DEV_TOOLS;
    win = new BrowserWindow({
			width: 768, 
			height: 648,
			minWidth: 408, 
			minHeight: 350,
      webPreferences:{
				nodeIntegration: true,
				contextIsolation: false,
				// enableRemoteModule: true,
				// preload: join(__dirname, 'preload.js'), 
				devTools: devTools == 'open',
        // nodeIntegration:true,
        // contextIsolation:false,
				webviewTag: true,
      }
    });
		
    if (process.env.NODE_ENV !== 'development') {
			win.loadFile(join(__dirname,'../index.html'))
    }else{
			// leftView.webContents.loadURL('https://electronjs.org')
			const devServerUrl = "http://127.0.0.1:1422";
			console.log(devServerUrl);
			win.loadURL(devServerUrl)
    }
		
		
		// const leftView = new WebContentsView()
		// leftView.webContents.loadURL('https://electronjs.org')
		// win.contentView.addChildView(leftView)
		// leftView.setBounds({ x: 0, y: 0, width: 400, height: 600 })
		
		// const view = new BrowserView()
		//   win.setBrowserView(view)
		//   view.setBounds({ x: 0, y: 0, width: 300, height: 300 })
		//   view.webContents.loadURL('https://electronjs.org')
    // 打开调试工具
    // win.webContents.openDevTools()

    // 渲染进程传主进程
    ipcMain.on('message',(_,num) =>{
        console.log(num,'---------中文');
    });
		
		ipcMain.on('resize',(_,{ width, height}) =>{
		  win.setSize(width, height)
		});
		
		// 监听来自渲染进程的请求，创建新窗口
		ipcMain.on('create-new-window', (e,url,proxy) => {
		  const newWindow = new BrowserWindow({
				parent: win,
		    width: 768,
		    height: 648,
				webPreferences:{
					nodeIntegration: true,
					contextIsolation: false,
					devTools: devTools == 'open',
					webviewTag: true,
				}
		    //   preload: join(__dirname, 'preload.js'),
		  });
			console.log("8888")
		  newWindow.loadURL(url); 
			if(proxy){
			console.log(proxy)
				app.setProxy({proxyRules: `socks5://${proxy}`})
			}
		});
		// setTimeout(() =>{
		// 	win.webContents.send('load',{massage:"初始化完成"})
		// },3000);
}


 

// 运行

app.whenReady().then((event) => {
	const { width, height } = screen.getPrimaryDisplay().workAreaSize
	createWindow(width, height)
})