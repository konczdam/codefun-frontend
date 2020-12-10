<template>
  <v-dialog
    v-model="open"
    max-width="680px"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot :on="on" :attrs="attrs" />
    </template>

    <v-card>
      <v-card-title>
        {{ $t('app.profile.password_change_modal.title') }}
      </v-card-title>

      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-card-text>
          <validation-provider
            v-slot="{ errors }"
            :name="$t('app.profile.password_change_modal.form.old_password')"
            rules="required"
            vid="oldPw"
          >
            <v-text-field
              v-model="changePasswordData.oldPassword"
              :error-messages="errors"
              :append-icon="showOldPw ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showOldPw ? 'text' : 'password'"
              :hint="$t('app.profile.password_change_modal.form.old_password_hint')"
              :label="$t('app.profile.password_change_modal.form.old_password')"
              required
              @click:append="showOldPw = !showOldPw"
            />
          </validation-provider>
          <ValidationProvider
            v-slot="{errors}"
            :name="$t('app.profile.password_change_modal.form.new_password')"
            rules="required|password:@confirm|min:6|max:50|newPassword:@oldPw"
          >
            <v-text-field
              v-model="changePasswordData.newPassword"
              :error-messages="errors"
              :append-icon="showPw ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPw ? 'text' : 'password'"
              :hint="$t('app.registration.form.password_hint')"
              required
              :label="$t('app.profile.password_change_modal.form.new_password')"
              @click:append="showPw = !showPw"
            />
          </ValidationProvider>
          <ValidationProvider
            v-slot="{errors}"
            :name="$t('app.registration.form.confirm_password')"
            vid="confirm"
            rules="required"
          >
            <v-text-field
              v-model="changePasswordData.confirmPassword"
              :error-messages="errors"
              :append-icon="showPwC ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPwC ? 'text' : 'password'"
              required
              :label="$t('app.registration.form.confirm_password')"
              @click:append="showPwC = !showPwC"
            />
          </ValidationProvider>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn class="elevation-10" @click="open = false">
            {{ $t('general.cancel') }}
          </v-btn>
          <v-btn :disabled="invalid" color="secondary" @click="sendChangePassword">
            {{ $t('app.profile.change_password') }}
          </v-btn>
        </v-card-actions>
      </validation-observer>
    </v-card>
  </v-dialog>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { mapActions } from 'vuex';

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      open: false,
      showOldPw: false,
      showPw: false,
      showPwC: false,
      changePasswordData: {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      },
    };
  },
  methods: {
    ...mapActions({
      changePasswordAction: 'users/changePassword',
    }),
    async sendChangePassword() {
      const success = await this.changePasswordAction({
        oldPassword: this.changePasswordData.oldPassword,
        newPassword: this.changePasswordData.newPassword,
      });
      if (success) {
        this.open = false;
        this.changePasswordData = {};
        this.$refs.observer.reset();
      }
    }
  },
};
</script>
