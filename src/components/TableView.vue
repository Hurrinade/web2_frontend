<template>
  <div class="table-container">
    <h2>TABLE</h2>
    <div class="table" v-if="tableResults.length">
      <div
        v-for="element in tableResults"
        :key="element.clubId"
        class="table-row"
      >
        <div class="table-item" :key="element.clubId">
          <p>{{ element.clubName }}</p>
          <p>{{ element.points }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useGlobalsStore } from "../stores/globals";
export default defineComponent({
  setup() {
    const globals = useGlobalsStore();
    const tableResults: any = ref([]);

    watch(
      () => globals,
      (val) => {
        calculateScore(val);
      },
      { deep: true }
    );

    const calculateScore = (globalData: any) => {
      for (const key in globalData.tableData) {
        tableResults.value.push({
          clubId: globalData.tableData[key].clubId,
          clubName: globalData.tableData[key].clubName,
          points: 0,
        });
      }

      //   for (const key in results) {
      //     console.log(results[key].firstTeamId);
      //     if (results[key].firstTeamScore > results[key].secondTeamScore) {
      //       tableResults.value[results[key].firstTeamId - 1].points += 3;
      //     } else if (results[key].firstTeamScore < results[key].secondTeamScore) {
      //       tableResults.value[results[key].secondTeamId - 1].points += 3;
      //     } else {
      //       tableResults.value[results[key].firstTeamId - 1].points += 1;
      //       tableResults.value[results[key].secondTeamId - 1].points += 1;
      //     }
      //   }

      for (const key in globalData.resultsData) {
        if (
          globalData.resultsData[key].firstTeamScore >
          globalData.resultsData[key].secondTeamScore
        ) {
          tableResults.value[
            globalData.resultsData[key].firstTeamId - 1
          ].points += 3;
        } else if (
          globalData.resultsData[key].firstTeamScore <
          globalData.resultsData[key].secondTeamScore
        ) {
          tableResults.value[
            globalData.resultsData[key].secondTeamId - 1
          ].points += 3;
        } else {
          tableResults.value[
            globalData.resultsData[key].firstTeamId - 1
          ].points += 1;
          tableResults.value[
            globalData.resultsData[key].secondTeamId - 1
          ].points += 1;
        }
      }
    };

    calculateScore(globals);

    return { tableResults };
  },
});
</script>

<style scoped>
.table-container {
  margin-top: 2em;
}

.table {
  margin: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.table-row {
  padding: 1em;
  margin: 1em;
  width: 50em;
  display: flex;
  justify-content: start;
  border-bottom: 3px #3e5a77 solid;
}

.table-item {
  width: 49em;
  display: flex;
  justify-content: space-between;
}
</style>