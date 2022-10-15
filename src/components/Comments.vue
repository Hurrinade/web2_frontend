<template>
  <div>
    <AddComment
      v-if="addNewComment"
      :resultid="resultid"
      @closenewcomment="addNewComment = false"
    />
    <EditComment
      v-if="toogleEditComment"
      :resultid="resultid"
      :commentid="editCommentId"
      @closeedit="toogleEditComment = false"
    />
    <div v-if="!addNewComment && !toogleEditComment" class="comments-container">
      <div class="header">
        <h2>Comments</h2>
        <button class="add" @click="addComment(resultid)">+</button>
      </div>

      <div
        v-for="comment in comments"
        :key="comment.resultId"
        class="comment-box-container"
      >
        <div v-if="comment.resultId == resultid" class="comment-box">
          <div class="comment-content">
            <div class="email">
              {{ comment.email }}
            </div>
            <div class="date">
              {{ comment.date }}
            </div>
            <div class="text">
              {{ comment.text }}
            </div>
          </div>
          <div class="comment-actions">
            <button class="edit" @click="editComment(comment)">Edit</button>
            <button class="delete" @click="deleteComment(comment)">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useGlobalsStore } from "../stores/globals";
import { useAuth0 } from "@auth0/auth0-vue";
import AddComment from "./AddComment.vue";
import EditComment from "./EditComment.vue";

export default defineComponent({
  components: {
    AddComment,
    EditComment,
  },
  props: {
    resultid: {
      type: String,
      default: null,
    },
  },
  setup() {
    const globals = useGlobalsStore();
    const comments: any = ref(globals.commentsData);
    const addNewComment = ref(false);
    const toogleEditComment = ref(false);
    const editCommentId = ref("");
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    watch(
      () => globals.commentsData,
      (val) => {
        comments.value = val;
        editCommentId.value = "";
      },
      { deep: true }
    );

    const deleteComment = async (comment: any) => {
      if (isAuthenticated) {
        const accessToken = await getAccessTokenSilently();
        const resComments = await fetch(
          `${globals.localUrl}/data/comments?` +
            new URLSearchParams({
              id: comment.commentId,
            }),
          {
            method: "DELETE",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (resComments.ok) {
          const commentsData = await resComments.json();
          globals.commentsData = commentsData;
        } else {
          console.log(resComments.status);
        }
      } else {
        alert("Login is needed");
      }
    };

    const editComment = (comment: any) => {
      toogleEditComment.value = true;
      editCommentId.value = comment.commentId;
    };

    const addComment = (resultId: any) => {
      addNewComment.value = true;
    };

    return {
      comments,
      deleteComment,
      editComment,
      addComment,
      addNewComment,
      toogleEditComment,
      editCommentId,
    };
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
  height: 45em;
  overflow-y: scroll;
}

.comment-box {
  margin: 1em 0em 1em 0em;
  height: 15em;
  width: 20em;
  display: flex;
  border-radius: 1em;
  border: #3e5a77 1px solid;
}

.comment-content {
  font-size: 0.8em;
  width: 80%;
  padding: 2em;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.comment-actions {
  display: flex;
  flex-direction: column;
  justify-content: start;
}

button {
  cursor: pointer;
  width: 5em;
  height: 10em;
  border: none;
  color: white;
  background-color: #3e5a77;
}

.edit:hover {
  background-color: #77673e;
}

.delete:hover {
  background-color: #773e3e;
}

button:first-child {
  border-radius: 0em 1em 0em 0em;
}

button:last-child {
  border-radius: 0em 0em 1em 0em;
}

button.add {
  width: 3em;
  height: 2em;
  color: white;
  background-color: #3e5a77;
  border-radius: 2em;
}

button.add:hover {
  background-color: #3e7754;
}
</style>