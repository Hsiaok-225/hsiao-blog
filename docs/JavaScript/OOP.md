---
title: oop and prototype chain
---

# Object Oriented Programming

## OOP in ES6

### ES6 的 class 語法

```js
// class 語法有點像是 component 的概念
class Dog {
  // constructor 負責做初始化, 像 react 一樣可以接收參數
  constructor(name) {
    this.name = name;
  }
  // 可以自訂 function method
  sayHello() {
    console.log(this.name);
  }
  //setter, getter
  getName() {
    return this.name;
  }
}

const a = new Dog("apple"); // 用 new 方法 create Dog instance
const b = new Dog("banana");
console.log(a); // Dog { name: 'apple' }
console.log(a.sayHello === b.sayHello); // true
```

## OOP in ES5

### ES5 還沒有 class 語法以前

```js
//ES5 會每次宣告會多一個function
function Dog(name) {
  var myName = name;
  return {
    getName: function () {
      return myName;
    },
    sayHello: function () {
      console.log(myName);
    },
  };
}

const a = Dog("dogA"); // { getName: [Function: getName], sayHello: [Function: sayHello] }
const b = Dog("dogB");
console.log(a.sayHello === b.sayHello); // false, 兩個 function 不是同一個 function
```

> **Note**: 在上面我們宣告的變數 a, b 的 function 都各自獨立，意味宣告多次會創建大量的 function 佔據記憶體

### ES5 的 class-1 (new 和 this)

#### 把 function 當成 constructor

```js
// 在 ES5 用 new 等於把 function 當成 ES6 的 constructor
// new 會實作背後的 __proto__ 和 prototype
function Dog(name) {
  this.name = name;
}

const a = Dog("apple"); // 沒有 new
const b = new Dog("banana");

console.log(a); // undefined
console.log(b); // Dog { name: 'banana' }
```

### ES5 的 class-2 (Prototype)

```js
// 如果我們想要做到和 ES6 一樣的話，需要用到 prototype 這個屬性來定義 Dog 的 method
function Dog(name) {
  // function as ES6 constructor
  this.name = name;
}

Dog.prototype.getName = function () {
  // 用 .prototype 加上 method
  return this.name;
};

Dog.prototype.sayName = function () {
  console.log("Dog", this.name);
};

Object.prototype.sayName = function () {
  console.log("Object", this.name);
};

const a = new Dog("apple");
const b = new Dog("banana");
console.log(a.sayHello === b.sayHello); //true, 這時候 a, b 兩個 instance 的 sayHello function 就會是同一個

// 和 ES6 對照
class Dog {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
  sayName() {
    console.log(this.name);
  }
}
const a = new Dog("apple");
const b = new Dog("banana");
console.log(a.sayHello === b.sayHello); //true
```

上面的例子中 `a` 和 `b` 是 instance(實例)被構造函數初始化出來， `Dog` 則是 Constructor(構造函數)

## JS 的 Prototype Chain

- **instance 可以調用 constructor 的 method**
- 每個物件都有 `__proto__` 屬性
- `__proto__` 會指向構造這個物件 ( instance ) 的 `prototype` 屬性 ( constructor 的 prototype )
- 只有函數才有 `prototype` 屬性 ( .prototype 裡面為可以調用的 method )

關於原型鍊的順序

```js
a.__proto__ === Dog.prototype; // a 往上找 Dog.prototype 定義好的 method
a.__proto__.__proto__ === Dog.prototype.__proto__; // Object.prototype, a 和 Dog 可以用 Object.prototype 定義好的 method
a.__proto__.__proto__.__proto__ === Object.prototype.__proto__; // null

// 補充
func.__proto__ === Function.prototype;
```

呼叫 a.sayName() 的時候，a.\_\_proto\_\_ 往上找 Dog.prototype，再往上找 Dog.prototype.\_\_proto (`Object.prototype`) 裡面有沒有 sayName 這個 method，

```js
function Dog(name) {
  // function as ES6 constructor
  this.name = name;
}

Dog.prototype.getName = function () {
  // 用 .prototype 加上 method
  return this.name;
};

Object.prototype.sayName = function () {
  console.log("Object", this.name);
};

const a = new Dog("apple");
a.sayName(); // Object apple
```

## class 的繼承(Inheritance)

```js
class Dog {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
  sayName() {
    console.log(this.name);
  }
}

// 繼承原本 Class Dog 的方法
class BlackDog extends Dog {
  constructor(name) {
    super(name); // call super 把 name 傳到 Dog 的 constructor 做初始化
    this.sayName(); // 初始化完才能呼叫 funciton
  }
  running() {
    console.log("run", this.name);
  }
}

const newblack = new BlackDog("PP");

newblack.sayName(); // "PP"
newblack.running(); // "run PP"
```
