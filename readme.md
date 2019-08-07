# promise-chunk-generator

An async generator that takes an array of promise executor functions and creates promises in chunks with fault-tolerance

## Installation

```
npm install promise-chunk-generator
```

### Basic Example:

```js
const promiseChunkGenerator = require("promise-chunk-generator");

const concurrency = 5; // how many promises you want to run concurrenty, default: 1

let promiseExecutors = []; // array of executor functions, each to pass in new Promise(executor)

for (let i = 0; i < 3; i++) {
  const promiseExecutor = resolve => {
    console.log(`${i} Promise running`);
    const timeout = Math.round(Math.random() * 4 + 1);
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      resolve(timeout);
    }, timeout * 1000);
  };

  promiseExecutors.push(promiseExecutor);
}

const options = {
  promiseExecutors,
  concurrency,
};

// Inside an async function...
const generator = await promiseChunkGenerator(options);

while (true) {
  const object = await generator.next();

  if (object.done) {
    break;
  }

  console.log(object);
}
```

<br>

### All Options:

```js
const promiseChunkGenerator = require("promise-chunk-generator");

const options = {
  promiseExecutors, // array of functions to pass in new Promise(executor)
  concurrency, // how many promises you want to run concurrenty, default: 1
  perChunkTimeoutDuration, // default: 5 * 60 * 1000 ms
  perPromiseTimeoutDuration, // default: 2 * 60 * 1000 ms
  promiseTimeoutFunction, // pass if you want to customize it, see: src/promise-timeout.js
  promiseCatchFunction, // pass if you want to customize it, see: src/promise-catch-function.js
  promiseChunkCatchFunction, // pass if you want to customize it, see: src/promise-chunk-catch-function.js
  returnRejectedPromiseExecutor, // default: true
};

// Inside an async function...
const generator = await promiseChunkGenerator(options);
```

<br><br>
<hr>

#### License: MIT <br> Author: <a href="https://arafat.dev">Arafat Husayn</a>