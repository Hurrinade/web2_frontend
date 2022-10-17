<template>
  <div class="loading">Loading</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  setup() {},
});
</script>

<style scoped>
.loading {
  width: 100%;
  height: 50em;
  border-radius: 0px 0px 1em 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
}
</style>