<template>
  <div class="login-container" @click="login">Log In</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

export default defineComponent({
  setup() {
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    const login = async () => {
      loginWithRedirect();
    };

    return { login };
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