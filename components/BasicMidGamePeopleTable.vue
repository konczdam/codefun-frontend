<template>
  <v-data-table
    :key="JSON.stringify(players)"
    hide-default-header
    hide-default-footer
    class="elevation-10"
    :items="players"
    :headers="peopleTableHeaders"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>
          Results
        </v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        />
      </v-toolbar>
    </template>

    <template #item.idx="{item}">
      {{ players.indexOf(item) + 1 }}
    </template>
    <template #item.name="{item}">
      {{ item.username }}
    </template>
    <template #item.status="{item}">
      {{ item.status || 'coding...' }}
    </template>

    <template v-if="showRemainingTime" v-slot:footer>
      <timer class="ml-3">
        <template v-slot:default="slotProps">
          Remaining time: {{ slotProps.min }}:{{ slotProps.sec }}
        </template>
      </timer>
    </template>
  </v-data-table>
</template>

<script>
import Timer from '@/components/Timer';

export default {
  components: {
    Timer,
  },
  props: {
    players: {
      type: Array,
      required: true,
      default: () => [],
    },
    showRemainingTime: {
      type: Boolean,
      required: false,
      default: false,
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
