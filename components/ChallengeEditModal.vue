<template>
  <v-dialog
    v-model="open"
    max-width="700px"
    persistent
  >
    <template v-slot:activator="{ on, attrs }">
      <slot :on="on" :attrs="attrs" />
    </template>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-form
        ref="form"
        v-model="isFormValid"
        @submit.prevent="emitSaveEvent"
      >
        <v-card>
          <v-card-title>
            {{ challenge ? 'Edit challenge' : 'Add challenge' }}
          </v-card-title>
          <v-card-text>
            <v-row justify="start">
              <v-col sm="10">
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
              </v-col>
            </v-row>

            <v-card-subtitle class="pl-0 font-weight-bold">
              Tests
            </v-card-subtitle>
            <template v-for="n in challengeData.challengeTests.length">
              <v-sheet :key="n" elevation="3" class="mb-4 pt-2 pb-3">
                <v-row justify="end" class="mt-0 mr-1">
                  <v-icon
                    v-if="challengeData.challengeTests.length > 1"
                    @click="deleteTest(n - 1)"
                  >
                    mdi-delete
                  </v-icon>
                </v-row>
                <v-spacer />
                <v-row justify="start">
                  <v-col sm="10">
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
                        required
                        class="ml-5"
                      />
                    </validation-provider>
                  </v-col>
                </v-row>
              </v-sheet>
            </template>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="secondary"
              @click="addNewTestCase"
            >
              Add new test
            </v-btn>
            <v-spacer />
            <v-btn
              @click="open = false"
            >
              Cancel
            </v-btn>
            <v-btn
              type="submit"
              color="primary"
              :disabled="invalid || challengeData.challengeTests.length === 0"
            >
              save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </validation-observer>
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
        challengeTests: [{}],
      },
    };
  },
  methods: {
    emitSaveEvent() {
      this.$emit('save', this.challengeData);
      this.open = false;
    },
    addNewTestCase() {
      this.challengeData.challengeTests.push({});
    },
    deleteTest(idx) {
      this.challengeData.challengeTests.splice(idx, 1);
    },
    clear() {
      this.challengeData = {
        title: null,
        description: null,
        challengeTests: [{}],
      };
      this.$nextTick(() => {
        this.$refs.observer.reset();
      });
    },
  },
};
</script>
