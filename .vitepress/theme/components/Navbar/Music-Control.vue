<template>
  <span class="music-control" @click="toggleMusic">
    <i :class="isPlaying ? 'iconfont icon-continue continue' : 'iconfont icon-stop stop'"></i>
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isPlaying = ref(false) // Trạng thái phát nhạc
const music = ref<HTMLAudioElement | null>(null)

const toggleMusic = () => {
  if (music.value) {
    if (isPlaying.value) {
      music.value.pause()
    } else {
      music.value.play().catch((err) => console.log('Phát nhạc thất bại: ', err))
    }
    isPlaying.value = !isPlaying.value
  }
}

onMounted(() => {
  music.value = document.getElementById('background-music') as HTMLAudioElement
  if (music.value) {
    music.value.volume = 1 // Âm lượng 100%
    music.value.pause() // Tạm dừng để chắc chắn trạng thái ban đầu

    // Thử tự động phát nhạc khi trang tải
    music.value.play()
      .then(() => {
        isPlaying.value = true
      })
      .catch((err) => {
        // Nếu trình duyệt chặn autoplay, giữ nguyên isPlaying = false
        console.log('Tự động phát nhạc bị chặn:', err)
      })
  }
})
</script>

<style scoped lang="less">
.iconfont {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2vw;
  color: var(--font-color-grey);
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  &:hover {
    transform: translateY(-3px);
  }
}

@media (max-width: 768px) {
  .iconfont {
    font-size: 4vh;
  }
}
</style>
