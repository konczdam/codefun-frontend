<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="10" md="8" lg="6" xl="4">
      <h1 class="text-center">
        {{ $t('app.login.title') }}
      </h1>

      <ValidationObserver ref="observer">
        <v-form v-model="isFormValid" @submit.prevent="userLogin">
          <!--Email input-->
          <ValidationProvider
            v-slot="{errors}"
            :name="$t('app.login.form.email')"
            rules="required|email"
          >
            <v-text-field
              v-model="login.email"
              :error-messages="errors"
              required
              :label="$t('app.login.form.email')"
            />
          </ValidationProvider>

          <!--Password-->
          <ValidationProvider
            v-slot="{errors}"
            :name="$t('app.login.form.password')"
            rules="required"
          >
            <v-text-field
              v-model="login.password"
              :error-messages="errors"
              :append-icon="showPw ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPw ? 'text' : 'password'"
              required
              :label="$t('app.login.form.password')"
              @click:append="showPw = !showPw"
            />
          </ValidationProvider>

          <v-btn
            class="mt-8"
            block
            type="submit"
          >
            {{ $t('app.login.form.button_title') }}
          </v-btn>
        </v-form>
      </ValidationObserver>
    </v-col>
  </v-row>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes';

export default {
  auth: 'guest',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data () {
    return {
      isFormValid: false,
      showPw: false,
      login: {
        email: '',
        password: ''
      }
    };
  },
  methods: {
    async userLogin () {
      if (this.isFormValid === true) {
        try {
          this.$nuxt.$loading.start();
          const response = await this.$auth.loginWith('local', { data: this.login });
          this.$nuxt.$loading.finish();
          if (response.status === StatusCodes.OK) {
            this.$notifier.showMessage({ content: 'sikerült belépni', color: 'success' });
            this.$auth.setUser(response.data);
          } else {
            this.$notifier.showMessage({ content: 'nem sikerült belépni: ' + getReasonPhrase(response.status), color: 'error' });
          }
        } catch (err) {
          this.$notifier.showMessage({ content: 'unexpected error!', color: 'error' });
        }
      }
    }
  },
};
</script>

<style scoped>

</style>
