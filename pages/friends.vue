<template>
  <v-card elevation="10">
    <v-tabs>
      <v-tab>
        Friends
      </v-tab>
      <v-tab>
        Incoming friend requests
      </v-tab>
      <v-tab>
        Outgoing friend requests
      </v-tab>
      <v-tab>
        Find friends
      </v-tab>
      <v-tab-item>
        a
      </v-tab-item>
      <v-tab-item>
        b
      </v-tab-item>
      <v-tab-item>
        c
      </v-tab-item>
      <v-tab-item>
        <people-table />
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import PeopleTable from '@/components/PeopleTable';

export default {
  components: {
    PeopleTable,
  },
};
</script>
