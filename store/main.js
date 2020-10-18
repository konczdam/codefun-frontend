export const state = () => ({
  roomList: [],
});

export const getters = {
  roomList: state => state.roomList,
};

export const mutations = {
  initRoomList(state, roomList) {
    state.roomList = roomList;
  },
  addRoom(stete, room) {
    state.roomList.push(room);
  }
};
