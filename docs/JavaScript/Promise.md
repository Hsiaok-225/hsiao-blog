---
title: Promise
---

# Promise

> 處理非同步的一種方式，以鏈(chain)的寫法來調用，改善過去 JavaScript 寫非同步語法時使用 callback 帶來的不便

### Promise 的三種狀態

> 進入其中一種狀態後，就不再改變

- pending: 等待中
- fullfilled: 成功，對應到 `resolve`
- rejected: 失敗，對應到 `reject`

### 語法

> MDN: `Promise` 物件代表一個即將完成、或失敗的非同步操作，，以及它所產生的值。

```js
new Promise( /* executor */ function(resolve, reject) { ... } );
```

## Callback 處理非同步流程

在沒有 Promise 方法的情況下，如果我們要等待前一個 response 回來再呼叫下一個 api，並且保證執行順序的話，經常會使用到 callback 的寫法，但數量一多就會造成所謂的 callback hell，讓程式不好閱讀及維護。

```js
let firstUrl = "https://jsonplaceholder.typicode.com/posts/1";
let secondtUrl = "https://jsonplaceholder.typicode.com/posts/2";
let thirdUrl = "https://jsonplaceholder.typicode.com/posts/3";

function getData(url, callback) {
  const request = new XMLHttpRequest();

  // 當 request onload 完成
  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      let res = request.responseText;
      callback(null, JSON.parse(res)); // 拿到 response 後呼叫下一個 api
    } else {
      callback("失敗", null);
    }
  };

  request.open("GET", url);
  request.send();
}

// call 第一個 api
getData(firstUrl, (err, data) => {
  console.log("這是第一筆資料", data); // 拿到上一個 response 後再 call 第二個 api
  getData(secondtUrl, (err, data) => {
    console.log("這是第二筆資料", data); // 拿到上一個 response 後再 call 第三個 api
    getData(thirdUrl, (err, data) => {
      console.log("這是第三筆資料", data);
    });
  });
});
```

## 建立一個 Promise 物件

```js
// 建立一個 Promise 的 Instance
// Promise 物件有 pending, resolve, reject 狀態
const promise1 = new Promise(function (resolve, reject) {
  // pending...
  if (condition) {
    resolve(`resolve`); //依 condition 決定進入 resolve 或 reject
  } else {
    reject(`failed`);
  }
});

promise1
  .then((res) => console.log(res)) // then 接收 resolve 的回傳值
  .catch((err) => console.log(err)); // catch 接收 reject 的回傳值
```

## Promise 取代 Callback

```js
function getData(url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    // 當 request onload 完成
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        let data = request.responseText;
        resolve(JSON.parse(data)); // 成功的話 call resolve，把 data 傳進 resolve
      } else {
        reject(`失敗:  ${request.status}`); // 失敗的話 call reject，一樣可傳入 err
      }
    };

    request.open("GET", url);
    request.send();
  });
}

getData(firstUrl)
  .then((res) => {
    console.log("成功拿到第一筆資料", res);

    // 拿到第一筆資料的結果後，再 call 下一個 api
    getData(secondtUrl).then((res) => console.log("成功拿到第二筆資料", res));
  })
  .catch((err) => {
    console.log(err);
  });

/*
Output:
	成功拿到第一筆資料 {data:1 ...}
	成功拿到第二筆資料 {data:2 ...}
*/
```
