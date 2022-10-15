<template>
  <div class="login-container" @click="logoutFromAccount">Log out</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { useGlobalsStore } from "../stores/globals";

export default defineComponent({
  setup() {
    const { logout } = useAuth0();
    const globals = useGlobalsStore();

    const logoutFromAccount = () => {
      globals.commentsData = [];
      logout({ returnTo: window.location.origin });
    };

    return { logoutFromAccount };
  },
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10em;
  height: 5em;
  font-weight: 600;
  letter-spacing: 0.15em;
}

.login-container:hover {
  cursor: pointer;
  background-color: #445f79;
  text-decoration: none;
}
</style>