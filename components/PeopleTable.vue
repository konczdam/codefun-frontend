<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card-title>
          {{ title }}
          <v-spacer />
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search By User name"
            single-line
            hide-details
            @keyup.enter="searchByName"
          />
        </v-card-title>
        <v-data-table
          :headers="headers"
          :loading="loading"
          :items="otherUsers"
          :options.sync="optionz"
          :server-items-length="serverItemsLength"
        >
          <template #item.actions="{item}">
            <slot name="actions" :user="item" />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      search: '',
      headers: [
        {
          value: 'username',
          text: 'User name'
        },
        {
          value: 'gamesPlayed',
          text: 'Games played',
        },
        {
          value: 'gamesWon',
          text: 'Games won'
        },
        {
          value: 'actions',
          text: 'Actions',
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      options: 'users/options',
      serverItemsLength: 'users/serverItemsLength',
      otherUsers: 'users/otherUsers'
    }),
    optionz: {
      get() {
        return this.options;
      },
      set(opt) {
        this.updateOptions(opt);
        this.loading = true;
        this.emit('get-data').then(() => { this.loading = false; });
      }
    },
  },
  async created() {
    await this.emit('get-data');
    this.loading = false;
  },
  methods: {
    ...mapActions({
      updateOptions: 'users/updateOptions',
      setSearchString: 'users/setSearchString',
    }),
    async searchByName() {
      this.loading = true;
      await this.setSearchString(this.search);
      await this.emit('get-data');
      this.loading = false;
    },
    emit(eventName, value) {
      return new Promise((resolve, reject) => {
        this.$emit(eventName, value);
        this.$nextTick(resolve);
      });
    },
  },
};
</script>
