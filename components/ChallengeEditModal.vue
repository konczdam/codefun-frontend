<template>
  <v-dialog
    v-model="open"
    max-width="700px"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot :on="on" :attrs="attrs" />
    </template>
    <v-card>
      <v-card-title>
        {{ challenge ? 'Edit challenge' : 'Add challenge' }}
      </v-card-title>
      <v-card-text>
        <validation-observer ref="observer">
          <v-form
            v-model="isFormValid"
            @submit.prevent="emitSaveEvent"
          >
            <validation-provider
              v-slot="{ errors }"
              name="Title"
              rules="required"
            >
              <v-text-field
                v-model="challengeData.title"
                :error-messages="errors"
                required
                label="Title"
              />
            </validation-provider>

            <validation-provider
              v-slot="{ errors }"
              name="Description"
              rules="required"
            >
              <v-textarea
                v-model="challengeData.description"
                :error-messages="errors"
                label="Description"
                auto-grow
                clearable
                rows="3"
              />
            </validation-provider>
            <v-card-subtitle class="pl-0 font-weight-bold">
              Tests
            </v-card-subtitle>
            <template v-for="n in challengeData.challengeTests.length">
              <v-sheet :key="n" elevation="3" class="mb-4 pt-5 pb-3">
                <validation-provider
                  v-slot="{ errors }"
                  name="Display Name"
                  rules="required"
                >
                  <v-text-field
                    v-model="challengeData.challengeTests[n - 1].displayName"
                    :error-messages="errors"
                    label="Display name"
                    class="ml-5"
                  />
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  name="Input"
                  rules="required"
                >
                  <v-text-field
                    v-model="challengeData.challengeTests[n - 1].input"
                    :error-messages="errors"
                    label="Input"
                    class="ml-5"
                  />
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  name="Expected output"
                  rules="required"
                >
                  <v-text-field
                    v-model="challengeData.challengeTests[n - 1].expectedOutput"
                    :error-messages="errors"
                    label="Expected output"
                    class="ml-5"
                  />
                </validation-provider>
              </v-sheet>
            </template>
            <v-btn
              @click="addNewTestCase"
            >
              Add new test
            </v-btn>
          </v-form>
        </validation-observer>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    challenge: {
      required: false,
      default: null,
      type: Object,
    }
  },
  data() {
    return {
      open: false,
      isFormValid: false,
      challengeData: {
        title: null,
        description: null,
        challengeTests: [],
      }
    };
  },
  methods: {
    emitSaveEvent() {
      this.$emit('save', this.challengeData);
    },
    addNewTestCase() {
      this.challengeData.challengeTests.push({});
    },
  },
};
</script>
