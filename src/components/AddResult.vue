<template>
  <div class="comments-container">
    <div class="header">
      <h2>Add result</h2>
    </div>
    <form @submit.prevent="submit" class="new-comment-form">
      <div class="selections">
        <select name="teamTwo" id="teams" v-model="selectedTeam1" required>
          <option
            v-for="team in globals.tableData"
            :key="team.clubId"
            :value="team.clubName"
          >
            {{ team.clubName }}
          </option>
        </select>
        <select name="teamTwo" id="teams" v-model="selectedTeam2" required>
          <option
            v-for="team in globals.tableData"
            :key="team.clubId"
            :value="team.clubName"
          >
            {{ team.clubName }}
          </option>
        </select>
      </div>
      <div class="goals">
        <input type="number" v-model="teamOneGoals" required />
        <input type="number" v-model="teamTwoGoals" required />
      </div>
      <div class="buttons">
        <input value="Submit" type="submit" class="form-button" />
        <input value="Cancel" class="form-button" @click="cancel" />
      </div>
    </form>
    <div v-if="error.isError" class="error">{{ error.msg }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useGlobalsStore } from "../stores/globals";
import { useAuth0 } from "@auth0/auth0-vue";
import type { Ref } from "vue";
import { Result } from "../models/data_models";
import dayjs from "dayjs";
export default defineComponent({
  emits: ["closeadd"],
  setup(props: any, ctx: any) {
    const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();
    const globals: any = useGlobalsStore();
    const comments: Ref<Result[]> = ref(globals.commentsData);
    const commentText: Ref<string> = ref("");

    const selectedTeam1: Ref<string | null> = ref(null);
    const selectedTeam2: Ref<string | null> = ref(null);
    const teamOneGoals: Ref<number | null> = ref(null);
    const teamTwoGoals: Ref<number | null> = ref(null);

    const error = ref({
      msg: "",
      isError: false,
    });

    const submit = async () => {
      if (isAuthenticated.value) {
        let team1Id = null;
        let team2Id = null;
        for (const team in globals.tableData) {
          if (selectedTeam1.value == globals.tableData[team].clubName) {
            team1Id = globals.tableData[team].clubId;
          }
          if (selectedTeam2.value == globals.tableData[team].clubName) {
            team2Id = globals.tableData[team].clubId;
          }
        }

        const newResult = {
          firstTeamId: team1Id,
          secondTeamId: team2Id,
          firstTeamScore: teamOneGoals.value,
          secondTeamScore: teamTwoGoals.value,
        };

        if (team1Id != team2Id) {
          const accessToken = await getAccessTokenSilently();
          const resResults = await fetch(`${globals.localUrl}/data/results`, {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(newResult),
          });

          if (resResults.ok) {
            const resultsData = await resResults.json();
            globals.resultsData = resultsData;

            error.value.msg = "";
            error.value.isError = false;
            ctx.emit("closeadd");
          } else {
            error.value.msg = String(resResults.statusText);
            error.value.isError = true;
          }
        } else {
          error.value.msg = "Cannot select same teams";
          error.value.isError = true;
        }
      } else {
        alert("Login is needed");
      }
    };

    const cancel = () => {
      ctx.emit("closeadd");
    };

    return {
      comments,
      submit,
      cancel,
      user,
      commentText,
      globals,
      teamOneGoals,
      teamTwoGoals,
      selectedTeam1,
      selectedTeam2,
      error,
    };
  },
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-around;
}

.selections {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3em;
}

.selections > select {
  margin: 2em;
  width: 9em;
  height: 2em;
  background-color: #3e5a77;
  outline: none;
  border: none;
  color: white;
}

.goals {
  display: flex;
  align-items: center;
  justify-content: center;
}

.goals > input {
  width: 10em;
  margin: 1em;
  color: white;
  padding: 1em;
  background-color: #3e5a77;
  display: flex;
  justify-content: start;
  border: none;
}

.comments-container {
  padding: 1em;
  border-radius: 1em;
  background-color: #4f6f91;
  width: 23em;
  height: 35em;
}

.new-comment-form {
  margin: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.buttons {
  display: flex;
}

.form-button {
  text-align: center;
  cursor: pointer;
  border-radius: 1em;
  width: 10em;
  margin: 3em 0.5em 0em 0.5em;
  height: 2em;
  border: none;
  color: white;
  background-color: #3e5a77;
}

.form-button:hover {
  background-color: #6894c3;
}
</style>