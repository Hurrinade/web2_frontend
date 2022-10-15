<template>
  <div class="fixtures-container">
    <h2>FIXTURES</h2>
    <div class="table" v-if="results.length">
      <div
        v-for="element in results"
        :key="element.fixtureId"
        class="table-row"
      >
        <div class="table-item" :key="element.fixtureId">
          <p>{{ element.firstTeamName }}</p>
          <p>-</p>
          <p>{{ element.secondTeamName }}</p>
          <p>{{ element.fixtureDate }}</p>
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
    const results: any = ref([]);

    watch(
      () => globals,
      (val) => {
        results.value = [];
        getTeamsById(val);
      },
      { deep: true }
    );

    const getTeamsById = (globalData: any) => {
      for (const key in globalData.fixturesData) {
        results.value.push({
          clubId: globalData.fixturesData[key].fixtureId,
          firstTeamName:
            globalData.tableData[globalData.fixturesData[key].firstTeamId - 1]
              .clubName,
          secondTeamName:
            globalData.tableData[globalData.fixturesData[key].secondTeamId - 1]
              .clubName,
          fixtureDate: globalData.fixturesData[key].fixtureDate,
        });
      }
    };

    getTeamsById(globals);
    return { results };
  },
});
</script>

<style scoped>
.fixtures-container {
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
  justify-content: center;
  border-bottom: 3px #3e5a77 solid;
}

.table-item {
  width: 50em;
  display: flex;
  justify-content: space-evenly;
}
.table-item > p {
  width: 10em;
  display: flex;
  justify-content: space-around;
}

p:last-child {
  color: gray;
}
</style>