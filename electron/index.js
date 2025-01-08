import {app,session, BaseWindow,BrowserWindow,BrowserView,WebContentsView, ipcMain, screen, contextBridge, ipcRenderer} from 'electron';
import { join } from 'path';
import { writeFileSync,readFileSync,existsSync } from 'fs';
const historyPath = join(__dirname, 'history.json');

let history = {};
if (existsSync(historyPath)) {
  history = JSON.parse(readFileSync(historyPath, 'utf8'));
}

// 创建窗口
let win
const createWindow = (width, height) => {
	
	session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
	  callback({
	    responseHeaders: {
	      ...details.responseHeaders,
	      'Content-Security-Policy': ['script-src * \'unsafe-inline\' \'unsafe-eval\';']
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
			const devServerUrl = "http://localhost:1422";
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
		  console.log(`proxy is ${proxy}`)
			if(proxy){
				app.setProxy({mode:'fixed_servers',proxyRules: `http=${proxy},socks5://${proxy};https=${proxy},socks5://${proxy}`}).then(()=>{
					const newWindow = new BrowserWindow({
						parent: win,
					  width: 768,
					  height: 648,
						webPreferences:{
							nodeIntegration: true,
							contextIsolation: false,
							devTools: devTools == 'open',
							webviewTag: true,
					    preload: join(__dirname, 'preload.js'),
						}
					});
					newWindow.loadURL(url); 
					app.resolveProxy(url).then((p)=>{
						console.log(`resolveProxy is ${p}`)
					})
				})
			} else {
				const newWindow = new BrowserWindow({
					parent: win,
				  width: 768,
				  height: 648,
					webPreferences:{
						nodeIntegration: true,
						contextIsolation: false,
						devTools: devTools == 'open',
						webviewTag: true,
				    preload: join(__dirname, 'preload.js'),
					}
				});
				newWindow.loadURL(url); 
			}
		});
		// setTimeout(() =>{
		// 	win.webContents.send('load',{massage:"初始化完成"})
		// },3000);
		
		// 设置共享数据并持久化
		ipcMain.handle('set-data', async (event, key, value) => {
		  history[key] = value;
		  writeFileSync(historyPath, JSON.stringify(history), 'utf8'); 
		});
		ipcMain.handle('push-data', async (event, key, value) => {
			if(!history[key]){
				history[key] = []
			}
			history[key].push(value)
		  writeFileSync(historyPath, JSON.stringify(history), 'utf8'); 
		});
		
		// 获取共享数据
		ipcMain.handle('get-data', async (event, key) => {
		  return history[key];
		});
}


 

// 运行

app.whenReady().then((event) => {
	const { width, height } = screen.getPrimaryDisplay().workAreaSize
	createWindow(width, height)
})