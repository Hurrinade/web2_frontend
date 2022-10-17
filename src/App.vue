<template>
  <div class="sport">
    <div class="navigation">
      <a class="nav-button" @click="changeTab('table')">Table</a>
      <a class="nav-button" @click="changeTab('fixtures')">Fixtures</a>
      <a class="nav-button" @click="changeTab('results')">Results</a>

      <a v-if="!isAuthenticated" style="margin-left: 40em"><LoginPage /></a>
      <a v-if="isAuthenticated" style="margin-left: 35em"><LogoutPage /></a>
      <UserInfo v-if="isAuthenticated" style="" />
    </div>
    <Loading v-if="isLoading" />
    <div v-if="!isLoading">
      <TableView v-if="tab === 'table'" />
      <FixturesView v-if="tab === 'fixtures'" />
      <ResultsView v-if="tab === 'results'" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import FixturesView from "./components/FixturesView.vue";
import ResultsView from "./components/ResultsView.vue";
import TableView from "./components/TableView.vue";
import LoginPage from "./components/LoginPage.vue";
import Loading from "./components/Loading,.vue";
import LogoutPage from "./components/LogoutPage.vue";
import UserInfo from "./components/UserInfo.vue";
import { useGlobalsStore } from "./stores/globals";
import { useAuth0 } from "@auth0/auth0-vue";

import type { Ref } from "vue";

export default defineComponent({
  name: "App",
  components: {
    FixturesView,
    ResultsView,
    UserInfo,
    TableView,
    LoginPage,
    LogoutPage,
    Loading,
  },

  setup(props: any, ctx: any) {
    const tab = ref("table");
    const isLoading: Ref<boolean> = ref(true);
    const globals = useGlobalsStore();
    const { getAccessTokenSilently, error, user, isAuthenticated } = useAuth0();

    const changeTab = (newTab: string) => {
      tab.value = newTab;
    };

    const fetchData = async () => {
      isLoading.value = true;
      const res = await fetch(`${globals.localUrl}/data`);
      const data = await res.json();
      globals.tableData = data.table;
      globals.fixturesData = data.fixtures;
      globals.resultsData = data.results;
      isLoading.value = false;
    };

    watch(
      () => isAuthenticated,
      (val) => {
        if (isAuthenticated.value) {
          fetchRole();
          fetchComments();
        }
      },
      { deep: true }
    );

    const fetchRole = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const [resRoleUser, resRoleAdmin] = await Promise.all([
          fetch(`${globals.localUrl}/data/role/user`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
          fetch(`${globals.localUrl}/data/role/admin`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
        ]);

        if (resRoleUser.ok) {
          const role = await resRoleUser.json();
          globals.userRole = role;
        } else if (resRoleAdmin.ok) {
          const role = await resRoleAdmin.json();
          globals.userRole = role;
        }
      } catch (e) {
        console.log(error);
      }
    };

    const fetchComments = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const resComments = await fetch(`${globals.localUrl}/data/comments`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (resComments.ok) {
          const commentsData = await resComments.json();
          globals.commentsData = commentsData;
        }
      } catch (e) {
        console.log(error);
      }
    };

    fetchData();

    return {
      tab,
      changeTab,
      isAuthenticated,
      isLoading,
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
  width: 85em;
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

.error {
  background-color: #445f79;
  color: rgb(255, 0, 0);
}
</style>
