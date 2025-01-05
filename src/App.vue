<script setup>
	import {ipcRenderer} from 'electron'
	import { useToast } from "primevue/usetoast";
	import { useConfirm } from "primevue/useconfirm";
	import { useStore } from 'vuex';

	const store = useStore();
	const toast = useToast();
	const confirm = useConfirm();
	store.commit('notice/setToast', toast);
	store.commit('notice/setConfirm', confirm);

	const emit = () =>{
	  ipcRenderer.send('message',123)
	}
	ipcRenderer.on('load',(_,message) => {
	  console.log(message,123);
		// BrowserWindow.getCurrentWindow().setSize(500, 500)
	})
	//<button @click="emit">发送消息</button>
</script>

<template>
	<Toast />
	<ConfirmDialog></ConfirmDialog>
	<router-view />
</template>

<style scoped></style>
