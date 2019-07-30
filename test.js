const promiseTimeout = require("./promise-timeout");
const promiseChunk = require("./promise-chunk");

const limit = 7;
const perChunkTimeout = 7 * 1000;
const perPromiseTimeout = 4 * 1000;

let promiseFunctions = [];

for (let i = 0; i < 20; i++) {
  const promiseFunction = resolve => {
    const timeout = Math.round(Math.random() * 5 + 1);
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      resolve(timeout);
    }, timeout * 1000);
  };

  promiseFunctions.push(promiseFunction);
}

(async () => {
  gen = await promiseChunk({
    promiseFunctions,
    limit,
    perChunkTimeout,
    perPromiseTimeout,
  });

  let genetorObject = {
    done: false,
  };

  while (!genetorObject.done) {
    const startingTime = Date.now();

    genetorObject = await gen.next();

    console.log(genetorObject);

    const endingTime = Date.now();

    console.log(endingTime - startingTime);
  }
})();
