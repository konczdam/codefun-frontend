import { getReasonPhrase, StatusCodes } from 'http-status-codes';

export const actions = {
  async login({ commit }, loginData) {
    try {
      const response = await this.$auth.loginWith('local', { data: loginData });
      if (response.status === StatusCodes.OK) {
        this.$notifier.showMessage({ content: this.app.i18n.t('app.snackbar.successful_login'), color: 'success' });
        this.$auth.setUser(response.data);
        this.$auth.$storage.setUniversal('user', response.data, true);
        this.$router.push({ name: 'compete' });
      } else {
        this.$notifier.showMessage({ content: this.app.i18n.t('app.snackbar.unsuccessful_login') + getReasonPhrase(response.status), color: 'error' });
      }
    } catch (err) {
      this.$notifier.showMessage({ content: this.app.i18n.t('app.snackbar.unexpected'), color: 'error' });
    }
  },

  loginWithLocalData({ commit }, user) {
    this.$auth.setUser(user);
    this.$router.push({ name: 'compete' });
  }
};
