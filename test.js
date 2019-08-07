const promiseChunkGenerator = require("./promise-chunk-generator");

const concurrency = 7;
const perChunkTimeoutDuration = 5 * 1000;
const perPromiseTimeoutDuration = 5 * 1000;

let promiseExecutors = [];

for (let i = 0; i < 20; i++) {
  const promiseExecutor = resolve => {
    console.log(i + " Promise running");
    const timeout = Math.round(Math.random() * 4 + 1);
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      resolve(timeout);
    }, timeout * 1000);
  };

  promiseExecutors.push(promiseExecutor);
}

(async () => {
  gen = await promiseChunkGenerator({
    promiseExecutors,
    concurrency,
    perChunkTimeoutDuration,
    perPromiseTimeoutDuration,
  });

  let generatorObject = {
    done: false,
  };

  let rejectedPromiseExecutors = [];

  while (true) {
    generatorObject = await gen.next();

    if (!generatorObject || generatorObject.done) {
      break;
    }

    generatorObject.value && generatorObject.value.forEach(v => {
      if (v.promiseRejected) {
        rejectedPromiseExecutors.push(v.promiseExecutor);
      }
    });

    console.log(generatorObject);
  }

  console.log("END");

  for (const executor of rejectedPromiseExecutors) {
    new Promise(executor);
  }
})();
