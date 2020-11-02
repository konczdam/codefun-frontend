export const state = () => ({
  roomList: [],
  usersInRoom: [],
  roomOwnerId: null,
  language: 'en',
});

export const getters = {
  getLanguage: state => state.language,
  roomList: state => state.roomList,
  roomOwnerId: state => state.roomOwnerId,
};

export const mutations = {
  initRoomList(state, roomList) {
    state.roomList = roomList;
  },
  addRoom(state, room) {
    state.roomList.push(room);
  },
  updateRoom(state, { roomId, others }) {
    state.roomList.find(it => it.owner.id === roomId).others = others;
  },
  setRoomOwnerId(state, roomOwnerId) {
    state.roomOwnerId = roomOwnerId;
  },
  addRoomMessage(state, { roomId, message }) {
    const room = state.roomList.find(it => it.owner.id === roomId);
    if (!room.messages) {
      room.messages = [];
    }
    room.messages.push(message);
  },
  deleteRoomFromList(state, { roomId }) {
    const roomIdx = state.roomList.indexOf(it => it.owner.id === roomId);
    state.roomList.splice(roomIdx, 1);
  },
  setRoomGameType(state, { roomId, newGameType }) {
    const room = state.roomList.find(it => it.owner.id === roomId);
    room.gameType = newGameType;
  },
};
