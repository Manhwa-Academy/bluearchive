<template>
  <div v-if="isReplyingToCommentId" class="reply-box">
    <textarea v-model="replyText" placeholder="Nhập trả lời..."></textarea>
    <button @click="submitReply">Gửi trả lời</button>
    <button @click="cancelReply">Hủy</button>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  isReplyingToCommentId: {
    type: String,
    required: true
  },
});

const emit = defineEmits(['submitReply', 'cancelReply']);

const replyText = ref('');

function submitReply() {
  if (replyText.value.trim()) {
    emit('submitReply', replyText.value);
    replyText.value = '';
  }
}

function cancelReply() {
  emit('cancelReply');
}
</script>

<style scoped>
.reply-box {
  background-color: #444;
  padding: 15px;
  border-radius: 8px;
}
.reply-box textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: #333;
  color: white;
}
.reply-box button {
  background-color: #007bff;
  color: white;
  padding: 7px 15px;
  border-radius: 5px;
  cursor: pointer;
}
.reply-box button:hover {
  background-color: #0056b3;
}
</style>
