<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="10" md="8" lg="6" xl="4">
      <h1 class="text-center">
        {{ $t('app.registration.title') }}
      </h1>

      <ValidationObserver ref="observer">
        <v-form v-model="isFormValid">
          <!--Email input-->
          <ValidationProvider
            v-slot="{errors}"
            :name="$t('app.registration.form.email')"
            rules="required|email|max:50"
          >
            <v-text-field
              v-model="registration.email"
              :error-messages="errors"
              required
              :label="$t('app.registration.form.email')"
            />
          </ValidationProvider>

          <!--Password-->
          <ValidationProvider
            v-slot="{errors}"
            :name="$t('app.registration.form.password')"
            rules="required|password:@confirm|min:6|max:50"
          >
            <v-text-field
              v-model="registration.password"
              :error-messages="errors"
              :append-icon="showPw ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPw ? 'text' : 'password'"
              :hint="$t('app.registration.form.password_hint')"
              required
              :label="$t('app.registration.form.password')"
              @click:append="showPw = !showPw"
            />
          </ValidationProvider>

          <!--Confirm password-->
          <ValidationProvider
            v-slot="{errors}"
            :name="$t('app.registration.form.confirm_password')"
            vid="confirm"
            rules="required"
          >
            <v-text-field
              v-model="registration.confirmPassword"
              :error-messages="errors"
              :append-icon="showPwC ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPwC ? 'text' : 'password'"
              required
              :label="$t('app.registration.form.confirm_password')"
              @click:append="showPwC = !showPwC"
            />
          </ValidationProvider>

          <!--UserName-->
          <ValidationProvider
            v-slot="{errors}"
            :name="$t('app.registration.form.username')"
            rules="required|min:3"
          >
            <v-text-field
              v-model="registration.username"
              :error-messages="errors"
              :hint="$t('app.registration.form.username_hint')"
              required
              :label="$t('app.registration.form.username')"
              type="text"
            />
          </ValidationProvider>

          <!--PreferredLanguages-->
          <ValidationProvider
            v-slot="{errors}"
            :name="$t('app.registration.form.preferred_languages')"
            rules="required"
          >
            <v-select
              v-model="registration.preferredLanguages"
              :items="AVAILABLE_LANGUAGES"
              :error-messages="errors"
              :hint="$t('app.registration.form.preferred_languages_hint')"
              required
              :label="$t('app.registration.form.preferred_languages')"
              multiple
              persistent-hint
            />
          </ValidationProvider>

          <v-btn
            class="mt-8"
            block
            @click="userRegister"
          >
            {{ $t('app.registration.form.button_title') }}
          </v-btn>
        </v-form>
      </ValidationObserver>
    </v-col>
  </v-row>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { AVAILABLE_LANGUAGES } from '@/const';
import { StatusCodes } from 'http-status-codes';

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
      showPwC: false,
      registration: {
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        preferredLanguages: [],
      },
      AVAILABLE_LANGUAGES,
    };
  },
  methods: {
    async userRegister () {
      await this.$refs.observer.validate();

      if (this.isFormValid === true) {
        try {
          const registrationData = {
            ...this.registration,
            roles: ['user'],
          };
          const response = await this.$axios.post('/auth/register', registrationData);

          // There is an error
          const { status } = response.data;
          if (status === StatusCodes.BAD_REQUEST) {
            this.$notifier.showMessage({
              content: this.$t('app.snackbar.unexpected'),
              color: 'error'
            });
          } else {
            this.$notifier.showMessage({
              content: this.$t('app.snackbar.successful_registration'),
              color: 'success'
            });

            const loginResponse = await this.$auth.loginWith('local', { data: this.registration });
            this.$auth.setUser(loginResponse.data);

            this.$router.push({ name: 'alma' });
          }
        } catch (err) {
          this.$notifier.showMessage({
            content: this.$t('app.snackbar.unexpected'),
            color: 'error'
          });
        }
      }
    },
  },
};
</script>
