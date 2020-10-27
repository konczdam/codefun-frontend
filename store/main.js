export const state = () => ({
  roomList: [],
  usersInRoom: [],
});

export const getters = {
  roomList: state => state.roomList,
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
  }
};
