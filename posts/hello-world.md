---
title: Xin chào thế giới
date: '2025-09-02'
tags:
  - HelloWorld
  - vue
  - bluearchive
pinned: true 
head:
  - - meta
    - name: description
      content: vitepress-theme-bluearchive HelloWorld
  - - meta
    - name: keywords
      content: vitepress theme bluearchive HelloWorld
---

Xin chào Thế Giới!

---

# Ví dụ về tiện ích mở rộng Markdown

Trang này giới thiệu một số tiện ích mở rộng Markdown tích hợp sẵn do VitePress cung cấp.

## Tô sáng cú pháp

VitePress cung cấp tính năng Tô sáng cú pháp được hỗ trợ bởi [Shiki](https://github.com/shikijs/shiki), cùng các tính năng bổ sung như tô sáng dòng:

**Input**

````md
```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```
````

**Output**

```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

## Container tùy chỉnh

**Input**

```md
::: thông tin
Đây là hộp thông tin.
:::

::: mẹo
Đây là mẹo.
:::

::: cảnh báo
Đây là cảnh báo.
:::

::: nguy hiểm
Đây là cảnh báo nguy hiểm.
:::

::: chi tiết
Đây là khối chi tiết.
:::
```

**Output**

::: thông tin
Đây là hộp thông tin.
:::

::: mẹo
Đây là mẹo.
:::

::: cảnh báo
Đây là cảnh báo.
:::

::: nguy hiểm
Đây là cảnh báo nguy hiểm.
:::

::: chi tiết
Đây là khối chi tiết.
:::

## Xem thêm

Xem tài liệu để biết [danh sách đầy đủ các tiện ích mở rộng markdown](https://vitepress.dev/guide/markdown).