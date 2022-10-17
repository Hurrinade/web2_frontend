<template>
  <div class="comments-container">
    <div class="header">
      <h2>Edit comment</h2>
    </div>
    <form @submit.prevent="submit" class="new-comment-form">
      <label for="email">User email</label>
      <input
        class="field"
        id="email"
        type="text"
        disabled
        :placeholder="user.email"
      />
      <label for="email">Comment</label>
      <textarea id="email" type="text" maxlength="200" v-model="commentText" />
      <div class="buttons">
        <input value="Submit" type="submit" class="form-button" />
        <input value="Cancel" class="form-button" @click="cancel" />
      </div>
    </form>
    <div v-if="error.isError" class="error">{{ error.msg }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useGlobalsStore } from "../stores/globals";
import { useAuth0 } from "@auth0/auth0-vue";

import type { Ref } from "vue";
import { Comment } from "../models/data_models";
import dayjs from "dayjs";
export default defineComponent({
  props: {
    resultid: {
      type: Number,
      default: null,
    },
    commentid: {
      type: Number,
      default: null,
    },
  },
  emits: ["closeedit"],
  setup(props: any, ctx: any) {
    const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();
    const globals = useGlobalsStore();
    const comments: Ref<Comment[]> = ref(globals.commentsData);
    const commentText: Ref<string> = ref("");

    const error = ref({
      msg: "",
      isError: false,
    });

    const submit = async () => {
      if (isAuthenticated.value) {
        const editComment = {
          commentId: props.commentid,
          resultId: props.resultid,
          email: user.value.email,
          date: dayjs().format("DD-MM-YYYY"),
          text: commentText.value,
        };

        const accessToken = await getAccessTokenSilently();
        const resComments = await fetch(`${globals.localUrl}/data/comments`, {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(editComment),
        });

        if (resComments.ok) {
          const commentsData = await resComments.json();
          globals.commentsData = commentsData;

          error.value.msg = "";
          error.value.isError = false;
          ctx.emit("closeedit");
        } else {
          const commentsData = await resComments.json();
          error.value.msg = String(commentsData.error);
          error.value.isError = true;
        }
      } else {
        alert("Login is needed");
      }
    };

    const cancel = () => {
      ctx.emit("closeedit");
    };

    return { comments, submit, cancel, user, commentText, error };
  },
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-around;
}

.comments-container {
  padding: 1em;
  border-radius: 1em;
  background-color: #4f6f91;
  width: 23em;
  height: 35em;
  overflow-y: scroll;
}

.new-comment-form {
  margin: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.field {
  color: white;
  padding: 1em;
  margin: 2em 0em 3em 0em;
  width: 20em;
  background-color: #3e5a77;
  display: flex;
  justify-content: start;
  border: none;
}

textarea {
  margin: 1em;
  background-color: rgb(229, 229, 229);
  border: none;
  outline: none;
  width: 20em;
  height: 15em;
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