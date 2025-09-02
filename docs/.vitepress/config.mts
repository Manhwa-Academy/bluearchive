import { defineConfigWithTheme } from 'vitepress'
import mdItCustomAttrs from 'markdown-it-custom-attrs'

const clientID = 'Iv23liKzdyZO3e57Ikgh'
const clientSecret = '2638fb185ac9472900467fa3561ad78aef3cdbac' // Đây là Client Secret mới

export interface ThemeConfig {
  menuList: { name: string; url: string }[]
  videoBanner: boolean
  name: string
  welcomeText: string
  motto: string[]
  social: { icon: string; url: string }[]
  spineVoiceLang: 'zh' | 'jp'
  footerName: string
  poweredList: { name: string; url: string }[]
  repo: string
  owner: string
  admin: string[]
}

export default defineConfigWithTheme<ThemeConfig>({
  lang: 'zh-CN',
  ignoreDeadLinks: true,
  base: '/bluearchive/',
  cleanUrls: false, // ✅ Thêm để tránh lỗi 404 khi vào các path như /tags/

  head: [
    ['link', { rel: 'shortcut icon', href: '/bluearchive/favicon.ico' }],
    ['link', { rel: 'stylesheet', href: 'https://unpkg.com/gitalk/dist/gitalk.css' }],
    ['script', { src: 'https://unpkg.com/gitalk/dist/gitalk.min.js' }],
    ['link', { rel: 'stylesheet', href: '/bluearchive/font/Blueaka/Blueaka.css' }],
    ['link', { rel: 'stylesheet', href: '/bluearchive/font/Blueaka_Bold/Blueaka_Bold.css' }],
    [
      'link',
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.css' },
    ],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js' }],
  ],

  sitemap: {
    hostname: 'https://manhwa-academy.vercel.app/', // ✅ Đổi đúng hostname
  },

  title: 'Blog của Sensei',
  description: 'Blog của Sensei',
  themeConfig: {
    menuList: [
      { name: 'Trang chủ', url: '' },
      { name: 'Thẻ', url: '/tags/' },
    ],
    videoBanner: false,
    name: 'Blog của Sensei',
    welcomeText: 'Hello, Sensei',
    motto: ['Con người chỉ là công cụ, chiến thắng là tất cả.'],
    social: [
      { icon: 'github', url: 'https://github.com/Manhwa-Academy/bluearchive' },
      { icon: 'bilibili', url: 'https://www.facebook.com/Shiroko412' },
      { icon: 'qq', url: 'https://zalo.me/0332138297' },
      { icon: 'wechat', url: 'mailto:vuliztva1@gmail.com' },
    ],
    spineVoiceLang: 'jp',
    footerName: 'Sensei',
    poweredList: [
      { name: 'Manhwa-Academy', url: 'https://github.com/Manhwa-Academy' },
      { name: 'GitHub', url: 'https://github.com/Manhwa-Academy/bluearchive' },
    ],
    repo: 'bluearchive',
    owner: 'Manhwa-Academy',
    admin: ['Manhwa-Academy'],
  },
  markdown: {
    theme: 'solarized-dark',
    lineNumbers: true,
    math: true,
    config: (md) => {
      // use more markdown-it plugins!
      md.use(mdItCustomAttrs, 'image', {
        'data-fancybox': 'gallery',
      })
    },
  },
})
