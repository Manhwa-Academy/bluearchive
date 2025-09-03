// firebase.js
import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyB-R4WayoCa7HpSrqejUNZQifgj-dyGnLs',
  authDomain: 'bluearchive-bd1fe.firebaseapp.com',
  projectId: 'bluearchive-bd1fe',
  storageBucket: 'bluearchive-bd1fe.firebasestorage.app',
  messagingSenderId: '654264348207',
  appId: '1:654264348207:web:a8830eb6ffc47c3d6560da',
  measurementId: 'G-D52YJDV28P',
}

// Khởi tạo Firebase
export const app = initializeApp(firebaseConfig)

// Khởi tạo Firebase Analytics chỉ trong môi trường trình duyệt
let analytics = null
if (typeof window !== 'undefined' && isSupported()) {
  analytics = getAnalytics(app)
}

export { analytics }
