import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'
import { createMarkdownRenderer } from 'vitepress'

// ES模块需要重新声明常量
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const cwd = process.cwd()

let id = 1

interface Post {
  id: number
  title: string
  content: string
  href: string
  create: number
  update: number
  tags?: string[]
  wordCount: number
  cover?: string
  excerpt: string | undefined
  pinned?: boolean
}

// Post数据缓存
const cache: Map<string, { timestamp: number; post: Post }> = new Map()

// ✅ Hàm tính số từ chính xác
function countWords(text: string): number {
  const plainText = text.replace(/<[^>]+>/g, '') // Loại bỏ thẻ HTML nếu có
  // Bắt tất cả các từ, kể cả tiếng Việt, Trung, số, chữ latin có dấu
  const words = plainText.match(/\p{L}[\p{L}\p{Mn}\p{Pd}']*/gu)
  return words ? words.length : 0
}

// Tạo Post object từ file
function getPost(md: any, file: string, postDir: string): Post {
  const fullPath = path.join(postDir, file)
  const timestamp = Math.floor(fs.statSync(fullPath).mtimeMs)

  // Trả cache nếu tồn tại
  const cached = cache.get(fullPath)
  if (cached && timestamp === cached.timestamp) {
    return cached.post
  }

  const src = fs.readFileSync(fullPath, 'utf-8')
  const { data, excerpt, content } = matter(src, { excerpt: true })

  const post: Post = {
    id: id++,
    title: data.title,
    content: content,
    href: `posts/${file.replace(/\.md$/, '.html')}`,
    create: +(new Date(data.date) || timestamp),

    // 🕒 update là thời gian build
    update: Date.now(),

    tags: data.tags,
    wordCount: countWords(content), // <-- Gọi hàm đúng ở đây
    cover: data.cover,
    excerpt: excerpt,
    pinned: !!data.pinned,
  }

  cache.set(fullPath, { timestamp, post })
  return post
}

// 加载posts文件夹
async function load() {
  const md = await createMarkdownRenderer(cwd)
  const postDir = path.join(cwd, 'posts')
  return fs
    .readdirSync(postDir)
    .filter((file) => file.endsWith('.md') && file !== 'index.md')
    .map((file) => getPost(md, file, postDir))
    .sort((a, b) => {
      // 先按置顶排序，再按创建时间排序
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return b.create - a.create
    })
}

export default {
  watch: path.relative(__dirname, cwd + '/posts/*.md').replace(/\\/g, '/'),
  load,
}
