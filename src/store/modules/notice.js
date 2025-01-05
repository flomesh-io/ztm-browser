export default {
  namespaced: true,
  state: {
		confirm:null,
		toast:null,
		app:null,
		unread:0,
		rooms:[],
		pushed:{},
  },
  getters: {
    pushed: (state) => {
      return state.pushed;
    },
    confirm: (state) => {
      return state.confirm;
    },
    toast: (state) => {
      return state.toast;
    },
    app: (state) => {
      return state.app;
    },
    rooms: (state) => {
      return state.rooms;
    },
    unread: (state) => {
      return state.unread;
    },
  },
  mutations: {
    setPushedByKey(state, pushed) {
      state.pushed[pushed] = true;
    },
    setPushed(state, pushed) {
      state.pushed = pushed;
    },
    setConfirm(state, confirm) {
      state.confirm = confirm;
    },
    setToast(state, toast) {
      state.toast = toast;
    },
    setApp(state, app) {
      state.app = app;
    },
    setRooms(state, rooms) {
      state.rooms = rooms;
    },
    setUnread(state, unread) {
      state.unread = unread;
    },
  },
};
