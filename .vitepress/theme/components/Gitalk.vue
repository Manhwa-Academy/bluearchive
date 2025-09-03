<template>
  <div class="github-login-comment">
    <div class="login-area" v-if="!user">
      <textarea v-model="comment" placeholder="Nhập bình luận..." disabled></textarea>
      <button class="login-button" @click="signInWithGitHub">Login with GitHub</button>
      <br /><br />
      <button class="preview-button" :disabled="!comment.trim()">Preview</button>
    </div>

    <!-- Khi người dùng đã đăng nhập, hiển thị thông báo đăng nhập thành công -->
    <div v-if="isLoggedIn" class="login-success-message">
      <p>Đăng nhập thành công!</p>
    </div>

    <div class="comment-area">
      <div v-if="user">
        <div class="user-info">
          <img
            :src="user?.photoURL || 'default-avatar-url'"
            alt="User Avatar"
            class="user-avatar"
            @click="getGitHubInfo"
          />
          <p>Xin chào, {{ user?.displayName || 'Người dùng ẩn danh' }}</p>
          <button class="logout-button" @click="signOut">Đăng xuất</button>
        </div>

        <!-- Hiển thị thông tin GitHub khi nhấn vào avatar -->
        <div v-if="githubUserInfo" class="github-info">
          <p>Tên GitHub: {{ githubUserInfo.login }}</p>
          <p>Số lượng Repository: {{ githubUserInfo.public_repos }}</p>
          <p>
            URL GitHub:
            <a :href="githubUserInfo.html_url" target="_blank">{{ githubUserInfo.html_url }}</a>
          </p>
        </div>

        <textarea v-model="comment" placeholder="Nhập bình luận..." :disabled="!user"></textarea>

        <!-- Media Input -->
        <div class="media-input">
          <input
            v-model="mediaUrl"
            type="text"
            placeholder="Insert image, gif, or video URL"
            @keydown.enter.prevent="embedMedia"
          />
          <br /><br />
          <button @click="embedMedia">Embed Media</button>
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

      <h3>Bình luận đã gửi ({{ comments.length }}):</h3>
      <ul>
        <div
          v-for="(c, index) in comments.filter((comment) => !comment.parentId)"
          :key="index"
          class="comment-item"
        >
          <div class="comment">
            <img :src="c.userAvatar || 'default-avatar-url'" alt="Avatar" class="comment-avatar" />
            <div class="comment-content">
              <strong>{{ c.userName || 'Người dùng ẩn danh' }}</strong>
              <span class="comment-time"> ({{ formatFullDate(c.createdAt) }}) </span>
              <p>{{ c.text }}</p>

              <!-- Render Media -->
              <div v-if="c.mediaUrl">
                <img v-if="isImage(c.mediaUrl)" :src="c.mediaUrl" class="media" />
                <video v-if="isVideo(c.mediaUrl)" :src="c.mediaUrl" controls class="media"></video>
                <img v-if="isGif(c.mediaUrl)" :src="c.mediaUrl" class="media" />
              </div>

              <div class="comment-actions">
                <!-- Hiển thị nút Xóa cho người dùng đã đăng nhập và là chủ sở hữu bình luận -->
                <button v-if="user?.uid === c.userId" @click="confirmDelete(c.id)">Xóa</button>
                <button v-if="user?.uid !== c.userId" @click="replyToComment(c.id)">Trả lời</button>
              </div>
            </div>
          </div>

          <!-- Hiển thị phản hồi khi showReplies là true -->
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

          <!-- Hiển thị phần trả lời -->
          <div v-if="isReplyingToCommentId === c.id" class="reply-box">
            <textarea v-model="replyText" placeholder="Nhập trả lời..."></textarea>
            <button @click="submitReply(c.id)">Gửi trả lời</button>
            <button @click="cancelReply">Hủy</button>
          </div>
        </div>
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
import { ref, onMounted } from 'vue'
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
  getDoc,
} from 'firebase/firestore'
import { app } from '../../firebase.js'
import { formatDistanceToNow } from 'date-fns'

const auth = getAuth(app)
const db = getFirestore(app)

const user = ref<any | null>(null)
const comment = ref('')
const comments = ref<any[]>([])
const mediaUrl = ref('')
const previewText = ref('')
const isPreviewVisible = ref(false)
const replyText = ref('')
const isReplyingToCommentId = ref<string | null>(null)
const isLoggedIn = ref(false) // Trạng thái đăng nhập
const toggleReplies = (commentId: string) => {
  const comment = comments.value.find((c) => c.id === commentId)
  if (comment) {
    comment.showReplies = !comment.showReplies
  }
}

async function signInWithGitHub() {
  const provider = new GithubAuthProvider()
  try {
    await signInWithPopup(auth, provider)
    isLoggedIn.value = true // Đánh dấu là đã đăng nhập
  } catch (err) {
    alert('Đăng nhập lỗi: ' + err.message)
  }
}

function signOut() {
  firebaseSignOut(auth)
    .then(() => {
      user.value = null
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
      userId: user.value ? user.value.uid : 'anonymous',
      userName: user.value ? user.value.displayName : 'Người dùng ẩn danh',
      userAvatar: user.value ? user.value.photoURL : 'default-avatar-url',
      text: comment.value.trim(),
      createdAt: new Date(),
      parentId: null, // Bình luận gốc
      replies: [], // Mảng trả lời
      mediaUrl: mediaUrl.value ? mediaUrl.value.trim() : null,
    })
    comment.value = ''
    mediaUrl.value = ''
    previewText.value = ''
    isPreviewVisible.value = false
  } catch (err) {
    alert('Gửi bình luận lỗi: ' + err.message)
  }
}
async function getGitHubInfo() {
  if (user.value) {
    const githubUsername = user.value.displayName // Giả sử displayName là username GitHub
    try {
      const response = await fetch(`https://api.github.com/users/${githubUsername}`)
      if (response.ok) {
        githubUserInfo.value = await response.json()
      } else {
        alert('Không thể lấy thông tin GitHub.')
      }
    } catch (error) {
      console.error('Error fetching GitHub info:', error)
    }
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
  isReplyingToCommentId.value = commentId
  console.log('Replying to comment ID:', isReplyingToCommentId.value) // In giá trị vào console
  replyText.value = '' // Reset phần trả lời mỗi khi nhấn trả lời
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
      mediaUrl: mediaUrl.value ? mediaUrl.value.trim() : null,
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
      user.value = currentUser
      user.value.displayName = currentUser.displayName || 'Người dùng ẩn danh'
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
  padding: 20px;
  background-color: #1e1e1e;
  border-radius: 10px;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
.login-area {
  text-align: center;
}
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
  transition: background-color 0.3s;
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
.comment-area {
  margin-top: 30px;
}
.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.user-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin-right: 15px;
  cursor: pointer; /* Thêm cursor pointer khi hover lên avatar */
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
.github-login-comment {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  background-color: #1e1e1e;
  border-radius: 10px;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
.github-info {
  background-color: #333;
  padding: 10px;
  margin-top: 15px;
  border-radius: 5px;
}

.github-info a {
  color: #00bfff;
  text-decoration: none;
}

.github-info a:hover {
  text-decoration: underline;
}

.login-success-message {
  color: green;
  margin-bottom: 15px;
  font-weight: bold;
}
</style>
