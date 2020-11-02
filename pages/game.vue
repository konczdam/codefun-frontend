<template>
  <div>
    <v-row justify="center">
      <v-col sm="6">
        <v-card>
          <v-card-title>
            {{ challange.title }}
          </v-card-title>
          <v-card-text>
            {{ challange.description }}
          </v-card-text>
          <v-card-title>
            sasadasd
          </v-card-title>
        </v-card>
      </v-col>
      <v-col sm="6">
        <v-card>

        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  auth: 'guest',
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
    };
  },
};
</script>

<style scoped>

</style>
