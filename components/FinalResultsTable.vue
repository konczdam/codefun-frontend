<template>
  <v-data-table
    :key="JSON.stringify(players)"
    hide-default-footer
    class="elevation-10"
    :items="players"
    :headers="peopleTableHeaders"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>
          {{ $t('app.results.title') }}
        </v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        />
      </v-toolbar>
    </template>
    <template #item.idx="{item}">
      {{ players.indexOf(item) + 1 }}.
    </template>
    <template #item.name="{item}">
      {{ item.username }}
    </template>
    <template #item.language="{item}">
      {{ item.language }}
    </template>
    <template #item.timeTaken="{item}">
      {{ item.timeTaken / 1000 }} s
    </template>
    <template #item.runtime="{item}">
      {{ item.runTime }} ms
    </template>
    <template #item.codeLength="{item}">
      {{ item.finalCodeLength }}
    </template>
    <template #item.successRate="{item}">
      {{ truncToFourDecimals(item.successRate)*100 }} %
    </template>
    <template #item.actions="{item}">
      <code-modal
        :language="item.language"
        :code="item.code"
      />
    </template>
  </v-data-table>
</template>

<script>
import CodeModal from '@/components/CodeModal';
import { isNaN } from 'lodash';

export default {
  components: {
    CodeModal,
  },
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
          text: '',
          fixed: true,
          width: '30px',
        },
        {
          value: 'name',
          text: this.$t('app.results.final_results_table.headers.name'),
        },
        {
          value: 'language',
          text: this.$t('app.results.final_results_table.headers.language'),
        },
        {
          value: 'timeTaken',
          text: this.$t('app.results.final_results_table.headers.time_taken'),
        },
        {
          value: 'runtime',
          text: this.$t('app.results.final_results_table.headers.runtime'),
        },
        {
          value: 'codeLength',
          text: this.$t('app.results.final_results_table.headers.code_length'),
        },
        {
          value: 'successRate',
          text: this.$t('app.results.final_results_table.headers.success_rate'),
        },
        {
          value: 'actions',
          text: this.$t('general.actions'),
        }
      ],
    };
  },
  methods: {
    truncToFourDecimals(num) {
      if (isNaN(num)) {
        return 0;
      }
      return num.toFixed(4);
    }
  },
};
</script>
