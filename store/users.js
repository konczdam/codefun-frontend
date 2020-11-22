import { StatusCodes } from 'http-status-codes';

export const state = () => ({
  userData: {},
});

export const getters = {
  userData: state => state.userData,
};

export const mutations = {
  setUserData(state, newUserData) {
    state.userData = newUserData;
  },
};

export const actions = {
  async getUserDataFromServer({ commit }) {
    const id = this.$auth.user.id;
    const response = await this.$axios.get(`/users/${id}`);
    if (response.status === StatusCodes.OK) {
      commit('setUserData', response.data);
    } else {
      this.$notifier.showMessage({
        content: 'Failed to fetch user data from server!',
        color: 'error',
      });
    }
  },
  async changePassword({ commit }, passwordChangeData) {
    try {
      const response = await this.$axios.post('/users/changePassword', passwordChangeData);
      if (response.status === StatusCodes.OK) {
        this.$notifier.showMessage({
          content: 'Password successfully changed',
          color: 'success',
        });
        return true;
      } else {
        this.$notifier.showMessage({
          content: response.status,
          color: 'error',
        });
      }
    } catch (e) {
      this.$notifier.showMessage({
        content: 'The provided current password is incorrect.',
        color: 'error',
      });
    }
    return false;
  }
};
