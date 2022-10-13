<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="submit" class="login">
      <label for="email">Email: </label>
      <input id="email" type="email" v-model="email" class="field" />
      <label for="password">Password: </label>
      <input id="password" type="password" v-model="password" class="field" />
      <input value="Submit" type="submit" class="form-button" />
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
export default defineComponent({
  setup() {
    const email = ref("");
    const password = ref("");

    const submit = async () => {
      const data = {
        email: email.value,
        password: password.value,
      };

      console.log(JSON.stringify(data));

      const response = await fetch("https://localhost:4080/authenticate", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    };

    return { email, password, submit };
  },
});
</script>

<style scoped>
.login-container {
  margin-top: 2em;
}

.login {
  margin: 5em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.field {
  color: white;
  padding: 1em;
  margin: 2em 0em 4em 0em;
  width: 50em;
  background-color: #3e5a77;
  display: flex;
  justify-content: start;
  border: none;
}

.form-button {
  border-radius: 1em;
  color: white;
  height: 3em;
  width: 10em;
  background-color: #3e5a77;
  border: none;
}

.field:focus {
  outline: none;
}
</style>