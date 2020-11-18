export const state = () => ({
  endDate: null,
});

export const getters = {
  endDate: state => state.endDate,
};

export const mutations = {
  setEndDate(state, newEndDate) {
    state.endDate = newEndDate;
  },
};

export const actions = {
  setEndDate({ commit }, newEndDate) {
    commit('setEndDate', newEndDate);
  },
};
