---
title: Closure
---

# Closure 閉包

## 特性和用途:

**1. Function 內的變數無法直接從外部存取**

**2. 變數的值會被 keep 住 (在執行完以前不會被 JS 的垃圾回收機制釋放)**

**3. 在 Function 內 return 一個 Function，這就是閉包的概念**

### Function 內的變數無法直接從外部存取

關於第一點，也是我們比較常使用到的部分，利用 Closure 的特性讓函式擁有私有變數，**只有透過 function 內定義好的 method 才能對變數做操作**，也避免在全域中隨意宣告變數，造成全域的汙染產生意料之外的結果。

```js
// 無法直接在 function 外面修改 myMoney 變數
function bank(money) {
  var myMoney = money;
  return {
    increment: function (num) {
      myMoney += num;
    },
    decrement: function (num) {
      myMoney -= num;
    },
    getMyMoney: function () {
      return myMoney;
    },
  };
}

const myWallet = bank(100); // myMoney = 100
myWallet.increment(50); // myMoney += 50
myWallet.decrement(100); // myMoney -= 100
console.log(myWallet.getMyMoney()); // 50
```

### 變數的值會被 keep 住

關於第二點，底下我們用變數 addCount 來接收 handleCount，當我們每次呼叫 addCount 的時候 count 的值會不斷往上增加，也就是說 **count 的值會被 keep 在函式內直到程式被執行完畢**。

```js
function handleCount() {
  var count = 10; // 被 keep 住

  function increment() {
    count++;
    console.log(count);
  }
  return increment;
}

const addCount = handleCount();

addCount(); // 11
addCount(); // 12
addCount(); // 13
```

當我們執行到底下這行的時候，increment function 被存在 addCount 內，而 increment function 的 Scope Chain 會是 [incrementEC.AO, handleCountEC.AO, globalEC.VO]，**所以 JS 底層的垃圾回收機制不能回收( pop 掉 ) handleCountEC.AO 和 globalEC.VO** ，也就是為什麼 count 的值會被保存住。

```js
const addCount = handleCount(); // addCount = function increment(){}
```

這樣的情況下需要另外注意的是，當 function 內有宣告一個龐大的物件，儘管我們在 increment 內沒有用到 hugeObj，他的值還是會被 keep 住，不會被釋放掉 ( hugeObj 和 count 都是 handleCountEC.AO 的一部份 )，是使用 Closure 時要留意的地方。

```js
function handleCount() {
  var count = 10;
  var hugeObj = {
    // something...
  }
  function increment() { /
    count++;
    console.log(count);
  }
  return increment;
}

const addCount = handleCount();

addCount();
```
