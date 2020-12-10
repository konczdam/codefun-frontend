import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

export const state = () => ({
  websocketUrl: 'http://localhost:8080/api/ws',
  connected: false,
  roomSubscription: null,
  gameTypeSetSubscription: null,
  gameStartSubscription: null,
  gameEndSubscription: null,
  userUpdateSubscription: null,
});

export const getters = {
  connected: state => state.connected,
  roomSubscription: state => state.roomSubscription,
  gameTypeSetSubscription: state => state.gameTypeSetSubscription,
  gameStartSubscription: state => state.gameStartSubscription,
  gameEndSubscription: state => state.gameEndSubscription,
  userUpdateSubscription: state => state.userUpdateSubscription,
};

export const mutations = {
  setConnected(state, status) {
    state.connected = status;
  },
  setRoomSubscription(state, newSub) {
    state.roomSubscription = newSub;
  },
  setGameTypeSetSubscription(state, newSub) {
    state.gameTypeSetSubscription = newSub;
  },
  setGameStartSubscription(state, newSub) {
    state.gameStartSubscription = newSub;
  },
  setGameEndSubscription(state, newSub) {
    state.gameEndSubscription = newSub;
  },
  setUserUpdateSubscription(state, newSub) {
    state.userUpdateSubscription = newSub;
  },
};

export const actions = {
  connect({ state, commit, rootState, getters }) {
    if (state.connected) {
      return;
    }

    this.socket = new SockJS(state.websocketUrl);
    this.stompClient = Stomp.over(this.socket);

    // comment this if you want to see debug messages
    this.stompClient.debug = (message) => {};

    this.stompClient.connect(
      { Authorization: 'Bearer ' + this.$auth.user.token },
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
        this.stompClient.subscribe('/topic/rooms/roomClosed', (message) => {
          const roomId = parseInt(message.body);
          if (rootState.main.roomOwnerId === roomId) {
            getters.roomSubscription.unsubscribe();
            getters.gameTypeSetSubscription?.unsubscribe();
            getters.gameStartSubscription?.unsubscribe();
            commit('setRoomSubscription', null);
            commit('setGameTypeSetSubscription', null);
            commit('setGameStartSubscription', null);
            commit('main/setRoomOwnerId', null, { root: true });
            this.$router.push({ name: 'compete' });
            setTimeout(() => {
              this.$notifier.showMessage({
                content: this.app.i18n.t('app.snackbar.room_closed'),
                color: 'danger'
              });
            }, 750);
          }
          commit('main/deleteRoomFromList', roomId, { root: true });
        });

        this.stompClient.subscribe('/topic/rooms/updateRoom', (message) => {
          const response = JSON.parse(message.body);
          if (Array.isArray(response)) {
            const people = response;
            const ownerId = people.shift().id;
            commit('main/updateRoom', { roomId: ownerId, others: people }, { root: true });
          } else if (response.gameStarted !== null) {
            const { roomId, gameStarted } = response;
            commit('main/updateRoomState', { roomId, gameStarted }, { root: true });
          } else {
            commit('main/updateRoomFriendsOnly', response, { root: true });
          }
        });

        this.stompClient.subscribe('/user/topic/codeRunResponse', (message) => {
          const parsedMessage = JSON.parse(message.body);
          commit('main/setCodeRunResponse', parsedMessage, { root: true });
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

  sendFriendsOnlyUpdate({ commit }, message) {
    this.stompClient.send('/app/rooms/setFriendsOnly', message);
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

  subscribeToGameStarted({ commit }, roomId) {
    const subscription = this.stompClient.subscribe(`/topic/rooms/${roomId}/gameStarted`, (message) => {
      const room = JSON.parse(message.body);
      this.$notifier.showMessage({
        content: this.app.i18n.t('The game will start in a few seconds'),
        color: 'success'
      });
      setTimeout(() => {
        this.$router.push({ name: 'game' });
      }, 3000);
      commit('main/updateRoomFull', { roomId, updatedRoom: room }, { root: true });
    });
    commit('setGameStartSubscription', subscription);
  },

  unsubscribeToGameStarted({ commit, getters }) {
    getters.gameStartSubscription?.unsubscribe();
    commit('setGameStartSubscription', null);
  },

  subscribeToRoomGameTypeSet({ commit }, roomId) {
    const gameTypeSetSubscription = this.stompClient.subscribe(`/topic/rooms/${roomId}/gameTypeSet`, (message) => {
      const newGameType = message.body.substring(1, message.body.length - 1);
      commit('main/setRoomGameType', { roomId, newGameType }, { root: true });
    });
    commit('setGameTypeSetSubscription', gameTypeSetSubscription);
  },

  unsubscribeRoomGameTypeSet({ commit, getters }) {
    getters.gameTypeSetSubscription?.unsubscribe();
    commit('setGameTypeSetSubscription', null);
  },

  subscribeToGameEnd({ commit }, roomId) {
    const gameEndSubscription = this.stompClient.subscribe(`/topic/rooms/${roomId}/gameEnd`, (message) => {
      const finalOrderOfPeople = JSON.parse(message.body);
      commit('main/setFinalOrderOfPeopleInRoom', { roomId, peopleInOrder: finalOrderOfPeople }, { root: true });
      this.$router.push({ name: 'results' });
    });
    commit('setGameEndSubscription', gameEndSubscription);
  },

  // eslint-disable-next-line no-empty-pattern
  sendGameTypeSet({}, newGameType) {
    this.stompClient.send('/app/rooms/setGameType',
      newGameType,
    );
  },

  sendLeaveRoom({ commit, getters }, roomId) {
    this.stompClient.send(`/app/rooms/${roomId}/leaveRoom`, '{}');
    getters.roomSubscription.unsubscribe();
    getters.gameTypeSetSubscription.unsubscribe();
    getters.gameStartSubscription.unsubscribe();
    commit('setRoomSubscription', null);
    commit('setGameTypeSetSubscription', null);
    commit('setGameStartSubscription', null);
  },

  sendStartGame() {
    this.stompClient.send('/app/rooms/startGame', '{}');
  },

  sendExecuteCode({ getters }, { code, testIds, challengeId, roomId, submitted, language }) {
    const executeDto = { code, testIds, challengeId, language };
    this.stompClient.send(`/app/rooms/${roomId}/executeCode`,
      JSON.stringify({ ...executeDto, roomId, submitted })
    );
  },

  subscribeToUserUpdate({ commit }, roomId) {
    const subscription = this.stompClient.subscribe(`/topic/rooms/${roomId}/userUpdate`, (message) => {
      const updateDto = JSON.parse(message.body);
      commit('main/updateUserInRoom', { ...updateDto, roomId }, { root: true });
    });
    commit('setUserUpdateSubscription', subscription);
  },

  clearStateAfterGameEnded({ commit, getters, dispatch, rootState }) {
    getters.gameEndSubscription?.unsubscribe();
    commit('setGameEndSubscription', null);
    getters.userUpdateSubscription?.unsubscribe();
    commit('setUserUpdateSubscription', null);
    dispatch('main/setCodeRunResponseToNull', null, { root: true });
    commit('main/deleteRoomFromList', { roomId: rootState.main.roomOwnerId }, { root: true });
    commit('main/setRoomOwnerId', null, { root: true });
  },

  disconnect() {
    this.stompClient.disconnect(() => {});
  }
};
