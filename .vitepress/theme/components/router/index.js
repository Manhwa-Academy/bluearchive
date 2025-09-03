import { createRouter, createWebHistory } from 'vue-router'

// Import các component tương ứng với các route
import Home from '../views/Home.vue'
import UserProfile from '../components/UserProfile.vue'
import NotFound from '../components/NotFound.vue'

// Cấu hình các route cho ứng dụng
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/user-profile',
    name: 'UserProfile',
    component: UserProfile,
  },
  {
    path: '/:pathMatch(.*)*', // Đây là route cho các trang không tìm thấy
    name: 'NotFound',
    component: NotFound,
  },
]

// Tạo router và cấu hình các routes
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Thiết lập lịch sử trình duyệt
  routes, // Routes đã cấu hình
})

export default router
