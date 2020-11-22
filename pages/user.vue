<template>
  <v-row justify="center">
    <v-col sm="6">
      <v-card elevation="10">
        <v-card-title>
          Profile
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="userData.username"
            label="Username"
            readonly
          />
          <v-text-field
            v-model="userData.email"
            label="Email"
            readonly
          />
          <v-text-field
            v-model="userData.gamesPlayed"
            label="Games Played"
            readonly
          />
          <v-text-field
            v-model="userData.gamesWon"
            label="Games Won"
            readonly
          />
        </v-card-text>
        <v-card-actions>
          <change-password-modal>
            <template v-slot:default="{ on, attrs }">
              <v-btn
                color="secondary"
                dark
                v-bind="attrs"
                v-on="on"
              >
                Change password
              </v-btn>
            </template>
          </change-password-modal>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ChangePasswordModal from '@/components/ChangePasswordModal';

export default {
  components: {
    ChangePasswordModal,
  },
  computed: {
    ...mapGetters({
      userData: 'users/userData',
    }),
  },
  async created() {
    await this.getUserDataFromServer();
  },
  methods: {
    ...mapActions({
      getUserDataFromServer: 'users/getUserDataFromServer',
    }),
  },
};
</script>
