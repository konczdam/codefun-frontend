<template>
  <div>
    <v-row justify="center">
      <v-col sm="6">
        <v-card>
          <v-card-title>
            {{ challenge.title }}
          </v-card-title>
          <v-card-text>
            {{ challenge.description }}
          </v-card-text>
          <v-card-title>
            Example
          </v-card-title>
          <v-row justify="space-around">
            <v-col sm="5">
              <v-card>
                <v-card-title>
                  Input
                </v-card-title>
                <v-card-text>
                  {{ challange.testCases[0].input }}
                </v-card-text>
              </v-card>
            </v-col>
            <v-col sm="5">
              <v-card>
                <v-card-title>
                  Output
                </v-card-title>
                <v-card-text>
                  {{ challange.testCases[0].expectedOutput }}
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col sm="6">
        <v-card>
          <v-form style="width: 50%" class="ml-4">
            <v-select
              v-model="selectedLanguage"
              :items="AVAILABLE_LANGUAGES"
            />
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { AVAILABLE_LANGUAGES } from '@/const';

export default {
  layout: 'navigation_drawer',
  data() {
    return {
      challange: {
        title: 'test title',
        description: 'salalalala',
        testCases: [
          {
            displayName: 'test case 1',
            input: '3 5',
            expectedOutput: '8',
          }
        ],
      },
      AVAILABLE_LANGUAGES,
      selectedLanguage: null,
    };
  },
  computed: {
    ...mapGetters({
      roomList: 'main/roomList',
      roomOwnerId: 'main/roomOwnerId',
    }),
    challenge() {
      return this.roomList.find(it => it.owner.id === this.roomOwnerId).challenge;
    }
  },
  mounted() {
    this.selectedLanguage = this.AVAILABLE_LANGUAGES[0];
  },
};
</script>

<style scoped>

</style>
