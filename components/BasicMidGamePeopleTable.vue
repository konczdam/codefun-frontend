<template>
  <v-data-table
    :key="JSON.stringify(players)"
    hide-default-header
    hide-default-footer
    :items="players"
    :headers="peopleTableHeaders"
  >
    <template #item.idx="{item}">
      {{ players.indexOf(item) + 1 }}
    </template>
    <template #item.name="{item}">
      {{ item.username }}
    </template>
    <template #item.status="{item}">
      {{ item.status || 'coding...' }}
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    players: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      peopleTableHeaders: [
        {
          value: 'idx',
          fixed: true,
          width: '30px',
        },
        {
          value: 'name',
        },
        {
          value: 'status',
          align: 'right',
          width: '350px',
        },
      ],
    };
  },
  created() {
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'main/updateUserInRoom') {
        this.$forceUpdate();
      }
    });
  },
};
</script>
