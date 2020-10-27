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
  connect({ state, commit }) {
    if (state.connected) {
      return;
    }

    this.socket = new SockJS(state.websocketUrl);
    this.stompClient = Stomp.over(this.socket);

    // comment this if you want to see debug messages
    // this.stompClient.debug = (message) => {};

    this.stompClient.connect(
      { },
      (frame) => {
        commit('setConnected', true);
        this.stompClient.subscribe('/app/rooms', (tick) => {
          const roomList = JSON.parse(tick.body);
          commit('main/initRoomList', roomList, { root: true });
        },
        {
          Authorization: 'Bearer ' + this.$auth.$storage.getUniversal('user').token
        });
        this.stompClient.subscribe('/topic/rooms/newRoom', (message) => {
          const newRoom = JSON.parse(message.body);
          commit('main/addRoom', newRoom, { root: true });
          if (newRoom.owner.id === this.$auth.$storage.getUniversal('user').id) {
            this.$router.push({ name: 'alma' });
          }
        },
        {
          Authorization: 'Bearer ' + this.$auth.$storage.getUniversal('user').token
        });

        this.stompClient.subscribe('/topic/rooms/updateRoom', (message) => {
          const people = JSON.parse(message.body);
          const ownerId = people.shift().id;
          commit('main/updateRoom', { roomId: ownerId, others: people }, { root: true });
        },
        {
          Authorization: 'Bearer ' + this.$auth.$storage.getUniversal('user').token
        }
        );
      }
    );
  },

  createRoom(context, description) {
    this.stompClient.send('/app/rooms/addRoom',
      JSON.stringify({
        ownerId: this.$auth.$storage.getUniversal('user').id,
        description,
      }),
      {
        Authorization: 'Bearer ' + this.$auth.$storage.getUniversal('user').token
      },
    );
  },

  joinRoom({ commit }, roomOwnerId) {
    this.stompClient.send('/app/rooms/joinRoom',
      roomOwnerId,
      {
        Authorization: 'Bearer ' + this.$auth.$storage.getUniversal('user').token
      },
    );
  },

  disconnect() {
    this.stompClient.disconnect(() => {}, {
      Authorization: 'Bearer ' + this.$auth.$storage.getUniversal('user').token
    });
  }
};
