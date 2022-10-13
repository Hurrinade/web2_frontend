<template>
  <div class="master-container">
    <h2>RESULTS</h2>
    <div class="results-container">
      <div class="table" v-if="results.length">
        <div
          v-for="element in results"
          :key="element.resultId"
          class="table-row"
        >
          <div class="table-item" :key="element.resultId">
            <p>{{ element.firstTeamName }}</p>
            <p>{{ element.firstTeamGoals }}</p>
            <p>-</p>
            <p>{{ element.secondTeamGoals }}</p>
            <p>{{ element.secondTeamName }}</p>
            <button
              class="comments-button"
              :class="{
                selected: isComments && element.resultId == selectedResultId,
              }"
              @click="toggleComments(element.resultId)"
            >
              Comments
            </button>
          </div>
        </div>
      </div>
      <Comments :resultid="selectedResultId" v-if="isComments" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useGlobalsStore } from "../stores/globals";
import Comments from "./Comments.vue";

export default defineComponent({
  components: {
    Comments,
  },
  setup() {
    const globals = useGlobalsStore();
    const results: any = ref([]);
    const selectedResultId: any = ref(null);
    const isComments: any = ref(false);

    const getTeamsById = (globalData: any) => {
      for (const key in globalData.resultsData) {
        results.value.push({
          resultId: globalData.resultsData[key].resultId,
          firstTeamName:
            globalData.tableData[globalData.resultsData[key].firstTeamId - 1]
              .clubName,
          secondTeamName:
            globalData.tableData[globalData.resultsData[key].secondTeamId - 1]
              .clubName,
          firstTeamGoals: globalData.resultsData[key].firstTeamScore,
          secondTeamGoals: globalData.resultsData[key].secondTeamScore,
        });
      }
    };

    const toggleComments = (resultId: any) => {
      if (
        selectedResultId.value == null ||
        selectedResultId.value != resultId
      ) {
        isComments.value = true;
        selectedResultId.value = resultId;
      } else if (selectedResultId.value == resultId) {
        isComments.value = false;
        selectedResultId.value = null;
      }
    };

    getTeamsById(globals);
    return { results, toggleComments, isComments, selectedResultId };
  },
});
</script>

<style scoped>
.master-container {
  margin-top: 2em;
}

.results-container {
  box-sizing: content-box;
  display: flex;
  justify-content: start;
  align-items: start;
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

.comments-button {
  border-radius: 1em;
  margin-left: 5em;
  color: white;
  height: 2em;
  width: 7em;
  background-color: #3e5a77;
  border: none;
}

.selected {
  background-color: #78a1cd;
}

.comments-button:hover {
  cursor: pointer;
  background-color: #54769b;
}
</style>