<template>
  <div class="info-container">
    <div class="data">User email: {{ user.email }}</div>
    <div class="data">Nickname: {{ user.nickname }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

export default defineComponent({
  setup() {
    const { user } = useAuth0();

    return { user };
  },
});
</script>

<style scoped>
.info-container {
  padding: 10em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 10em;
  height: 5em;
  font-weight: 600;
  font-size: 0.7em;
}

.data {
  margin: 0.5em;
}
</style>