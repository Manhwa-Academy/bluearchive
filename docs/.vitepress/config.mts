import { defineConfigWithTheme } from 'vitepress'
import mdItCustomAttrs from 'markdown-it-custom-attrs'
import Gitalk from 'gitalk'

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
  clientID: string
  clientSecret: string
  repo: string
  owner: string
  admin: string[]
}

export default defineConfigWithTheme<ThemeConfig>({
  lang: 'zh-CN',
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
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
      { name: 'Manhwa-Acedemy', url: 'https://github.com/Manhwa-Academy' },
      { name: 'GitHub ', url: 'https://github.com/Manhwa-Academy/bluearchive' },
    ],
    clientID: 'Iv23liTL4NDWi6eqWtth',
    clientSecret: 'b10c2f27c80090fb5a325e34df630ed9cf5e703c',
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
