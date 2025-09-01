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
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['link', { rel: 'stylesheet', href: 'https://unpkg.com/gitalk/dist/gitalk.css' }],
    ['script', { src: 'https://unpkg.com/gitalk/dist/gitalk.min.js' }],
    [
      'link',
      { rel: 'stylesheet', href: '/bluearchive/font/Blueaka/Blueaka.css' },
    ],
    [
      'link',
      { rel: 'stylesheet', href: '/bluearchive/font/Blueaka_Bold/Blueaka_Bold.css' },
    ],
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.css' }],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js' }],
  ],
  ignoreDeadLinks: true,
  sitemap: {
    hostname: 'https://manhwa-academy.github.io/bluearchive/',
  },
  title: "Sensei's 部落格",
  description: "Sensei's 部落格",
  themeConfig: {
    menuList: [
      { name: '首页', url: '/' },      // Trang chủ
      { name: '标签', url: '/tags/' }, // Trang tags
    ],
    videoBanner: false,
    name: "Sensei's 部落格",
    welcomeText: 'Hello, VitePress',
    motto: ['和你的日常，就是奇迹', '何気ない日常で、ほんの少しの奇跡を見つける物語。'],
    social: [
      { icon: 'github', url: 'https://github.com/' },
      { icon: 'bilibili', url: 'https://www.bilibili.com/' },
      { icon: 'qq', url: 'https://im.qq.com/index/' },
      { icon: 'wechat', url: 'https://weixin.qq.com/' },
    ],
    spineVoiceLang: 'jp',
    footerName: 'Sensei',
    poweredList: [
      { name: 'VitePress', url: 'https://github.com/vuejs/vitepress' },
      { name: 'GitHub Pages', url: 'https://docs.github.com/zh/pages' },
    ],
    clientID: 'Ov23lia9U9wFN3WMyoKK',
    clientSecret: 'b2418ab598c188c43a247c99e728dd2735d58c3b',
    repo: 'vitepress-theme-bluearchive',
    owner: 'Alittfre',
    admin: ['Alittfre'],
  },
  markdown: {
    theme: 'solarized-dark',
    lineNumbers: true,
    math: true,
    config: (md) => {
      md.use(mdItCustomAttrs, 'image', {
        'data-fancybox': 'gallery',
      })
    },
  },
})
