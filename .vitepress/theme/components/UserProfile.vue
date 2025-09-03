<template>
  <div class="user-profile">
    <img :src="user.avatar" alt="User Avatar" class="user-avatar" />
    <h2>{{ user.name }}</h2>
    <p>{{ user.bio }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const user = ref({
  avatar: 'https://avatars.githubusercontent.com/u/164517212?v=4',
  name: 'Phong',
  bio: 'Manhwa học viện',
})
</script>

<style scoped>
.user-profile {
  text-align: center;
  margin-top: 20px;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

h2 {
  color: #fff;
}

p {
  color: #bbb;
}
</style>
