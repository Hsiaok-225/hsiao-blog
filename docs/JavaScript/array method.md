---
title: array method
---

## Array.sort() 排序

> 回傳排序後的陣列

- 會改變原陣列
- 依據元素的 UniCode 編碼的大小進行排序
- `有時候需要先對陣列做排序處理`

由 compareFunction 定義排序的順序，預設為依照 UniCode 的大小進行排序

```js
// 接收一個 callback function
Array.sort(compareFunction);
```

### 預設排序

```js
// 測試字串排序
const stringArray = ["b", "P", "a", "c"];
console.log(arr.sort()); // [ 'P', 'a', 'b', 'c' ]

// 查看一下每個元素的 UniCode
stringArray.forEach((e) => {
  console.log(e, e.charCodeAt(0)); //  b 98, P 80, a 97, c 99
});

// 測試數字排序
const numberArray = [40, 1, 5, 200];
numberArray.sort(); // [ 1, 200, 40, 5 ]

// 這邊要把 Number 轉成 String
numberArray.forEach((number) => {
  console.log(number, String(number).charCodeAt(0)); // 40 52, 1 49, 5 53, 200 50
});
```

### compareFunction 怎麼看

依據 MDN 的規範，compareFn 的規則是這樣的:

> compareFn 會傳入 a 和 b，然後 return 一個 value

- 如果 `return value > 0`, 把 a 排序在 b 之後 `[b, a]`
- 如果 `return value < 0`, 把 a 排序在 b 之前 `[a, b]`
- 如果 `return value = 0`, 維持原來的順序不變

| compareFn(a, b) return value | sort order                     |
| ---------------------------- | ------------------------------ |
| > 0                          | sort a after b                 |
| < 0                          | sort a before b                |
| === 0                        | keep original order of a and b |

```js
// compareFn 依據以下規則:

function compare(a, b) {
  // 如果 a < b 的話
  if (a < b) {
    return -1; // 讓 a 排在 b 之前 [a, b]
  }
  // 如果 a > b 的話
  if (a > b) {
    return 1; // 讓 a 排在 b 之後 [b, a]
  }
  // a = b
  return 0; // 維持原本位置
}
```

**基於數字的排序**: 依原本 `compareFn 規則` 就會是由小到大排

```js
// 直接使用 compareFn 預設規則
const numbers = [2, 5, 100, 4];
const sortedNumbers = numbers.sort((a, b) => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
});
console.log(sortedNumbers); // [ 2, 4, 5, 100 ]

// 小到大排序的簡寫
function compareNumbers(a, b) {
  return a - b; // [2, 5] return -3, 排序完 [2, 5]
}
arr.sort((a, b) => a - b);

// 大到小排序的簡寫
function compareNumbers(a, b) {
  return b - a; // [2, 5] return 3, 排序完 [5, 2]
}
arr.sort((a, b) => b - a);
```

**對物件屬性做排序**

String 的比較可以參考: [How to Compare Strings in JS](https://www.freecodecamp.org/news/javascript-string-comparison-how-to-compare-strings-in-js/)

```js
const items = [
  { name: "Edward", value: 21 },
  { name: "Sharpe", value: 37 },
  { name: "And", value: 45 },
  { name: "The", value: -12 },
  { name: "Magnetic", value: 13 },
  { name: "Zeros", value: 37 },
];

// sort by value
items.sort((a, b) => a.value - b.value);

// sort by name，從第一個字母的 UniCode 開始比較(相同比第二個字母的)
items.sort((a, b) => {
  const nameA = a.name.toUpperCase(); // ignore upper and lowercase
  const nameB = b.name.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
});

console.log(items);
/* 
Output:
[
  { name: 'And', value: 45 },
  { name: 'Edward', value: 21 },
  { name: 'Magnetic', value: 13 },
  { name: 'Sharpe', value: 37 },
  { name: 'The', value: -12 },
  { name: 'Zeros', value: 37 }
]
*/
```

### sort 是用哪種排序演算法

updating...

## Array.slice() 取陣列切片

> 會回傳一個新的陣列，為原陣列的淺拷貝 `shallow copy`，原本的陣列不會被改變。

```js
arr.slice(start, end); // 不含 end
```

```js
let arr = [2, 3, 5, 7, 11, 13, 17];
let newarr = arr.slice(3, 6);

console.log(newarr); // Output: [ 7, 11, 13 ]
```

用 Slice 把陣列做切割分區

```js
function sliceToChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, chunkSize + i);
    res.push(chunk);
  }
  return res;
}

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
sliceIntoChunks(arr, 3); // [[ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ], [ 10 ]]
```

## Array.splice()

> 對原陣列做刪除, 替換, 增加元素等操作

`start`: 元素新增的位置 index

`deleteCount`: <=0 為不移除任何元素，省略或大於 array 長度時移除所有元素。

`item`: 要新增的元素

```js
splice(start);
splice(start, deleteCount, item1, item2, itemN);
// If deleteCount is 0 or negative, no elements are removed.
```

MDN example:

在 index 1 的地方新增 "Feb"

```js
const months = ["Jan", "March", "April", "June"];
months.splice(1, 0, "Feb"); // inserts at index 1

console.log(months); // ["Jan", "Feb", "March", "April", "June"]
```

移除 index 2 之後的元素(含 index 2)

```js
const months = ["Jan", "March", "April", "June"];
months.splice(2);

console.log(months); // [ 'Jan', 'March' ]
```

移除 index 2 的元素，並新增一個元素

```js
const months = ["Jan", "March", "April", "June"];
months.splice(2, 1, "Feb");

console.log(months); // ["Jan", "March", "Feb", "June"]
```

## Array.join() 字串處理 - 1

> 將陣列或 `array-like` 的元素合併並回傳一個字串

```js
arr.join([separator]); // 如果沒傳參數的話，預設用英文逗號 , 隔開
```

MDN 範例:

```js
var a = ["Wind", "Rain", "Fire"];

// separator 是空字串，合併後，元素間不會有任何字元
a.join(""); // 'WindRainFire'

// 用逗號和空白隔開
a.join(", "); // 'Wind, Rain, Fire'

a.join(" + "); // 'Wind + Rain + Fire'

// 沒傳任何參數，用逗號隔開
a.join(); // 'Wind,Rain,Fire'
```

## Array.replaceAll() 字串處理 - 2

> Updating...

## Array.every() 測試

> 測試陣列中的所有元素是否都通過 callback 設定的條件，並回傳 Boolean

```js
Array.every(callback);

// MDN example:
const arr = [1, 30, 39, 29, 10, 13];
const isBelowThreshold = (currentValue) => currentValue < 40;
console.log(arr.every(isBelowThreshold)); // true

// 測試字串是否含有 a-z
function isPangram(string) {
  string = string.toLowerCase();
  let newarr = "abcdefghijklmnopqrstuvwxyz".split(""); // [a-z]
  return newarr.every((letter) => string.includes(letter)); // 元素全部符合條件才 return true，否則 return false
}

console.log(isPangram("The quick brown fox")); // false
console.log(isPangram("The quick brown fox jumps over the lazy dog")); // true
```

## Array.from() 新建陣列

- 新建一個陣列 (常用)
- 將 array-like 或 iterable 物件轉為一般陣列

> 基於 `iterable` 或 `array-like` 物件，回傳淺拷貝的 Array instance

```js
// 語法
Array.from(arrayLike);

// 可接收 map Function 作為第二個參數處理 arrayLike object
Array.from(arrayLike, mapFn);
Array.from(arrayLike, (element, index) => {
  //
});

// example:
console.log(Array.from("foo")); // ["f", "o", "o"]
console.log(Array.from([1, 2, 3], (x) => x + x)); // [2, 4, 6]
```

#### 建立有 10 個值的陣列

```js
// Array(n) 建立有 n 個空值(empty)的 array
Array.from(Array(10).keys());
Array.from(Array(10), (e, i) => i + 1)
Array.from({length: 10}, (e, i) => i + 1)

// Spread Operator
[...Array(10).keys()]
// 以上結果均為 [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```
