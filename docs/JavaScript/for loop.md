---
title: JS 中的 for loop 方法
---

## for in 和 for of

### Note:

- for...in 輸出 key
- for...of 輸出 value
- 迭代 object 不能使用 for...of
- 迭代陣列時，較常用  for...of

### 在陣列中使用 for in 和 for of:

```js
let arr = ["a", "b", "c"];

// for...in 輸出屬性名稱(key)，取得陣列 index
for (let i in arr) {
  console.log(i); // "0", "1", "2"
}

// for...of 輸出值(value)，取得陣列元素
for (let element of arr) {
  console.log(element); // "a", "b", "c"
}
```

### 使用 for...in 須注意的地方

> 若陣列包含繼承屬性或方法，盡量不要使用 for in 來操作

```js
let arr = ["a", "b", "c"];
arr.newProperty = "new";

// for...in 會連同繼承的屬性和方法一起輸出
for (let i in arr) {
  console.log(i); // "0", "1", "2", "newProperty"
}
```

## 取得 Array 的 key, value

> **注意: 兩個方法都是回傳 `array iterator` 物件**

### Array.keys()

> `回傳`包含陣列中的每一個 keys(索引值) 的 `Array Iterator Object`

```js
let arr = ["a", "b", "c"];
console.log(arr.keys()); // Object [Array Iterator] {}

// 對 iterater object 解構後可以取得包含 key 的 array
console.log([...arr.keys()]); // [0, 1, 2]
```

### Array.values()

> `回傳`包含陣列中的每一個索引之對應值（values）的 `Array Iterator Object`

```js
const arr = ["a", "b", "c"];
const iterator = arr.values(); // Object [Array Iterator] {}

for (const value of arr) {
  console.log(value); // 可以用 for of 方法直接印出 value
}
for (const value of iterator) {
  console.log(value);
}

// 以上 Output 均為
// "a"
// "b"
// "c"
```

## 取得 Object 的 key, value

> **注意: 兩個方法都是回傳 `array`**

### Object.keys()

> `回傳`包含 object 每一個 keys(索引值) 的 `Array`

```js
const newobj = {
  a: "somestring",
  b: 42,
  c: false,
};

console.log(Object.keys(newobj)); // ["a", "b", "c"]
```

### Object.values()

> `回傳`包含 object 每一個 key 對應的 value(值)的 `Array`

```js
const newobj = {
  a: "somestring",
  b: 42,
  c: false,
};

console.log(Object.values(newobj)); // ["somestring", 42, false]

// MDN examples:
// Using Object.values()
const obj = { foo: "bar", baz: 42 };
console.log(Object.values(obj)); // ['bar', 42]

// Array-like object
const arrayLikeObj1 = { 0: "a", 1: "b", 2: "c" };
console.log(Object.values(arrayLikeObj1)); // ['a', 'b', 'c']

// Array-like object with random key ordering
// 如果使用 number 當作 keys，會依據 key 的數字大小做排序
const arrayLikeObj2 = { 100: "a", 2: "b", 7: "c" };
console.log(Object.values(arrayLikeObj2)); // ['b', 'c', 'a']
```
