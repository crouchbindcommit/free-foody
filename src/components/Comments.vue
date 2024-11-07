<template>
  <div>
    <!-- Comment Input Card -->
    <v-card class="mb-4">
      <v-card-title>
        <span class="headline">Leave a Comment</span>
      </v-card-title>
      <v-card-text>
        <v-select v-model="showUsername" :items="usernameOptions" label="Show Your Username" outlined dense />
        <v-textarea v-model="newComment.body" label="Leave a comment..." outlined dense />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="postComment" color="primary">Submit</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Recent Comments Display Card -->
    <div v-if="comments.length > 0">
      <v-card>
        <v-card-title>
          <span class="headline">Recent Comments</span>
          <v-spacer></v-spacer>
          <v-btn text @click="showAllCommentsPopup = true">See All</v-btn>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text>
          <v-list>
            <v-list-item v-for="(comment, index) in recentComments" :key="comment._id">
              <v-list-item-content>
                <v-list-item-title>
                  <b>{{ showUsername ? (comment.username || "Anonymous") : 'Anonymous' }}</b>
                  <span class="time-ago"> • {{ formatTimeAgo(comment.createdAt) }}</span>
                </v-list-item-title>
                <v-list-item-subtitle v-if="comment.subject">{{ comment.subject }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{ comment.body }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <!-- All Comments Popup with Dynamic Pagination -->
      <v-dialog v-model="showAllCommentsPopup" max-width="600px" persistent>
        <v-card>
          <v-card-title class="headline">All Comments</v-card-title>
          <v-divider></v-divider>

          <!-- Comment List with Dynamic Pagination -->
          <v-card-text>
            <v-list>
              <v-list-item v-for="comment in paginatedComments" :key="comment._id">
                <v-list-item-content>
                  <v-list-item-title>
                    <b>{{ showUsername ? (comment.username || "Anonymous") : 'Anonymous' }}</b>
                    <span class="time-ago"> • {{ formatTimeAgo(comment.createdAt) }}</span>
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="comment.subject">{{ comment.subject }}</v-list-item-subtitle>
                  <v-list-item-subtitle>{{ comment.body }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click.stop="likeComment(comment._id)">
                    👍 <span class="vote-count">({{ comment.likes }})</span>
                  </v-btn>
                  <v-btn icon @click.stop="dislikeComment(comment._id)">
                    👎 <span class="vote-count">({{ comment.dislikes }})</span>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>

          <!-- Pagination Controls -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="prevPage" :disabled="currentPage === 1">Previous</v-btn>
            <span>{{ currentPage }}</span>
            <v-btn text @click="nextPage" :disabled="!hasMoreComments">Next</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="showAllCommentsPopup = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="showAlert" :timeout="3000" color="grey darken-4">
        {{ alertMessage }}
        <v-btn text color="red" @click="showAlert = false">Close</v-btn>
      </v-snackbar>
    </div>

    <div v-if="comments.length == 0">
      <v-card>
        <v-card-text>
          No comments yet. Be the first to say something!
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const props = defineProps({
  eventId: String,
});

const comments = ref([]);
const newComment = ref({ body: '', subject: null });
const showUsername = ref(true);
const usernameOptions = ['Show Username', 'Hide Username'];
const user = ref(localStorage.getItem('user'));
const userId = ref(localStorage.getItem('userId'));
const recentComments = computed(() => comments.value.slice(0, 3));
const showAllCommentsPopup = ref(false);

const currentPage = ref(1);
const pageSize = ref(300);

// Alert-related state
const showAlert = ref(false);
const alertMessage = ref('');

// Fetch comments based on eventId
const fetchComments = async () => {
  try {
    const response = await axios.get(`https://free-food-api.onrender.com/api/comments/event/${props.eventId}`);
    comments.value = response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

// Function to post a new comment
const postComment = async () => {
  const userIdValue = localStorage.getItem('userId');
  if (!userIdValue) {
    alertMessage.value = 'User is not authenticated, cannot post comment';
    showAlert.value = true;
    return;
  }

  try {
    const commentData = {
      body: newComment.value.body,
      subject: newComment.value.subject,
      userId: userIdValue,
      eventId: props.eventId,
    };

    await axios.post(`https://free-food-api.onrender.com/api/comments`, commentData);
    newComment.value.body = ''; // Clear the textarea
    fetchComments(); // Refresh comments after posting
  } catch (error) {
    console.error('Error posting comment:', error.response || error);
  }
};

// Function to like a comment
const likeComment = async (commentId) => {
  try {
    await axios.post(`https://free-food-api.onrender.com/api/comments/${commentId}/like`, { userId: localStorage.getItem('userId') });
    fetchComments(); // Refresh comments to update like count
  } catch (error) {
    if (error.response && error.response.status === 400) {
      alertMessage.value = error.response.data.message || 'You have already liked this comment';
      showAlert.value = true;
    } else {
      console.error('Error liking comment:', error);
    }
  }
};

// Function to dislike a comment
const dislikeComment = async (commentId) => {
  try {
    await axios.post(`https://free-food-api.onrender.com/api/comments/${commentId}/dislike`, { userId: userId.value });
    fetchComments(); // Refresh comments to update dislike count
  } catch (error) {
    if (error.response && error.response.status === 400) {
      alertMessage.value = error.response.data.message || 'You have already disliked this comment';
      showAlert.value = true;
    } else {
      console.error('Error disliking comment:', error);
    }
  }
};

// Function to format timestamp to "time ago" format
const formatTimeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

// Fetch comments when the component mounts
onMounted(() => {
  userId.value = localStorage.getItem('userId');
  fetchComments();
});

const paginatedComments = computed(() => {
  let chars = 0;
  const startIndex = (currentPage.value - 1) * pageSize.value;
  let currentIndex = startIndex;

  // Collect comments for the current page based on available "space" (characters)
  while (chars < pageSize.value && currentIndex < comments.value.length) {
    chars += (comments.value[currentIndex].body.length || 0) + (comments.value[currentIndex].subject?.length || 0);
    currentIndex++;
  }

  return comments.value.slice(startIndex, currentIndex);
});

const hasMoreComments = computed(() => (currentPage.value * pageSize.value) < comments.value.length);
const nextPage = () => {
  if (hasMoreComments.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

</script>

<style scoped>
.comment-item {
  margin-bottom: 16px;
}

.vote-count {
  margin-left: -8px;
  margin-right: -8px;
  color: #888;
}

.time-ago {
  color: #777;
  font-size: 0.9em;
}

.v-card-title .headline {
  font-weight: bold;
}

</style>
