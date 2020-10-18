import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

export const state = () => ({
  websocketUrl: 'http://localhost:8080/api/ws',
  connected: false,
});

export const getters = {
  connected: state => state.connected
};

export const mutations = {
  setConnected(state, status) {
    state.connected = status;
  }
};

export const actions = {
  connect({ rootState, state, commit }) {
    if (state.connected) {
      return;
    }

    this.socket = new SockJS(state.websocketUrl);
    this.stompClient = Stomp.over(this.socket);

    // comment this if you want to see debug messages
    // this.stompClient.debug = (message) => {};

    this.stompClient.connect(
      { Authorization: this.$auth.loggedIn },
      (frame) => {
        commit('setConnected', true);
        this.stompClient.subscribe('/app/rooms', (tick) => {
          const roomList = JSON.parse(tick.body);
          commit('main/initRoomList', roomList, { root: true });
        });
      }
    );

    // this.stompClient.subscribe()
  }
};
