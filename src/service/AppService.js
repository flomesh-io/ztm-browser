import { request,requestNM,getUrl,merge } from './common/request';
import toast from "@/utils/toast";
import confirm from "@/utils/confirm";
import { openWebview } from '@/utils/webview';
import store from "@/store";
import ZtmService from '@/service/ZtmService';
const ztmService = new ZtmService();
export default class AppService {
	
	startApp({
		mesh, ep, provider, app
	}) {
		return request(`/api/meshes/${mesh}/endpoints/${ep}/apps/${provider}/${app}`, "POST", {
			isRunning: true
		});
	}
	stopApp({
		mesh, ep, provider, app
	}) {
		return request(`/api/meshes/${mesh}/endpoints/${ep}/apps/${provider}/${app}`, "POST", {
			isRunning: false
		});
	}
	getProxyListen(mesh) {
		const options = {
			mesh:mesh?.name,
			ep:mesh?.agent?.id,
			provider:'ztm',
			app:'proxy',
		}
		const base = this.getAppUrl(options);
		return this.invokeAppApi({
			base,
			url:`/api/endpoints/${mesh?.agent?.id}/config`,
			method: 'GET'
		})
	}
	getAppUrl({
		mesh, provider, app
	}) {
		return getUrl(`/api/meshes/${mesh}/apps/${provider}/${app}`);
	}
	invokeAppApi({
		base,
		url,
		method,
		body
	}){
		if(!!body){
			return request(`${base}${url}`, method, body);
		}else{
			return request(`${base}${url}`, method);
		}
	}
}
