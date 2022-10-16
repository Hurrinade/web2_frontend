<template>
  <div class="master-container">
    <div class="header">
      <h2>RESULTS</h2>
      <button
        v-if="isAuthenticated && globals.userRole === 'ADMIN'"
        @click="addResult"
      >
        Add result
      </button>
    </div>
    <div class="body-container">
      <div class="results-container">
        <div class="table" v-if="results.length">
          <div
            v-for="element in results"
            :key="element.resultId"
            class="table-row"
          >
            <div class="table-item">
              <p>{{ element.firstTeamName }}</p>
              <p>{{ element.firstTeamGoals }}</p>
              <p>-</p>
              <p>{{ element.secondTeamGoals }}</p>
              <p>{{ element.secondTeamName }}</p>
              <button
                v-if="isAuthenticated && globals.userRole === 'ADMIN'"
                class="comments-button"
                @click="editResult(element)"
              >
                Edit result
              </button>
              <button
                v-if="isAuthenticated"
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
      </div>
      <Comments
        v-if="
          isComments &&
          !isEditResult &&
          !isAddResult &&
          isAuthenticated &&
          globals.userRole != ''
        "
        :resultid="selectedResultId"
      />
      <EditResult
        v-if="
          isEditResult &&
          !isAddResult &&
          isAuthenticated &&
          globals.userRole === 'ADMIN'
        "
        :result="resultToEdit"
        @closeedit="isEditResult = false"
      />
      <AddResult
        v-if="
          isAddResult &&
          !isEditResult &&
          isAuthenticated &&
          globals.userRole === 'ADMIN'
        "
        @closeadd="isAddResult = false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useGlobalsStore } from "../stores/globals";
import { useAuth0 } from "@auth0/auth0-vue";
import Comments from "./Comments.vue";
import EditResult from "./EditResult.vue";
import AddResult from "./AddResult.vue";

export default defineComponent({
  components: {
    Comments,
    EditResult,
    AddResult,
  },
  setup() {
    const { error, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const globals = useGlobalsStore();
    const results: any = ref([]);
    const selectedResultId: any = ref(null);
    const isComments: any = ref(false);
    const isEditResult: any = ref(false);
    const isAddResult: any = ref(false);
    const resultToEdit: any = ref(null);

    watch(
      () => globals,
      (val) => {
        results.value = [];
        getTeamsById(val);
      },
      { deep: true }
    );

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
      isAddResult.value = false;
      isEditResult.value = false;
      resultToEdit.value = null;
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

    const editResult = async (result: any) => {
      isAddResult.value = false;
      isComments.value = false;
      selectedResultId.value = null;
      if (resultToEdit.value == null || resultToEdit.value != result) {
        isEditResult.value = true;
        resultToEdit.value = result;
      } else if (resultToEdit.value == result) {
        isEditResult.value = false;
        resultToEdit.value = null;
      }
    };

    const addResult = async () => {
      isComments.value = false;
      isEditResult.value = false;
      isAddResult.value = true;
      selectedResultId.value = null;
      resultToEdit.value = null;
    };

    getTeamsById(globals);
    return {
      results,
      toggleComments,
      isComments,
      isAddResult,
      selectedResultId,
      isAuthenticated,
      editResult,
      addResult,
      resultToEdit,
      isEditResult,
      globals,
    };
  },
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: center;
}

.header > button {
  outline: none;
  border: none;
  margin-left: 3em;
  padding: 0.5em;
  border-radius: 1em;
  background-color: #3e7754;
}

.header > button:hover {
  cursor: pointer;
  background-color: #498d63;
}

.master-container {
  margin-top: 2em;
}

.body-container {
  display: flex;
  justify-content: space-evenly;
}

.results-container {
  box-sizing: border-box;
  display: flex;
  justify-content: start;
  align-items: start;
  width: 58em;
  height: 40em;
  overflow-y: scroll;
  overflow-x: none;
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
  padding: 0.2em;
  border-radius: 1em;
  margin-left: 4em;
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