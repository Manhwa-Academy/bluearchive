import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDir = path.resolve(process.cwd(), 'posts')

function updateDates() {
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))

  files.forEach(file => {
    const filePath = path.join(postsDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data, content: mdContent } = matter(content)

    // Lấy ngày hôm nay dạng YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0]

    // Nếu date không bằng ngày hôm nay thì cập nhật
    if (data.date !== today) {
      data.date = today
      const newMd = matter.stringify(mdContent, data)
      fs.writeFileSync(filePath, newMd, 'utf-8')
      console.log(`Updated date for ${file} to ${today}`)
    }
  })
}

updateDates()
