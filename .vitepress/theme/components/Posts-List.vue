<template>
  <div class="container posts-content">
    <TransitionGroup class="posts-list" name="list" tag="div">
      <article class="post" v-for="post in postsList" :key="post.href">
        <span v-if="post.pinned" class="pinned"></span>
        <header class="post-header">
          <div v-if="post.cover" class="cover-container">
            <img
              :src="resolveAssetPath(post.cover)"
              class="cover-image"
              :alt="post.title + '-cover'"
              loading="lazy"
            />
          </div>
          <div class="header-content">
            <div class="title">
              <div class="title-dot" v-if="!post.cover"></div>
              <h1 class="name">
                <a :href="base + post.href">{{ post.title }}</a>
              </h1>
            </div>
            <div class="meta-info-bar">
              <span class="iconfont icon-time time"></span>
              <div class="time-info">
                <time datetime="">{{ formatDate(post.create) }}</time>
              </div>
              <div class="wordcount seperator">Khoảng {{ post.wordCount }} chữ</div>
            </div>
            <ul class="tags">
              <li v-for="tag in post.tags" :key="tag">
                <a :href="`${base}tags/`" @click="state.currTag = tag">
                  <i class="iconfont icon-tag"></i> {{ tag }}
                </a>
              </li>
            </ul>
            <div class="excerpt">
              <p>{{ post.excerpt }}</p>
            </div>
          </div>
        </header>
      </article>
    </TransitionGroup>
    <div v-if="totalPage != 1" class="pagination">
      <button
        :disabled="currPage === 1"
        :class="{ hide: currPage === 1 }"
        id="up"
        @click="goToPage(currPage - 1)"
      >
        <i class="iconfont icon-arrow"></i>
      </button>

      <div class="page-numbers">
        <!-- 第一页 -->
        <button class="page-number" :class="{ active: currPage === 1 }" @click="goToPage(1)">
          1
        </button>

        <!-- 页码省略号 -->
        <span v-if="showLeftEllipsis" class="ellipsis">...</span>

        <!-- 当前页码 -->
        <button
          v-for="page in visiblePageNumbers"
          :key="page"
          class="page-number"
          :class="{ active: currPage === page }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>

        <!-- 页码省略号 -->
        <span v-if="showRightEllipsis" class="ellipsis">...</span>

        <!-- 尾页 -->
        <button
          v-if="totalPage > 1"
          class="page-number"
          :class="{ active: currPage === totalPage }"
          @click="goToPage(totalPage)"
        >
          {{ totalPage }}
        </button>
      </div>

      <button
        :disabled="currPage >= totalPage"
        :class="{ hide: currPage >= totalPage }"
        id="next"
        @click="goToPage(currPage + 1)"
      >
        <i class="iconfont icon-arrow"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
function calculateWordCount(text: string): number {
  const plainText = text.replace(/<[^>]*>/g, '') // Loại bỏ HTML tags
  const words = plainText.match(/[\p{L}\p{N}_]+/gu) // Đếm từ
  return words ? words.length : 0
}

import { useData } from 'vitepress'
import { ref, computed, onMounted, watch } from 'vue'
import { data as posts } from '../utils/posts.data'
import { useStore } from '../store'

const { state } = useStore()
const { page, site } = useData()
const base = site.value.base

function resolveAssetPath(path: string) {
  const normalizedBase = base.endsWith('/') ? base : base + '/'
  return normalizedBase + path.replace(/^\//, '')
}

// 日期格式化 - format timestamp number thành ngày tháng
function formatDate(create: any): string {
  let timestamp: number
  if (typeof create === 'number') {
    timestamp = create
  } else {
    const date = new Date(create)
    timestamp = date.getTime()
  }
  if (isNaN(timestamp)) return ''
  const date = new Date(timestamp)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

// Lấy và xử lý create date dạng timestamp số
function getTimestamp(create: any): number {
  if (typeof create === 'number') return create
  const date = new Date(create)
  if (!isNaN(date.getTime())) return date.getTime()
  return 0
}

// 文章传值 - sort theo pinned rồi mới theo create timestamp
const finalPosts = computed(() => {
  const rawPosts =
    page.value.filePath === 'index.md'
      ? posts
      : page.value.filePath === 'tags/index.md'
      ? state.selectedPosts
      : []

  return rawPosts.slice().sort((a, b) => {
    // Ưu tiên bài có "pinned: true"
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1

    // Bài có title là "hello" luôn đứng đầu
    if (a.title === 'Xin chào thế giới') return -1
    if (b.title === 'Xin chào thế giới') return 1
    // Sắp xếp theo create timestamp giảm dần
    const timeA = getTimestamp(a.create)
    const timeB = getTimestamp(b.create)

    return timeB - timeA
  })
})
// 文章列表长度
const pageSize = ref(5)

// 使用store中的currPage
const currPage = computed({
  get: () => state.currPage,
  set: (value) => (state.currPage = value),
})

onMounted(() => {
  // 获取URL信息
  updatePageFromUrl()
  // 监听前进后退
  window.addEventListener('popstate', () => {
    updatePageFromUrl()
  })
})
function updatePageFromUrl() {
  const urlParams = new URLSearchParams(window.location.search)
  const pageParam = urlParams.get('page')
  if (
    pageParam &&
    !isNaN(parseInt(pageParam)) &&
    parseInt(pageParam) > 0 &&
    parseInt(pageParam) <= totalPage.value
  ) {
    state.currPage = parseInt(pageParam)
  } else {
    state.currPage = 1
  }
}

// 更新页码逻辑
function goToPage(page: number) {
  if (page < 1 || page > totalPage.value) return
  state.currPage = page

  // 获取URL信息
  const url = new URL(window.location.href)

  // 非首页时获取URL页码
  if (page > 1) {
    url.searchParams.set('page', page.toString())
  } else {
    url.searchParams.delete('page')
  }

  // Tag页面页码逻辑
  const tagParam = url.searchParams.get('tag')
  if (tagParam) {
    url.searchParams.set('tag', tagParam)
  }

  window.history.pushState({}, '', url.toString())
}

// 计算要显示的页码
const maxVisiblePages = 3 // 省略号两边显示的页码按钮数量
const visiblePageNumbers = computed(() => {
  if (totalPage.value <= 7)
    return Array.from({ length: totalPage.value - 2 }, (_, i) => i + 2).filter(
      (p) => p > 1 && p < totalPage.value,
    )

  let startPage = Math.max(2, currPage.value - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPage.value - 1, startPage + maxVisiblePages - 1)

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(2, endPage - maxVisiblePages + 1)
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
})

// 省略号显示逻辑
const showLeftEllipsis = computed(() => {
  return totalPage.value > 7 && visiblePageNumbers.value[0] > 2
})

const showRightEllipsis = computed(() => {
  return (
    totalPage.value > 7 &&
    visiblePageNumbers.value[visiblePageNumbers.value.length - 1] < totalPage.value - 1
  )
})
const postsList = computed(() => {
  return finalPosts.value
    .slice((currPage.value - 1) * pageSize.value, currPage.value * pageSize.value)
    .map((post) => ({
      ...post,
      wordCount: calculateWordCount(post.content || ''),
    }))
})
const totalPage = computed(() => {
  return Math.ceil(finalPosts.value.length / pageSize.value) || 1
})

// 监听文章列表
watch(
  () => state.selectedPosts,
  () => {
    // 标签页逻辑，获取URL页码
    const urlParams = new URLSearchParams(window.location.search)
    const pageParam = urlParams.get('page')

    // 标签更改时重置页码
    const newTotalPages = Math.ceil(state.selectedPosts.length / pageSize.value) || 1

    if (!pageParam || currPage.value > newTotalPages) {
      currPage.value = 1

      // 更新URL
      if (pageParam) {
        const url = new URL(window.location.href)
        url.searchParams.delete('page')
        window.history.pushState({}, '', url.toString())
      }
    }
  },
)
</script>

<style scoped lang="less">
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}

.list-leave-active {
  position: absolute;
  right: 0;
  left: 0;
}

.posts-content {
  article,
  h1,
  ul {
    margin: 0;
    padding: 0;
  }
}

.posts-list {
  position: relative;
  overflow-wrap: break-word;
  font-family: 'Be Vietnam Pro', 'Inter', 'Roboto', 'Noto Sans', sans-serif;
  font-feature-settings: 'kern', 'liga', 'clig', 'calt';
  letter-spacing: 0;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  .post {
    display: flex;
    flex-direction: column;
    margin-bottom: 50px;
    padding-bottom: 16px;
    background-color: var(--foreground-color);
    border-radius: 32px;
    border-left: 16px solid var(--pot-border-left);
    background-image: var(--deco1);
    background-size: contain;
    background-position: right;
    background-repeat: no-repeat;
    box-shadow: 0 0 8px rgba(var(--blue-shadow-color), 0.8);
    transition: all 0.5s;
    position: relative;

    .pinned {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--icon-pinned) no-repeat center/contain;
      box-shadow: 0 0 6px rgba(var(--blue-shadow-color), 0.65);
    }

    .post-header {
      display: flex;
      gap: 24px;
      padding: 32px 40px 0;
      align-items: stretch;
      position: relative;

      .cover-container {
        flex: 0 0 180px;
        height: 140px;
        border-radius: 12px;
        overflow: hidden;
        margin-left: -8px;
        margin-bottom: 15px;
        align-self: center;
        position: relative;

        .cover-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;

          &:hover {
            transform: scale(1.05);
          }
        }
      }

      .header-content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;

        .title {
          position: relative;
          margin-bottom: 8px;

          .name {
            font-weight: 700;
            font-size: 1.75rem;
            a {
              color: var(--text-color);
              text-decoration: none;
              font-family: inherit;
              letter-spacing: inherit;

              &:hover {
                text-decoration: underline;
              }
            }
          }

          .title-dot {
            position: absolute;
            top: 15px;
            left: -18px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: var(--pot-primary);
          }
        }

        .excerpt {
          flex: 1;
          display: flex;
          align-items: flex-end;

          p {
            color: var(--text-color-light);
            font-family: inherit;
            letter-spacing: inherit;
            line-height: inherit;
            margin: 0;
          }
        }
      }
    }

    @media (max-width: 768px) {
      .post-header {
        flex-direction: column;
        gap: 16px;
        padding: 24px 20px 0;

        .cover-container {
          width: 100%;
          height: 160px;
          margin-left: 0;
          margin-bottom: 15px;
        }
      }
    }
  }

  .meta-info-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: inherit;
    letter-spacing: inherit;
    line-height: inherit;

    .iconfont {
      &.icon-time,
      &.icon-tag {
        font-size: 14px;
        color: var(--pot-primary);
      }
    }

    .time-info {
      font-size: 13px;
      color: var(--pot-primary);
      user-select: none;
    }

    .wordcount {
      font-size: 13px;
      user-select: none;

      &.seperator::before {
        content: '·';
        margin: 0 6px;
        color: var(--pot-primary);
      }
    }
  }

  .tags {
    margin: 15px 0;
    display: flex;
    flex-wrap: wrap; /* Thêm dòng này */
    gap: 12px;
    list-style: none;
    font-size: 12px;
    font-weight: 400;

    li {
      a {
        color: var(--text-color);
        display: inline-flex;
        align-items: center;
        padding: 6px 12px;
        border-radius: 14px;
        background-color: var(--pot-bg-gray);
        text-decoration: none;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
          background-color: var(--pot-bg-primary);
          color: var(--pot-primary);
        }

        i {
          margin-right: 4px;
          font-size: 14px;
          line-height: 14px;
        }
      }
    }
  }
}

.pagination {
  margin: 50px auto 60px;
  max-width: 600px;
  text-align: center;
  user-select: none;

  button {
    cursor: pointer;
    padding: 8px 15px;
    margin: 0 3px;
    font-size: 14px;
    border-radius: 3px;
    border: none;
    background: var(--pot-bg-gray);
    color: var(--text-color);
    transition: all 0.3s;

    &.active {
      background: var(--pot-primary);
      color: #fff;
      cursor: default;
    }

    &:disabled {
      cursor: default;
      opacity: 0.6;
    }

    &.hide {
      display: none;
    }
  }

  .ellipsis {
    margin: 0 6px;
    user-select: none;
  }
}
</style>
