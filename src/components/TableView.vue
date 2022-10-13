<template>
  <div class="table-container">
    <h2>TABLE</h2>
    <div class="table" v-if="tableResults.length">
      <div class="header">
        <div class="table-item">
          <p>{{ "Team name" }}</p>
          <p style="padding-left: 25em">{{ "Goals" }}</p>
          <p style="padding-left: 12em">{{ "Points" }}</p>
        </div>
      </div>
      <div
        v-for="element in tableResults"
        :key="element.clubId"
        class="table-row"
      >
        <div class="table-item" :key="element.clubId">
          <p>{{ element.clubName }}</p>
          <p style="padding-left: 25em">{{ element.goals }}</p>
          <p style="padding-left: 12em">{{ element.points }}</p>
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
          goals: 0,
        });
      }

      for (const key in globalData.resultsData) {
        let firstTeamGoals = globalData.resultsData[key].firstTeamScore;
        let secondTeamGoals = globalData.resultsData[key].secondTeamScore;
        let firstTeamId = globalData.resultsData[key].firstTeamId;
        let secondTeamId = globalData.resultsData[key].secondTeamId;

        if (firstTeamGoals > secondTeamGoals) {
          //points
          tableResults.value[firstTeamId - 1].points += 3;

          //goals
          tableResults.value[firstTeamId - 1].goals += firstTeamGoals;
          tableResults.value[secondTeamId - 1].goals += secondTeamGoals;
        } else if (firstTeamGoals < secondTeamGoals) {
          //points
          tableResults.value[secondTeamId - 1].points += 3;

          //goals
          tableResults.value[firstTeamId - 1].goals += firstTeamGoals;
          tableResults.value[secondTeamId - 1].goals += secondTeamGoals;
        } else {
          //points
          tableResults.value[firstTeamId - 1].points += 1;
          tableResults.value[secondTeamId - 1].points += 1;

          //goals
          tableResults.value[firstTeamId - 1].goals += firstTeamGoals;
          tableResults.value[secondTeamId - 1].goals += secondTeamGoals;
        }
      }

      tableResults.value.sort((p1: any, p2: any) =>
        p1.points < p2.points
          ? 1
          : p1.points > p2.points
          ? -1
          : p1.goals < p2.goals
          ? 1
          : p1.goals > p2.goals
          ? -1
          : 0
      );
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

.table-row,
.header {
  padding: 1em;
  margin: 1em;
  width: 52em;
  display: flex;
  justify-content: start;
  border-bottom: 3px #3e5a77 solid;
}

.table-item {
  width: 50em;
  display: flex;
  justify-content: center;
}

.table-item > p {
  width: 15em;
  display: flex;
  justify-content: start;
}
</style>