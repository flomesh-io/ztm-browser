import { request } from './common/request';

export default class ZtmService {
	
	login(user, password) {
		return request('/api/login', "POST", {
			user, password
		});
	}
	identity() {
		return request('/api/identity',"GET",null, {headers:{
			"Content-Type": "text/plain"
		}});
	}
	pushPrivateKey(privatekey) {
		return request(`/api/identity`, "POST", privatekey, {headers:{
			"Content-Type": "text/plain"
		}});
	}
	info({id}) {
		return request('/api/info');
	}
	inviteEp(mesh, username, identity) {
		return request(`/api/meshes/${mesh}/permits/${username}`, "POST", identity, {headers:{
			"Content-Type": "text/plain"
		}});
	}
	getMeshes() {
		return request('/api/meshes');
	}
	getMesh(name) {
		return request(`/api/meshes/${name}`);
	}
	getPermit(PublicKey, UserName, pubHub) {
		return request(pubHub||`${this.getPubHub()}/permit`,"POST",{PublicKey, UserName});
	}
	getEndpointStats(mesh) {
		return request(`/api/meshes/${mesh}/stats/endpoints`);
	}
	getEndpoints(mesh) {
		return request(`/api/meshes/${mesh}/endpoints`);
	}
	getVersion() {
		return request(`/api/version`);
	}
}
