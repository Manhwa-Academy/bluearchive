---
title: Thử nghiệm kiểu hiển thị Markdown
date: '2025-09-02'
tags:
  - Foo
  - Bar
head:
  - - meta
    - name: description
      content: vitepress-theme-bluearchive Markdown Style test
  - - meta
    - name: keywords
      content: vitepress theme bluearchive Markdown Style test
---

Bài viết này được lấy từ https://gist.github.com/apackeer/4159268 và được sử dụng để kiểm tra kiểu markdown. Bài viết này bao gồm hầu hết mọi cách sử dụng markdown. Hãy đảm bảo tất cả các phần tử markdown bên dưới hiển thị chính xác.

---

## Headers

```markdown
# H1

## H2

### H3

#### H4

##### H5

###### H6

Ngoài ra, đối với H1 và H2, hãy sử dụng kiểu gạch chân:

# Alt-H1

## Alt-H2
```

# H1

## H2

### H3

#### H4

##### H5

###### H6

Ngoài ra, đối với H1 và H2, hãy sử dụng kiểu gạch chân:

# Alt-H1

## Alt-H2

## Nhấn mạnh

````markdown
Chữ nghiêng có thể được viết bằng dấu sao (\*) hoặc dấu gạch dưới (\_).

Chữ đậm cũng được viết bằng hai dấu sao (\*\*) hoặc hai dấu gạch dưới (\_\_).

Bạn cũng có thể kết hợp chữ đậm và chữ nghiêng trong cùng một câu.

Gạch bỏ chữ (như thế này) thì dùng hai dấu ngã (~~) ở đầu và cuối.

## Danh sách

```markdown
1. Mục đầu tiên trong danh sách có thứ tự
2. Một mục khác

- Danh sách phụ không có thứ tự.

1. Con số thực sự không quan trọng, miễn là có số thứ tự
2. Danh sách con có thứ tự
3. Và thêm một mục nữa.

   Bạn có thể viết các đoạn văn thụt lề đúng cách trong một mục của danh sách. Hãy chú ý dòng trống phía trên và phần thụt đầu dòng (ít nhất một dấu cách, ở đây ta dùng ba để canh thẳng với mã Markdown gốc).

   Để xuống dòng mà không tạo đoạn văn mới, bạn cần thêm hai dấu cách ở cuối dòng.

   Dòng này sẽ được tách riêng, nhưng vẫn nằm trong cùng một đoạn.

   (Điều này khác với hành vi thông thường của GFM – GitHub Flavored Markdown – nơi bạn không cần hai dấu cách để xuống dòng.)

- Danh sách không có thứ tự có thể dùng dấu hoa thị (\*)

* Hoặc dùng dấu gạch ngang (-)

- Hoặc dùng dấu cộng (+)

* Đoạn văn trong danh sách không có thứ tự

Ví dụ như thế này.

Đoạn văn bình thường với một ít nội dung.
Và thêm một vài dòng nữa.
```
````

1. Mục đầu tiên trong danh sách có thứ tự
2. Một mục khác

- Danh sách phụ không có thứ tự.

1. Con số thực sự không quan trọng, miễn là có số thứ tự
2. Danh sách con có thứ tự
3. Và thêm một mục nữa.

   Bạn có thể viết các đoạn văn thụt lề đúng cách trong một mục của danh sách. Hãy chú ý dòng trống phía trên và phần thụt đầu dòng (ít nhất một dấu cách, ở đây ta dùng ba để canh thẳng với mã Markdown gốc).

Để xuống dòng mà không tạo đoạn văn mới, bạn cần thêm hai dấu cách ở cuối dòng.

Dòng này sẽ được tách riêng, nhưng vẫn nằm trong cùng một đoạn.

(Điều này khác với hành vi thông thường của GFM – GitHub Flavored Markdown – nơi bạn không cần hai dấu cách để xuống dòng.)

- Danh sách không có thứ tự có thể dùng dấu hoa thị (\*)

* Hoặc dùng dấu gạch ngang (-)

- Hoặc dùng dấu cộng (+)

* Đoạn văn trong danh sách không có thứ tự

  Ví dụ như thế này.

Đoạn văn bình thường với một ít nội dung.
Và thêm một vài dòng nữa.

## Inline HTML

```markdown
<p>Để khởi động lại máy tính, hãy nhấn <kbd>ctrl</kbd>+<kbd>alt</kbd>+<kbd>del</kbd>.</p>
```

<p>Để khởi động lại máy tính, hãy nhấn <kbd>ctrl</kbd>+<kbd>alt</kbd>+<kbd>del</kbd>.</p>

```markdown
<dl>
<dt>Danh sách định nghĩa</dt>
<dd>Là thứ mọi người đôi khi sử dụng.</dd>

<dt>Markdown trong HTML</dt>
<dd>Không* hoạt động **tốt** lắm. Hãy sử dụng <em>thẻ</em> HTML.</dd>

</dl>
```

<dl>
<dt>Danh sách định nghĩa</dt>
<dd>Là thứ mọi người đôi khi sử dụng.</dd>

<dt>Markdown trong HTML</dt>
<dd>Không* hoạt động **tốt** lắm. Hãy sử dụng <em>thẻ</em> HTML.</dd>

</dl>

## Liên kết

```markdown
[Tôi là một liên kết kiểu nội tuyến](https://www.facebook.com/Shiroko412)

[Tôi là một liên kết kiểu nội tuyến có tiêu đề](https://www.facebook.com/Shiroko412 "Sunaookami Shiroko")

[Tôi là một liên kết kiểu tham chiếu][Văn bản tham chiếu không phân biệt chữ hoa chữ thường tùy ý]

[Tôi là một tham chiếu tương đối đến một tệp kho lưu trữ](https://zalo.me/0332138297)

[Bạn có thể sử dụng số cho các định nghĩa liên kết kiểu tham chiếu][1]

Hoặc để trống và sử dụng [văn bản liên kết]

Một số văn bản để cho thấy các liên kết tham chiếu có thể theo sau.

[Văn bản tham chiếu không phân biệt chữ hoa chữ thường tùy ý]: https://goctruyentranhvui17.com/trang-chu
[1]: https://goctruyentranhvui17.com/truyen/theo-doi
[văn bản liên kết]: https://goctruyentranhvui17.com/
```

[Tôi là một liên kết kiểu nội tuyến](https://www.facebook.com/Shiroko412)

[Tôi là một liên kết kiểu nội tuyến có tiêu đề](https://www.facebook.com/Shiroko412 "Sunaookami Shiroko")

[Tôi là một liên kết kiểu tham chiếu][Văn bản tham chiếu không phân biệt chữ hoa chữ thường tùy ý]

[Tôi là một tham chiếu tương đối đến một tệp kho lưu trữ](https://zalo.me/0332138297)

[Bạn có thể sử dụng số cho các định nghĩa liên kết kiểu tham chiếu][1]

Hoặc để trống và sử dụng [văn bản liên kết]

Một số văn bản để cho thấy các liên kết tham chiếu có thể theo sau.

[Văn bản tham chiếu không phân biệt chữ hoa chữ thường tùy ý]: https://goctruyentranhvui17.com/trang-chu
[1]: https://goctruyentranhvui17.com/truyen/theo-doi
[văn bản liên kết]: https://goctruyentranhvui17.com/
## Hình ảnh

```markdown
di chuột để xem văn bản tiêu đề:

Inline-style:

![alt text](https://i0.wp.com/anitrendz.net/news/wp-content/uploads/2022/07/bluearchive_1.5anniversaryanimeshortscreenshot.png 'Logo Title Text 1')

Phong cách tham khảo:
![alt text][logo]

[logo]: https://i0.wp.com/anitrendz.net/news/wp-content/uploads/2022/07/bluearchive_1.5anniversaryanimeshortscreenshot.png 'Logo Title Text 2'
```

di chuột để xem văn bản tiêu đề:

Inline-style:

![alt text]((https://static.wikia.nocookie.net/blue-archive/images/f/fd/MP_JP_Pyroxene.png/revision/latest?cb=20220130135042 'Logo Title Text 1')

Phong cách tham khảo:
![alt text][logo]

[logo]: (https://static.wikia.nocookie.net/blue-archive/images/f/fd/MP_JP_Pyroxene.png/revision/latest?cb=20220130135042 'Logo Title Text 2'

## Tô sáng Mã và Cú pháp

Inline `code` có `back-ticks around` it.

```javascript
var s = 'JavaScript syntax highlighting'
alert(s)
```

```python
s = "Python syntax highlighting"
print s
```

```
Không có ngôn ngữ nào được chỉ định, nên không có cú pháp tô sáng.
Nhưng hãy thêm một thẻ <b></b>.
```

## Bảng

```markdown
|                  | ASCII                           | HTML                          |
| ---------------- | ------------------------------- | ----------------------------- |
| Single backticks | `'Isn't this fun?'`             | 'Isn't this fun?'             |
| Quotes           | `"Isn't this fun?"`             | "Isn't this fun?"             |
| Dashes           | `-- is en-dash, --- is em-dash` | -- is en-dash, --- is em-dash |
```

|                  | ASCII                           | HTML                          |
| ---------------- | ------------------------------- | ----------------------------- |
| Single backticks | `'Isn't this fun?'`             | 'Isn't this fun?'             |
| Quotes           | `"Isn't this fun?"`             | "Isn't this fun?"             |
| Dashes           | `-- is en-dash, --- is em-dash` | -- is en-dash, --- is em-dash |

Colons can be used to align columns.

```markdown
| Tables        |      Are      | Cool |
| ------------- | :-----------: | ---: |
| col 3 is      | right-aligned |      |
| col 2 is      |   centered    |      |
| zebra stripes |   are neat    |
```

| Tables        |      Are      | Cool |
| ------------- | :-----------: | ---: |
| col 3 is      | right-aligned |      |
| col 2 is      |   centered    |      |
| zebra stripes |   are neat    |      |

Các dấu gạch ngang (|) là tùy chọn, và bạn không cần phải căn chỉnh Markdown thô sao cho đẹp mắt. Bạn cũng có thể sử dụng Markdown nội tuyến.

```markdown
| Markdown | Less      | Pretty     |
| -------- | --------- | ---------- |
| _Still_  | `renders` | **nicely** |
| 1        | 2         | 3          |
```

| Markdown | Less      | Pretty     |
| -------- | --------- | ---------- |
| _Still_  | `renders` | **nicely** |
| 1        | 2         | 3          |

> Bạn có thể tìm thêm thông tin về các biểu thức toán học **LaTeX** [tại đây](https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference).

## Trích dẫn

> Trích dẫn rất hữu ích trong email để mô phỏng văn bản trả lời.
> Dòng này là một phần của cùng một trích dẫn.

Trích dẫn ngắt dòng.

> Đây là một dòng rất dài nhưng vẫn sẽ được trích dẫn đúng khi xuống dòng. Ôi trời, hãy tiếp tục viết để đảm bảo dòng này đủ dài để xuống dòng cho tất cả mọi người. À, bạn có thể _đưa_ **Markdown** vào một khối trích dẫn.

## Quy tắc ngang

Ba hoặc nhiều hơn...

```markdown
---
Hyphens
---

Asterisks

---

Underscores
```

---

Hyphens

---

Asterisks

---

Underscores

## Ngắt dòng

```markdown
Đây là một dòng để chúng ta bắt đầu.

Dòng này được phân cách với dòng trên bằng hai dòng mới, nên nó sẽ là một _đoạn văn riêng_.

Dòng này cũng là một đoạn văn riêng, nhưng...
Dòng này chỉ được phân cách bằng một dòng mới, nên nó là một dòng riêng trong _cùng một đoạn văn_.
```

Đây là một dòng để chúng ta bắt đầu.

Dòng này được phân cách với dòng trên bằng hai dòng mới, nên nó sẽ là một _đoạn văn riêng_.

Dòng này cũng là một đoạn văn riêng, nhưng...
Dòng này chỉ được phân cách bằng một dòng mới, nên nó là một dòng riêng trong _cùng một đoạn văn_.

---

```markdown
Đây là một đoạn văn thông thường.

<table>
    <tr>
        <td>Foo</td>
    </tr>
</table>

Đây là một đoạn văn thông thường.
```

Đây là một đoạn văn thông thường.

<table>
    <tr>
        <td>Foo</td>
    </tr>
</table>

Đây là một đoạn văn thông thường khác.

## Video trên Youtube

```markdown
<a href="https://www.youtube.com/watch?v=7c8p0pRxZHM
" target="_blank"><img src="https://img.youtube.com/vi/7c8p0pRxZHM/hqdefault.jpg"
alt="IMAGE ALT TEXT HERE" width="240" height="180" border="10" /></a>

Phiên bản markdown thuần túy:

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/7c8p0pRxZHM/hqdefault.jpg)](https://www.youtube.com/watch?v=7c8p0pRxZHM)
```

<a href="https://www.youtube.com/watch?v=7c8p0pRxZHM
" target="_blank"><img src="https://img.youtube.com/vi/7c8p0pRxZHM/hqdefault.jpg"
alt="IMAGE ALT TEXT HERE" width="240" height="180" border="10" /></a>

Phiên bản markdown thuần túy:

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/7c8p0pRxZHM/hqdefault.jpg)](https://www.youtube.com/watch?v=7c8p0pRxZHM)
