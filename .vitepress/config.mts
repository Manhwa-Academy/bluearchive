import { defineConfigWithTheme } from 'vitepress'
import mdItCustomAttrs from 'markdown-it-custom-attrs'

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
  base: '/bluearchive/', // Cấu hình base cho GitHub Pages
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

  ignoreDeadLinks: true,
  sitemap: {
    hostname: 'https://manhwa-academy.github.io/bluearchive/',
  },

  title: 'Blog của Sensei',
  description: 'Blog của Sensei',
  themeConfig: {
    menuList: [
      { name: 'Trang chủ', url: '' }, // Trang chủ (sử dụng trống thay vì '/')
      { name: 'Thẻ', url: '/tags/' }, // Trang tags
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
    clientID: 'Ov23lia9U9wFN3WMyoKK',
    clientSecret: 'b2418ab598c188c43a247c99e728dd2735d58c3b',
    repo: 'bluearchive',
    owner: 'Alittfre',
    admin: ['Alittfre'],
  },
})
