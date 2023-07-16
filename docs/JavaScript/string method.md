---
title: string method
---

### UniCode 和字母轉換

#### String.fromCharCode()

> return 字串 (依據 UTF-16 uniCode 表)

```js
// 把 uniCode 轉成英文字母
console.log(String.fromCharCode(97)); // 'a'
console.log(String.fromCharCode(122)); // 'z'
console.log(String.fromCharCode(65, 66, 67)); // "ABC"
```

#### 建立一個有 a 到 z 的陣列

```js
// 寫法一:
const arr = [];
let letterIndex = 97;
for (let i = 0; i < 26; i++) {
  let letter = String.fromCharCode(letterIndex + i);
  arr.push(letter);
}
console.log(arr); // ['a', 'b', 'c',...'z']

// 寫法二:
let code_a = 97;
const arr = Array.from(Array(26), (num, i) => String.fromCharCode(code_a + i));
console.log(arr); // ['a', 'b', 'c',...'z']
```

#### String.charCodeAt()

> return 0 ~ 65535 間的整數 (依據 UTF-16 uniCode 表)

```js
str.charCodeAt(index); // index = str[index]
```

```js
// 查看字串的 uniCode
"a".charCodeAt(0); // 97

"ABC".charCodeAt(0); // 65
"ABC".charCodeAt(1); // 66
"ABC".charCodeAt(2); // 67
"ABC".charCodeAt(3); // NaN
```
