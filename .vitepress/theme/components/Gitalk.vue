<template>
  <div class="github-login-comment">
    <div class="login-area" v-if="!user">
      <!-- Chỉ hiển thị textbox nhập bình luận và nút "Login with GitHub" khi chưa đăng nhập -->
      <textarea v-model="comment" placeholder="Nhập bình luận..." disabled></textarea>
      <button class="login-button" @click="signInWithGitHub">Login with GitHub</button>
      <br /><br />
      <button class="preview-button" :disabled="!comment.trim()">Preview</button>
    </div>

    <div class="comment-area">
      <div v-if="user">
        <!-- Hiển thị khi đã đăng nhập -->
        <div class="user-info">
          <img
            :src="user?.photoURL || 'default-avatar-url'"
            alt="User Avatar"
            class="user-avatar"
          />
          <p>Xin chào, {{ user?.displayName || 'Người dùng ẩn danh' }}</p>

          <button class="logout-button" @click="signOut">Đăng xuất</button>
        </div>

        <!-- Textarea bình luận với biểu tượng mặt cười -->
        <div class="textarea-wrapper">
          <textarea v-model="comment" placeholder="Nhập bình luận..." :disabled="!user"></textarea>
          <button class="emoji-btn" @click="toggleEmojiPicker">
            <i class="fas fa-smile"></i>
            <!-- Biểu tượng mặt cười -->
          </button>
        </div>

        <div class="emoji-categories">
          <button @click="currentCategory = 'Cảm xúc'">Cảm xúc</button>
          <button @click="currentCategory = 'Động vật'">Động vật</button>
          <button @click="currentCategory = 'Thực phẩm'">Thực phẩm</button>
          <button @click="currentCategory = 'Hoạt động'">Hoạt động</button>
          <button @click="currentCategory = 'Giao thông'">Giao thông</button>
          <button @click="currentCategory = 'Thiên nhiên'">Thiên nhiên</button>
        </div>

        <!-- Bảng chọn Emoji -->
        <div v-if="emojiPickerVisible" class="emoji-picker">
          <button class="close-emoji-picker" @click="toggleEmojiPicker">X</button>

          <!-- Hiển thị emoji theo trang -->
          <div v-for="(emoji, index) in currentPageEmojis" :key="index">
            <button @click="addEmoji(emoji)">{{ emoji }}</button>
          </div>

          <!-- Nút chuyển trang -->
          <div class="page-buttons">
            <button @click="prevPage" :disabled="currentPage === 1">Trang trước</button>
            <button @click="nextPage" :disabled="currentPage === totalPages">Trang sau</button>
          </div>
        </div>

        <!-- Media Input -->
        <div class="media-input">
          <input
            v-model="mediaUrl"
            type="text"
            placeholder="Image, Gif, or Video URL"
            @keydown.enter.prevent="embedMedia"
          />
          <br /><br />
          <button @click="embedMedia">Tạo từ URL</button>
        </div>
        <br />
        <div class="button-group">
          <button class="submit-button" @click="submitComment" :disabled="!comment.trim()">
            Gửi bình luận
          </button>
          <button class="preview-button" @click="togglePreview" :disabled="!comment.trim()">
            Preview
          </button>
        </div>
      </div>

      <!-- Hiển thị bình luận cho tất cả người dùng, dù họ có đăng nhập hay không -->
      <h3>Bình luận đã gửi ({{ comments.length }}):</h3>
      <div class="sorting-options">
        <label for="sort-dropdown" class="sort-label">Sắp xếp theo</label>
        <select id="sort-dropdown" v-model="sortOrder" @change="sortComments" class="sort-dropdown">
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>
      </div>

      <ul>
        <li
          v-for="(c, index) in sortedCommentsList.filter((comment) => !comment.parentId)"
          :key="index"
          class="comment-item"
        >
          <div class="comment">
            <img :src="c.userAvatar || 'default-avatar-url'" alt="Avatar" class="comment-avatar" />
            <div class="comment-content">
              <strong>{{ c.userName || 'Người dùng ẩn danh' }}</strong>
              <span class="comment-time"> ({{ formatFullDate(c.createdAt) }}) </span>
              <span v-if="c.isPinned" class="pinned-label">Bình luận được ghim</span>
              <span v-if="c.updatedAt" class="edit-time">
                (Chỉnh sửa vào: {{ formatFullDate(c.updatedAt) }})
              </span>

              <p>{{ c.text }}</p>

              <!-- Render Media -->
              <div v-if="c.mediaUrl">
                <img v-if="isImage(c.mediaUrl)" :src="c.mediaUrl" class="media" />
                <video v-if="isVideo(c.mediaUrl)" :src="c.mediaUrl" controls class="media"></video>
                <img v-if="isGif(c.mediaUrl)" :src="c.mediaUrl" class="media" />
              </div>

              <!-- Form nhập tài khoản mật khẩu để ghim bình luận -->
              <div v-if="isPinFormVisible && currentCommentId === c.id" class="pin-form">
                <input v-model="pinUsername" type="text" placeholder="Nhập tài khoản" />
                <input v-model="pinPassword" type="password" placeholder="Nhập mật khẩu" />
                <button @click="pinComment(c.id)">Ghim bình luận</button>
                <button @click="closePinForm">Hủy</button>
                <p v-if="pinError" class="error-message">Tài khoản hoặc mật khẩu sai!</p>
              </div>

              <div class="comment-actions">
                <!-- Hiển thị nút Xóa cho người dùng đã đăng nhập và là chủ sở hữu bình luận -->
                <button v-if="user?.uid === c.userId" @click="confirmDelete(c.id)">Xóa</button>
                <button v-if="user?.uid !== c.userId" @click="replyToComment(c.id)">Trả lời</button>
                <button v-if="user?.uid === c.userId" @click="editComment(c.id)">Sửa</button>
                <button v-if="user?.uid === c.userId && !c.isPinned" @click="showPinForm(c.id)">
                  Ghim bình luận
                </button>

                <button v-if="user?.uid === c.userId && c.isPinned" @click="unpinComment(c.id)">
                  Bỏ Ghim
                </button>
              </div>
            </div>
          </div>

          <div v-if="isEditingCommentId === c.id" class="edit-box">
            <textarea v-model="comment" placeholder="Nhập bình luận..."></textarea>
            <button @click="submitEditComment(c.id)">Lưu thay đổi</button>
            <button @click="cancelEdit">Hủy</button>
          </div>

          <!-- Hiển thị phản hồi chỉ khi showReplies là true -->
          <ul v-if="c.showReplies && c.replies && c.replies.length > 0" class="replies-list">
            <li v-for="reply in c.replies" :key="reply.id" class="reply-item">
              <div class="comment">
                <img
                  :src="reply.userAvatar || 'default-avatar-url'"
                  alt="Avatar"
                  class="comment-avatar"
                />
                <div class="comment-content">
                  <strong>{{ reply.userName || 'Người dùng ẩn danh' }}</strong>
                  <p>{{ reply.text }}</p>

                  <!-- Render Media -->
                  <div v-if="reply.mediaUrl">
                    <img v-if="isImage(reply.mediaUrl)" :src="reply.mediaUrl" class="media" />
                    <video
                      v-if="isVideo(reply.mediaUrl)"
                      :src="reply.mediaUrl"
                      controls
                      class="media"
                    ></video>
                    <img v-if="isGif(reply.mediaUrl)" :src="reply.mediaUrl" class="media" />
                  </div>

                  <div class="comment-actions">
                    <button v-if="user?.uid === reply.userId" @click="confirmDelete(reply.id)">
                      Xóa
                    </button>
                    <button v-if="user?.uid !== reply.userId" @click="replyToComment(reply.id)">
                      Trả lời
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <!-- Nút để chuyển đổi trạng thái hiển thị phản hồi -->
          <button v-if="c.replies.length > 0" @click="toggleReplies(c.id)">
            {{ c.showReplies ? 'Ẩn phản hồi' : 'Xem ' + c.replies.length + ' phản hồi' }}
          </button>

          <!-- Khung trả lời -->
          <div v-if="isReplyingToCommentId === c.id" class="reply-box">
            <textarea v-model="replyText" placeholder="Nhập trả lời..."></textarea>
            <button @click="submitReply(c.id)">Gửi trả lời</button>
            <button @click="cancelReply">Hủy</button>
          </div>
        </li>
      </ul>

      <div v-if="isPreviewVisible" class="preview-box">
        <h4>Preview:</h4>
        <div class="preview-content">
          <img
            :src="user?.photoURL || 'default-avatar-url'"
            alt="User Avatar"
            class="preview-avatar"
          />
          <p>{{ previewText }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  getAuth,
  GithubAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { app } from '../../firebase.js'
import { formatDistanceToNow } from 'date-fns'
import { getDoc } from 'firebase/firestore'
import { updateDoc } from 'firebase/firestore'

const currentCategory = ref('Cảm xúc') // Mặc định là "Cảm xúc"

const emojiPickerVisible = ref(false) // Hiển thị bảng emoji
// Tổng số trang
const totalPages = computed(() => {
  return Math.ceil(emojis[currentCategory.value].length / emojisPerPage)
})
const currentPage = ref(1) // Mặc định là trang 1
const emojisPerPage = 30 // Số emoji mỗi trang
// Danh sách emoji cần hiển thị trong trang hiện tại
const currentPageEmojis = computed(() => {
  const startIndex = (currentPage.value - 1) * emojisPerPage
  const endIndex = startIndex + emojisPerPage
  return emojis[currentCategory.value].slice(startIndex, endIndex)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const comment = ref('')
// Danh sách emoji
const emojis = {
  'Cảm xúc': [
    '😊',
    '😂',
    '😍',
    '🥺',
    '😎',
    '😢',
    '😜',
    '😇',
    '😝',
    '😏',
    '🤗',
    '😻',
    '😽',
    '🤔',
    '🤩',
    '🥳',
    '🙃',
    '🤤',
    '😈',
    '💀',
    '😤',
    '😡',
    '😶',
    '🥴',
    '😷',
    '😑',
    '😓',
    '😕',
    '😶‍🌫️',
    '🥰',
    '😬',
    '🤯',
    '😳',
    '😒',
    '😱',
    '😌',
    '🤪',
    '😪',
    '🤧',
    '🤫',
    '🤭',
    '😋',
    '🤠',
    '🥺',
    '😇',
  ],

  'Động vật': [
    '🐶',
    '🐱',
    '🐭',
    '🐹',
    '🐰',
    '🦊',
    '🐻',
    '🐼',
    '🦁',
    '🐯',
    '🐨',
    '🐮',
    '🐷',
    '🐸',
    '🐵',
    '🙈',
    '🙉',
    '🙊',
    '🦄',
    '🐧',
    '🐦',
    '🐤',
    '🐣',
    '🦉',
    '🦆',
    '🐺',
    '🐗',
    '🐴',
    '🐢',
    '🦎',
    '🐍',
    '🦋',
    '🐝',
    '🐞',
    '🦗',
    '🦀',
    '🐘',
    '🐆',
    '🦓',
    '🐅',
    '🦒',
    '🐏',
    '🦙',
    '🦇',
    '🐉',
    '🦢',
    '🦃',
  ],

  'Thực phẩm': [
    '🍕',
    '🍩',
    '🍎',
    '🥑',
    '🍓',
    '🍉',
    '🍇',
    '🍒',
    '🍍',
    '🍫',
    '🍔',
    '🍟',
    '🍪',
    '🍦',
    '🍰',
    '🍿',
    '🥞',
    '🥧',
    '🍽️',
    '🍺',
    '🍻',
    '🥂',
    '🍷',
    '🍸',
    '🍹',
    '🍷',
    '🥃',
    '🍾',
    '🍽️',
    '🍴',
    '🌮',
    '🍣',
    '🍜',
    '🥗',
    '🍲',
    '🍝',
    '🍔',
    '🥪',
    '🥨',
    '🍥',
    '🥒',
    '🍠',
    '🍝',
    '🍅',
    '🌯',
    '🥙',
    '🍍',
    '🍒',
    '🍑',
    '🍋',
    '🍊',
    '🍏',
    '🍌',
    '🍍',
    '🍈',
    '🥥',
    '🍍',
    '🍑',
  ],

  'Hoạt động': [
    '⚽',
    '🏀',
    '🏈',
    '⚾',
    '🎾',
    '🏐',
    '🏉',
    '🎱',
    '🎮',
    '🎲',
    '🎯',
    '🏆',
    '🎻',
    '🎸',
    '🎧',
    '🎷',
    '🎺',
    '🥁',
    '🏅',
    '🏋️‍♀️',
    '🏃‍♀️',
    '🏃‍♂️',
    '🚴‍♀️',
    '🚴‍♂️',
    '🏇',
    '🤺',
    '🤾‍♀️',
    '🤾‍♂️',
    '🏄‍♀️',
    '🏄‍♂️',
    '🚣‍♀️',
    '🚣‍♂️',
    '🤽‍♀️',
    '🤽‍♂️',
    '🤸‍♀️',
    '🤸‍♂️',
    '🤾‍♀️',
    '🤾‍♂️',
    '🚶‍♀️',
    '🚶‍♂️',
    '🧘‍♀️',
    '🧘‍♂️',
    '⛷️',
    '🏌️‍♀️',
    '🏌️‍♂️',
    '🏊‍♀️',
    '🏊‍♂️',
    '🥋',
    '🏆',
    '🎯',
    '🛹',
    '🛶',
    '🚴‍♀️',
    '🚴‍♂️',
    '🏂',
    '⛹️‍♀️',
    '⛹️‍♂️',
    '🧗‍♀️',
    '🧗‍♂️',
    '🤼‍♀️',
    '🤼‍♂️',
    '🎲',
    '🎯',
    '🧘‍♀️',
    '🧘‍♂️',
    '🎽',
    '🚴‍♀️',
    '🚴‍♂️',
    '🏌️‍♀️',
    '🏌️‍♂️',
    '🕹️',
    '🎮',
    '👾',
    '🖥️',
    '💻',
    '🎧',
    '💥',
    '🌸',
    '⚔️',
    '🗡️',
    '🛡️',
    '👑',
    '👘',
    '🦸‍♂️',
    '🦸‍♀️',
    '🦹‍♂️',
    '🦹‍♀️',
    '👨‍🚀',
    '👩‍🚀',
    '🐉',
    '🦄',
    '👾',
    '🧛‍♂️',
    '🧛‍♀️',
    '👻',
    '🎤',
    '🎬',
    '🍥',
    '🍣',
    '🍜',
    '🍱',
    '🥡',
    '🍡',
    '🦁',
    '🦖',
    '🦥',
    '🦛',
    '🐒',
    '🦆',
    '🐺',
    '🦦',
    '🐅',
    '🐍',
    '🦄',
    '🦋',
    '🐞',
    '🦗',
    '🐝',
    '🐜',
  ],

  'Giao thông': [
    '🚗',
    '🚙',
    '🚕',
    '🚓',
    '🚑',
    '🚒',
    '🚐',
    '🚚',
    '🚛',
    '🚜',
    '🏎️',
    '🚏',
    '🚦',
    '🚧',
    '⛔',
    '🚏',
    '🛣️',
    '🛤️',
    '🚢',
    '🚤',
    '⛴️',
    '🛳️',
    '🚢',
    '⛵',
    '🛶',
    '🚆',
    '🚇',
    '🚂',
    '🚊',
    '🛴',
    '🚲',
    '🛹',
    '🚞',
    '🚈',
    '🛩️',
    '✈️',
    '🚁',
    '🛫',
    '🛬',
    '🚟',
    '🚠',
    '🚡',
    '🛩️',
    '🛰️',
    '🛫',
    '🛬',
  ],

  'Thiên nhiên': [
    '🌳',
    '🌴',
    '🌲',
    '🌵',
    '🌾',
    '🍃',
    '🌱',
    '🌿',
    '🍂',
    '🍃',
    '🌼',
    '🌸',
    '🌷',
    '🌺',
    '🌻',
    '🍄',
    '🌍',
    '🌎',
    '🌏',
    '🌑',
    '🌒',
    '🌓',
    '🌔',
    '🌕',
    '🌖',
    '🌗',
    '🌘',
    '🌙',
    '🌚',
    '🌛',
    '🌜',
    '🌝',
    '🌞',
    '🌛',
    '🌧️',
    '🌦️',
    '🌨️',
    '❄️',
    '🌩️',
    '⚡',
    '🔥',
    '💨',
    '🌪️',
    '🌫️',
    '🌊',
    '🏖️',
    '🏝️',
    '🏞️',
    '🌅',
    '🌄',
    '🌇',
    '🌆',
    '🌃',
    '🌉',
    '🌌',
  ],
}

// Toggle hiển thị bảng emoji
const toggleEmojiPicker = () => {
  emojiPickerVisible.value = !emojiPickerVisible.value
}

// Add emoji to comment
const addEmoji = (emoji: string) => {
  comment.value += emoji // Thêm emoji vào nội dung bình luận
  emojiPickerVisible.value = false // Đóng bảng emoji sau khi chọn
}

const isPinFormVisible = ref(false) // Kiểm tra form ghim có hiển thị hay không
const currentCommentId = ref(null) // Lưu ID của bình luận đang ghim
const pinUsername = ref('') // Tài khoản nhập vào
const pinPassword = ref('') // Mật khẩu nhập vào
const pinError = ref(false) // Kiểm tra nếu tài khoản/mật khẩu sai

// Hàm để hiển thị form nhập tài khoản/mật khẩu khi ghim
function showPinForm(commentId) {
  isPinFormVisible.value = true
  currentCommentId.value = commentId // Lưu ID của bình luận để kiểm tra
}

// Hàm để đóng form nhập tài khoản/mật khẩu
function closePinForm() {
  isPinFormVisible.value = false
  pinUsername.value = ''
  pinPassword.value = ''
  pinError.value = false
}

// Hàm để ghim bình luận
const validUsername = 'ihentai.ws' // Tài khoản hợp lệ
const validPassword = 'kimochi' // Mật khẩu hợp lệ
const validEmail = 'vuliztva1@gmail.com' // Email của bạn

// Hàm để ghim bình luận
async function pinComment(commentId) {
  // Kiểm tra nếu người dùng đã đăng nhập và có email hợp lệ
  if (user.value?.email !== validEmail) {
    alert('Bạn phải là chủ sở hữu tài khoản này mới có thể ghim bình luận!')
    return
  }

  // Kiểm tra tài khoản và mật khẩu hợp lệ
  if (pinUsername.value === validUsername && pinPassword.value === validPassword) {
    // Kiểm tra xem đã có bình luận nào được ghim chưa
    const pinnedComment = comments.value.find((c) => c.isPinned)

    // Nếu đã có bình luận ghim, báo lỗi và yêu cầu bỏ ghim bình luận trước
    if (pinnedComment) {
      alert('Bạn phải bỏ ghim bình luận trước khi ghim bình luận khác!')
      return // Không cho phép ghim nếu đã có bình luận ghim
    }

    const comment = comments.value.find((c) => c.id === commentId)

    if (comment) {
      // Đánh dấu bình luận mới là ghim
      comment.isPinned = true

      // Cập nhật Firestore để ghim bình luận mới
      await updateDoc(doc(db, 'comments', commentId), { isPinned: true })
      alert('Bình luận đã được ghim!')
    }

    closePinForm() // Đóng form sau khi ghim thành công
  } else {
    pinError.value = true // Hiển thị lỗi nếu tài khoản/mật khẩu sai
  }
}

// Hàm để bỏ ghim bình luận
async function unpinComment(commentId) {
  const comment = comments.value.find((c) => c.id === commentId)
  if (comment) {
    comment.isPinned = false // Bỏ ghim bình luận
    // Cập nhật trạng thái bỏ ghim vào Firestore
    await updateDoc(doc(db, 'comments', commentId), {
      isPinned: false,
    })
    alert('Bình luận đã được bỏ ghim!')
  }
}

// Sắp xếp bình luận: ghim lên đầu tiên
const sortedComments = computed(() => {
  if (sortOrder.value === 'oldest') {
    return [...comments.value].sort((a, b) => a.createdAt - b.createdAt)
  } else {
    // Sắp xếp bình luận ghim lên đầu tiên
    return [...comments.value]
      .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
      .sort((a, b) => b.createdAt - a.createdAt)
  }
})
const sortOrder = ref('newest') // Mặc định là sắp xếp theo "Mới nhất"
const auth = getAuth(app)
const db = getFirestore(app)
const isEditingCommentId = ref<string | null>(null) // Theo dõi bình luận đang chỉnh sửa
const user = ref<any | null>(null)

const comments = ref<any[]>([])
const mediaUrl = ref('') // For media URL input
const previewText = ref('')
const isPreviewVisible = ref(false)
const replyText = ref('')
const isReplyingToCommentId = ref<string | null>(null)
const toggleReplies = (commentId) => {
  const comment = comments.value.find((c) => c.id === commentId)
  if (comment) {
    comment.showReplies = !comment.showReplies // Chuyển đổi trạng thái hiển thị của các phản hồi cho bình luận này
  }
}
const sortedCommentsList = computed(() => {
  // Phân tách bình luận ghim và không ghim
  const pinnedComments = comments.value.filter((comment) => comment.isPinned)
  const nonPinnedComments = comments.value.filter((comment) => !comment.isPinned)

  // Sắp xếp bình luận ghim theo thời gian tạo (mới nhất trước) hoặc cũ nhất
  pinnedComments.sort((a, b) => b.createdAt - a.createdAt)

  // Sắp xếp bình luận không ghim theo thời gian tạo (mới nhất trước) hoặc cũ nhất
  nonPinnedComments.sort((a, b) => b.createdAt - a.createdAt)

  // Nếu chọn "Cũ nhất", đảo ngược thứ tự của các bình luận không ghim
  if (sortOrder.value === 'oldest') {
    nonPinnedComments.reverse() // Đảo ngược để sắp xếp theo cũ nhất
  }

  // Kết hợp bình luận ghim và bình luận không ghim
  return [...pinnedComments, ...nonPinnedComments]
})

function signInWithGitHub() {
  const provider = new GithubAuthProvider()
  signInWithPopup(auth, provider).catch((err) => alert('Đăng nhập lỗi: ' + err.message))
}
async function submitEditComment(commentId: string) {
  if (!comment.value.trim()) return // Kiểm tra nếu không có nội dung bình luận

  try {
    const commentRef = doc(db, 'comments', commentId) // Lấy tham chiếu bình luận cần chỉnh sửa

    // Kiểm tra xem bình luận có tồn tại trong cơ sở dữ liệu không
    const commentDoc = await getDoc(commentRef)
    if (!commentDoc.exists()) {
      alert('Bình luận không tồn tại!')
      return
    }

    // Cập nhật bình luận trong cơ sở dữ liệu
    await updateDoc(commentRef, {
      text: comment.value.trim(),
      updatedAt: new Date(), // Thêm thời gian chỉnh sửa
    })

    // Sau khi cập nhật, reset trạng thái
    isEditingCommentId.value = null // Đặt lại trạng thái chỉnh sửa
    comment.value = '' // Reset nội dung textarea
    alert('Bình luận đã được chỉnh sửa thành công!') // Thông báo khi chỉnh sửa
  } catch (err) {
    alert('Sửa bình luận lỗi: ' + err.message) // Thông báo lỗi nếu có
  }
}

function sortComments() {}
function editComment(commentId: string) {
  const commentToEdit = comments.value.find((c) => c.id === commentId)
  if (commentToEdit) {
    comment.value = commentToEdit.text // Điền sẵn nội dung vào textarea
    isEditingCommentId.value = commentId // Đánh dấu bình luận đang được chỉnh sửa
  }
}
function cancelEdit() {
  isEditingCommentId.value = null
  comment.value = ''
}

function signOut() {
  firebaseSignOut(auth)
    .then(() => {
      user.value = null // Đặt lại user sau khi đăng xuất
      alert('Đăng xuất thành công!')
    })
    .catch((err) => {
      alert('Lỗi đăng xuất: ' + err.message)
    })
}
async function submitComment() {
  if (!comment.value.trim()) return
  try {
    const docRef = await addDoc(collection(db, 'comments'), {
      userId: user.value ? user.value.uid : 'anonymous', // Dùng ID ẩn danh khi chưa đăng nhập
      userName: user.value ? user.value.displayName : 'Người dùng ẩn danh', // Tên ẩn danh nếu chưa đăng nhập
      userAvatar: user.value ? user.value.photoURL : 'default-avatar-url', // Avatar ẩn danh nếu chưa đăng nhập
      text: comment.value.trim(),
      createdAt: new Date(),
      parentId: null, // Bình luận gốc
      replies: [], // Mảng trả lời
      mediaUrl: mediaUrl.value ? mediaUrl.value.trim() : null, // Store media URL if exists
    })
    comment.value = ''
    mediaUrl.value = ''
    previewText.value = ''
    isPreviewVisible.value = false
  } catch (err) {
    alert('Gửi bình luận lỗi: ' + err.message)
  }
}
function formatFullDate(timestamp: any) {
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })
}

function formatTime(timestamp: any) {
  return formatDistanceToNow(new Date(timestamp.seconds * 1000), { addSuffix: true })
}

function togglePreview() {
  isPreviewVisible.value = !isPreviewVisible.value
}

async function deleteComment(commentId: string) {
  if (!user.value) {
    alert('Bạn cần đăng nhập để xóa bình luận.')
    return
  }

  if (!commentId) {
    alert('Không thể xóa bình luận, không tìm thấy ID bình luận.')
    return
  }

  try {
    const commentRef = doc(db, 'comments', commentId)
    const commentDoc = await getDoc(commentRef)

    // Kiểm tra xem người dùng có phải là chủ sở hữu của bình luận hay không
    if (commentDoc.exists() && commentDoc.data().userId === user.value.uid) {
      await deleteDoc(commentRef)
      alert('Bình luận đã bị xóa thành công.')
    } else {
      alert('Bạn không có quyền xóa bình luận này.')
    }
  } catch (err) {
    alert('Xóa bình luận thất bại: ' + err.message)
  }
}

async function confirmDelete(commentId: string) {
  if (confirm('Bạn có chắc chắn muốn xóa bình luận này không?')) {
    await deleteComment(commentId)
  }
}
function replyToComment(commentId: string) {
  // Kiểm tra xem người dùng đã đăng nhập hay chưa
  if (!user.value) {
    alert('Bạn phải đăng nhập để trả lời bình luận!')
    return // Nếu chưa đăng nhập, dừng lại không cho phép trả lời
  }

  isReplyingToCommentId.value = commentId
  replyText.value = '' // Đặt lại phần trả lời mỗi khi nhấn trả lời
}
async function submitReply(parentId: string) {
  if (!replyText.value.trim()) return

  try {
    await addDoc(collection(db, 'comments'), {
      userId: user.value.uid,
      userName: user.value.displayName || 'Người dùng ẩn danh',
      userAvatar: user.value.photoURL,
      text: replyText.value.trim(),
      createdAt: new Date(),
      parentId: parentId, // Trả lời bình luận này
      mediaUrl: mediaUrl.value ? mediaUrl.value.trim() : null, // Handle media for replies
    })

    replyText.value = ''
    isReplyingToCommentId.value = null // Reset khi trả lời xong
  } catch (err) {
    alert('Gửi trả lời lỗi: ' + err.message)
  }
}

function cancelReply() {
  isReplyingToCommentId.value = null
  replyText.value = ''
}

function embedMedia() {
  if (mediaUrl.value) {
    const url = mediaUrl.value.trim()
    if (url) {
      // Validate URL to ensure it's a valid image, gif, or video URL
      const validImageUrl = /\.(jpg|jpeg|png|gif)$/i.test(url)
      const validVideoUrl = /\.(mp4|webm|ogg)$/i.test(url)
      const validGifUrl = /\.gif$/i.test(url)

      if (validImageUrl || validVideoUrl || validGifUrl) {
        // Store the media URL in comment
        mediaUrl.value = url
      } else {
        alert('Invalid media URL. Please use a valid image, gif, or video URL.')
      }
    }
  }
}

function isImage(url: string) {
  return /\.(jpg|jpeg|png)$/i.test(url)
}

function isVideo(url: string) {
  return /\.(mp4|webm|ogg)$/i.test(url)
}

function isGif(url: string) {
  return /\.gif$/i.test(url)
}

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      // Kiểm tra nếu displayName là null, thay thế bằng tên mặc định
      user.value = currentUser
      user.value.displayName = currentUser.displayName || 'Người dùng ẩn danh' // Tên mặc định
      user.value.photoURL = currentUser.photoURL // URL GitHub của người dùng (hoặc link khác nếu bạn dùng API GitHub)
    }
  })
  const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'))
  onSnapshot(q, (snapshot) => {
    comments.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    comments.value.forEach((comment) => {
      comment.replies = comments.value.filter((c) => c.parentId === comment.id)
    })
  })
})
</script>
<style scoped>
.github-login-comment {
  max-width: 900px;
  margin: auto;
  padding: 30px;
  background-color: #1e1e1e;
  border-radius: 10px;
  color: white;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
}
/* Khu vực đăng nhập */
.login-area {
  text-align: center;
  margin-bottom: 20px;
}
.textarea-wrapper {
  position: relative; /* Để có thể đặt icon mặt cười ở vị trí bên trong */
  width: 100%;
}
/* Textarea */
textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #444;
  border-radius: 8px;
  resize: none;
  background-color: #333;
  color: white;
  font-size: 14px;
}

textarea:disabled {
  background-color: #555;
}
/* Nhóm nút (buttons) */
.button-group {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}
.submit-button,
.preview-button,
.login-button {
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.submit-button {
  background-color: #4caf50;
  color: white;
}

.preview-button {
  background-color: #555;
  color: white;
}

.login-button {
  background-color: #007bff;
  color: white;
}
.submit-button:disabled,
.preview-button:disabled,
.login-button:disabled {
  background-color: #888;
  cursor: not-allowed;
}

.submit-button:hover,
.preview-button:hover,
.login-button:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
.comment-area {
  margin-top: 30px;
}

/* Khu vực thông tin người dùng */
.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px;
}

.user-info p {
  margin-right: 10px; /* Thêm margin cho phần tử <p> */
}
.user-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin-right: 15px;
}
.logout-button {
  background-color: #f44336;
  color: white;
  padding: 7px 15px;
  border-radius: 5px;
  cursor: pointer;
}
.comment {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
  background-color: #333;
  padding: 15px;
  border-radius: 8px;
  transition: background-color 0.3s;
}
.comment:hover {
  background-color: #444;
}
.comment-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 15px;
}
.comment-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.comment-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
}
.comment-actions button {
  background: transparent;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.3s;
}
.comment-actions button:hover {
  color: #00bfff;
}
.comment-time {
  font-size: 12px;
  color: #888;
  margin-top: 5px;
}
.preview-box {
  background-color: #333;
  padding: 15px;
  margin-top: 20px;
  border-radius: 8px;
}
.preview-content {
  display: flex;
  align-items: center;
}
.preview-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 15px;
}
h3 {
  margin-top: 20px;
  font-size: 18px;
}
ul {
  padding-left: 0;
}
li {
  list-style: none;
  margin-bottom: 15px;
}
.reply-box {
  margin-top: 15px;
  padding: 12px;
  background-color: #444;
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
.replies-list {
  margin-top: 15px;
  padding-left: 20px;
  border-left: 2px solid #555;
}
.media {
  max-width: 100%;
  max-height: 400px; /* or any size that fits your layout */
  object-fit: contain; /* ensures the image fits within the container without distortion */
}
.comment-time {
  font-size: 12px;
  color: #888;
  margin-top: 5px;
}
.edit-time {
  font-size: 12px;
  color: #888;
  line-height: 3;
}
.edit-box {
  margin-top: 20px;
  background-color: #444;
  padding: 15px;
  border-radius: 8px;
}
/* Cải tiến giao diện */
.sorting-options {
  position: relative;
  display: inline-block;
}

.sort-label {
  font-size: 16px;
  color: white;
  margin-right: 10px;
  font-weight: bold;
}

.sort-dropdown {
  padding: 10px 15px;
  background-color: #333;
  color: white;
  border: 1px solid #444;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  width: 200px;
}

.sort-dropdown:hover {
  background-color: #444;
}

.sort-dropdown:focus {
  outline: none;
  border-color: #4caf50;
}

.sort-dropdown option {
  background-color: #333;
  color: white;
}

/* Áp dụng cho tùy chọn hiện tại (Khi người dùng chọn "Mới nhất" hoặc "Cũ nhất") */
.sort-dropdown option:checked {
  background-color: aqua;
  color: white;
}
/* Form nhập tài khoản và mật khẩu */
.pin-form {
  background-color: blanchedalmond;
  padding: 20px;
  border-radius: 8px;
  margin-top: 10px;
}

.pin-form input {
  width: 80%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: #444;
  color: white;
  border: 1px solid #555;
}

.pin-form button {
  width: 40%;
  padding: 10px;
  margin: 5px;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.pin-form button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  font-size: 14px;
}

/* Đảm bảo các phần khác không bị ảnh hưởng */
.comment-actions button {
  background: transparent;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.3s;
}
.comment-actions button:hover {
  color: #00bfff;
}
.pinned-label {
  margin-top: 10px;
  font-size: 15px;
  color: #4caf50; /* Màu xanh lá cho nhãn ghim */
  background-color: #333;
  padding: 2px 5px;
  font-weight: bold;
}
.emoji-btn {
  position: absolute;
  right: 10px;
  top: 40%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #f0c674; /* Bạn có thể thay đổi màu */
}
.emoji-picker {
  position: absolute;
  top: 40px; /* Điều chỉnh khoảng cách từ textarea */
  right: 0; /* Đặt emoji picker ở bên phải của textarea */
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-wrap: wrap; /* Đảm bảo emoji xuống dòng khi hết không gian */
  gap: 10px;
  z-index: 1000;
  padding-top: 30px; /* Điều chỉnh khoảng cách trên của bảng emoji */
  padding-right: 30px; /* Điều chỉnh khoảng cách phải */
  width: 300px;
}

.emoji-picker button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  width: 40px; /* Kích thước của mỗi emoji */
  height: 40px; /* Kích thước của mỗi emoji */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px; /* Đảm bảo khoảng cách giữa các emoji khi xuống dòng */
}

.emoji-picker button:nth-child(n + 7) {
  margin-top: 10px; /* Khi có nhiều hơn 6 emoji, chúng sẽ xuống hàng */
}

.comment-area {
  position: relative;
}

button {
  padding: 10px;
  margin: 5px;
  border-radius: 8px;
  cursor: pointer;
}

.close-emoji-picker {
  position: absolute;
  top: 10px; /* Cách từ trên xuống */
  right: 10px; /* Cách từ phải vào */
  background: none;
  border: none;
  font-size: 20px;
  color: #000;
  cursor: pointer;
}
.close-emoji-picker:hover {
  color: #ff0000; /* Đổi màu khi hover */
}
.emoji-categories {
  display: flex;
  flex-wrap: wrap; /* Cho phép các phần tử xuống dòng khi hết không gian */
  gap: 10px; /* Khoảng cách giữa các nút */
  justify-content: flex-start; /* Đảm bảo các nút canh lề trái */
  margin-bottom: 10px; /* Thêm khoảng cách dưới cùng để không bị dính các phần tử dưới */
}

.emoji-categories button {
  padding: 6px 12px; /* Giảm padding để nút nhỏ hơn */
  background-color: #333;
  color: white;
  border: 1px solid #444;
  border-radius: 15px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
  white-space: nowrap; /* Đảm bảo văn bản không bị cắt ngắn */
  flex: 0 1 33%; /* Mỗi nút chiếm 20% chiều rộng */
  box-sizing: border-box; /* Đảm bảo padding không làm nút vượt ra ngoài */
  text-align: center;
}

.emoji-categories button:hover {
  background-color: blue;
}

.emoji-categories button:active {
  background-color: #666;
}

.page-buttons {
  display: flex;
  justify-content: center;
  gap: 15px; /* Khoảng cách giữa các nút */
  margin-top: 20px; /* Khoảng cách trên */
}

.page-buttons button {
  padding: 10px 20px;
  background-color: #007bff; /* Màu nền nút */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, transform 0.2s; /* Thêm hiệu ứng chuyển đổi */
}

.page-buttons button:hover {
  background-color: #0056b3; /* Màu nền khi hover */
  transform: translateY(-2px); /* Hiệu ứng nhấc nút khi hover */
}

.page-buttons button:disabled {
  background-color: #888; /* Màu nền khi nút bị vô hiệu hóa */
  cursor: not-allowed; /* Thay đổi con trỏ khi vô hiệu hóa */
}

.page-buttons button:disabled:hover {
  transform: none; /* Không có hiệu ứng khi hover khi nút bị vô hiệu hóa */
}
</style>
