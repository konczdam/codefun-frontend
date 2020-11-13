import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

export const state = () => ({
  websocketUrl: 'http://localhost:8080/api/ws',
  connected: false,
  roomSubscription: null,
  roomDeletedSubscription: null,
  gameTypeSetSubscription: null,
});

export const getters = {
  connected: state => state.connected,
  roomSubscription: state => state.roomSubscription,
  roomDeletedSubscription: state => state.roomDeletedSubscription,
  gameTypeSetSubscription: state => state.gameTypeSetSubscription,
};

export const mutations = {
  setConnected(state, status) {
    state.connected = status;
  },
  setRoomSubscription(state, newSub) {
    state.roomSubscription = newSub;
  },
  setRoomDeletedSubscription(state, newSub) {
    state.roomDeletedSubscription = newSub;
  },
  setGameTypeSetSubscription(state, newSub) {
    state.gameTypeSetSubscription = newSub;
  }
};

export const actions = {
  connect({ state, commit }) {
    if (state.connected) {
      return;
    }

    this.socket = new SockJS(state.websocketUrl);
    this.stompClient = Stomp.over(this.socket);

    // comment this if you want to see debug messages
    // this.stompClient.debug = (message) => {};

    this.stompClient.connect(
      { Authorization: 'Bearer ' + this.$auth.$storage.getUniversal('user').token },
      (frame) => {
        commit('setConnected', true);
        this.stompClient.subscribe('/app/rooms', (tick) => {
          const roomList = JSON.parse(tick.body);
          commit('main/initRoomList', roomList, { root: true });
        });
        this.stompClient.subscribe('/topic/rooms/newRoom', (message) => {
          const newRoom = JSON.parse(message.body);
          commit('main/addRoom', newRoom, { root: true });
          if (newRoom.owner.id === this.$auth.$storage.getUniversal('user').id) {
            this.$router.push({ name: 'room' });
          }
        });

        this.stompClient.subscribe('/topic/rooms/updateRoom', (message) => {
          const response = JSON.parse(message.body);
          if (Array.isArray(response)) {
            const people = response;
            const ownerId = people.shift().id;
            commit('main/updateRoom', { roomId: ownerId, others: people }, { root: true });
          } else {
            const { roomId, gameStarted } = response;
            commit('main/updateRoomState', { roomId, gameStarted }, { root: true });
          }
        });
      }
    );
  },

  createRoom({ commit }, description) {
    const ownerId = this.$auth.$storage.getUniversal('user').id;
    commit('main/setRoomOwnerId', ownerId, { root: true });
    this.stompClient.send('/app/rooms/addRoom',
      JSON.stringify({
        ownerId,
        description,
      })
    );
  },

  joinRoom({ commit }, roomOwnerId) {
    commit('main/setRoomOwnerId', roomOwnerId, { root: true });
    this.stompClient.send('/app/rooms/joinRoom',
      roomOwnerId,
    );
  },

  subscribeToRoomMessages({ commit }, roomId) {
    const roomSubscription = this.stompClient.subscribe(`/topic/rooms/${roomId}/newMessage`, (data) => {
      const message = JSON.parse(data.body);
      commit('main/addRoomMessage', { roomId, message }, { root: true });
    });
    commit('setRoomSubscription', roomSubscription);
  },

  sendMessageToRoom({ commit }, { message, roomId }) {
    this.stompClient.send(`/app/rooms/${roomId}/send`,
      JSON.stringify(message),
    );
  },

  sendDeleteRoom({ commit }, roomId) {
    this.stompClient.send(`/app/rooms/${roomId}/close`, '{}');
    commit('main/deleteRoomFromList', { roomId }, { root: true });
  },

  subscribeToRoomClosed({ commit, getters }, roomId) {
    const roomDeletedSubscription = this.stompClient.subscribe(`/topic/rooms/${roomId}/roomClosed`, (message) => {
      const messageText = message.body;
      if (messageText === 'Room closed') {
        getters.roomDeletedSubscription.unsubscribe();
        getters.roomSubscription.unsubscribe();
        getters.gameTypeSetSubscription.unsubscribe();
        commit('setRoomDeletedSubscription', null);
        commit('setRoomSubscription', null);
        commit('setGameTypeSetSubscription', null);
        this.$notifier.showMessage({ content: 'The room was closed!', color: 'danger' });
        commit('main/deleteRoomFromList', roomId, { root: true });
        this.$router.push({ name: 'compete' });
      }
    });
    commit('setRoomDeletedSubscription', roomDeletedSubscription);
  },

  subscribeToGameStarted({ commit }, roomId) {
    this.stompClient.subscribe(`/topic/rooms/${roomId}/gameStarted`, (message) => {
      const room = JSON.parse(message.body);
      this.$notifier.showMessage({ content: 'The game will start in a few seconds', color: 'success' });
      setTimeout(() => {
        this.$router.push({ name: 'game' });
      }, 3000);
      commit('main/updateRoomFull', { roomId, updatedRoom: room }, { root: true });
    });
  },

  subscribeToRoomGameTypeSet({ commit }, roomId) {
    const gameTypeSetSubscription = this.stompClient.subscribe(`/topic/rooms/${roomId}/gameTypeSet`, (message) => {
      const newGameType = message.body.substring(1, message.body.length - 1);
      commit('main/setRoomGameType', { roomId, newGameType }, { root: true });
    });
    commit('setGameTypeSetSubscription', gameTypeSetSubscription);
  },

  // eslint-disable-next-line no-empty-pattern
  sendGameTypeSet({}, newGameType) {
    this.stompClient.send('/app/rooms/setGameType',
      newGameType,
    );
  },

  sendLeaveRoom({ commit, getters }, roomId) {
    this.stompClient.send(`/app/rooms/${roomId}/leaveRoom`, '{}', {
      Authorization: 'Bearer ' + this.$auth.$storage.getUniversal('user').token
    });
    getters.roomDeletedSubscription.unsubscribe();
    getters.roomSubscription.unsubscribe();
    getters.gameTypeSetSubscription.unsubscribe();
    commit('setRoomDeletedSubscription', null);
    commit('setRoomSubscription', null);
    commit('setGameTypeSetSubscription', null);
  },

  sendStartGame({ commit, getters }) {
    this.stompClient.send('/app/rooms/startGame', '{}');
  },

  disconnect() {
    this.stompClient.disconnect(() => {});
  }
};
