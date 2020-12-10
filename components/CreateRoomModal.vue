<template>
  <v-dialog
    v-model="open"
    persistent
    max-width="680px"
    class="elevation-35"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot :on="on" :attrs="attrs" />
    </template>

    <ValidationObserver ref="observer" v-slot="{ invalid }">
      <v-card>
        <v-card-title>
          <span class="headline">
            {{ $t('app.compete.create_room_modal.title') }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="12"
              >
                <ValidationProvider
                  v-slot="{errors}"
                  :name="$t('app.compete.create_room_modal.form.description')"
                  rules="max:40"
                >
                  <v-text-field
                    v-model="description"
                    :label="$t('app.compete.create_room_modal.form.description')"
                    :hint="$t('app.compete.create_room_modal.form.description_hint')"
                    :error-messages="errors"
                    type="text"
                  />
                </ValidationProvider>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="warning"
            @click="open = false"
          >
            {{ $t('general.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :disabled="invalid"
            @click="sendCreateRoomEvent"
          >
            {{ $t('app.compete.create_room_modal.title') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </ValidationObserver>
  </v-dialog>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      open: false,
      description: '',
    };
  },
  methods: {
    sendCreateRoomEvent() {
      this.$emit('create-room', this.description);
    }
  },
};
</script>
