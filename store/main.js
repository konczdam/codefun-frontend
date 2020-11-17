export const state = () => ({
  roomList: [],
  roomOwnerId: null,
  language: 'en',
  codeRunResponse: null,
});

export const getters = {
  getLanguage: state => state.language,
  roomList: state => state.roomList,
  roomOwnerId: state => state.roomOwnerId,
  codeRunResponse: state => state.codeRunResponse,
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
  updateRoomState(state, { roomId, gameStarted }) {
    state.roomList.find(it => it.owner.id === roomId).gameStarted = gameStarted;
  },
  updateRoomFull(state, { updatedRoom, roomId }) {
    const roomIdx = state.roomList.indexOf(it => it.owner.id === roomId);
    state.roomList.splice(roomIdx, 1, updatedRoom);
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
  setCodeRunResponse(state, newResponse) {
    state.codeRunResponse = newResponse;
  },
  updateUserInRoom(state, { roomId, userId, status, submitted, successRate }) {
    const room = state.roomList.find(it => it.owner.id === roomId);
    const isUpdatingOwner = roomId === userId;
    const userToUpdate = isUpdatingOwner ? room.owner : room.others.find(user => user.id === userId);
    userToUpdate.status = status;
    userToUpdate.submitted = submitted;
    userToUpdate.successrate = successRate;
  },
};

export const actions = {
  setCodeRunResponseToNull({ commit }) {
    commit('setCodeRunResponse', null);
  },
};
