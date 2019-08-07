const promiseChunkGenerator = require("./promise-chunk-generator");

const concurrency = 7;
const perChunkTimeoutDuration = 10 * 1000;
const perPromiseTimeoutDuration = 4 * 1000;
const promiseRetry = 2;

let promiseFunctions = [];

for (let i = 0; i < 20; i++) {
  const promiseFunction = resolve => {
    console.log(i + " Promise running");
    const timeout = Math.round(Math.random() * 4 + 1);
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      resolve(timeout);
    }, timeout * 1000);
  };

  promiseFunctions.push(promiseFunction);
}

(async () => {
  gen = await promiseChunkGenerator({
    promiseFunctions,
    concurrency,
    perChunkTimeoutDuration,
    perPromiseTimeoutDuration,
    promiseRetry,
  });

  let generatorObject = {
    done: false,
  };

  while (true) {
    const startingTime = Date.now();

    generatorObject = await gen.next();

    if (!generatorObject || generatorObject.done) {
      break;
    }

    generatorObject.value.forEach(v => {
      if (v.promiseRejected) {
        console.log(v);
      }
    });

    const endingTime = Date.now();

    console.log(endingTime - startingTime);
  }

  console.log("END");
})();
