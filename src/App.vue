<template>
  <div class="sport">
    <div class="navigation">
      <a class="nav-button" @click="changeTab('table')">Table</a>
      <a class="nav-button" @click="changeTab('fixtures')">Fixtures</a>
      <a class="nav-button" @click="changeTab('results')">Results</a>
      <a style="margin-left: 40em"><LoginPage /></a>
    </div>
    <TableView v-if="tab === 'table'" />
    <FixturesView v-if="tab === 'fixtures'" />
    <ResultsView v-if="tab === 'results'" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import FixturesView from "./components/FixturesView.vue";
import ResultsView from "./components/ResultsView.vue";
import TableView from "./components/TableView.vue";
import LoginPage from "./components/LoginPage.vue";
import { useGlobalsStore } from "./stores/globals";

export default defineComponent({
  name: "App",
  components: {
    FixturesView,
    ResultsView,
    TableView,
    LoginPage,
  },
  setup(props: any, ctx: any) {
    const tab = ref("table");

    const globals = useGlobalsStore();

    const changeTab = (newTab: string) => {
      tab.value = newTab;
    };

    const fetchData = async () => {
      const res = await fetch(`${globals.localUrl}/data`);

      console.log(ctx);
      // const accessToken = await auth.getTokenSilently();
      const resComments = await fetch(`${globals.localUrl}/data/comments`, {
        headers: {
          // Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      const commentsData = await resComments.json();

      globals.tableData = data.table;
      globals.fixturesData = data.fixtures;
      globals.resultsData = data.results;
      globals.commentsData = commentsData;
    };

    fetchData();

    return {
      tab,
      changeTab,
    };
  },
});
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0px;
  padding: 0px;
}

body,
html {
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #222222;
  color: #e8e8e8;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sport {
  background-color: #2c3e50;
  border-radius: 1em;
  height: 55em;
  width: 80em;
}

.navigation {
  width: 100%;
  height: 5em;
  display: flex;
  justify-content: start;
  align-items: center;
  background-color: #384e64;
}

.nav-button {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-decoration: none;
  width: 10em;
  height: 5em;
}

.nav-button:hover {
  cursor: pointer;
  background-color: #445f79;
  text-decoration: none;
}
</style>
