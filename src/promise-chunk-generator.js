const pTF = require("./promise-timeout");
const pCF = require("./promise-catch-function");
const pCCF = require("./promise-chunk-catch-function");

const promiseChunkGenerator = async function*({
  promiseExecutors,
  concurrency,
  perChunkTimeoutDuration,
  perPromiseTimeoutDuration,
  promiseTimeoutFunction,
  promiseCatchFunction,
  returnRejectedPromiseExecutor,
  promiseChunkCatchFunction,
}) {
  promiseExecutors = promiseExecutors || [];
  concurrency = concurrency || 1;
  perChunkTimeoutDuration = perChunkTimeoutDuration || 5 * 60 * 1000;
  perPromiseTimeoutDuration = perPromiseTimeoutDuration || 2 * 60 * 1000;
  promiseTimeoutFunction = promiseTimeoutFunction || pTF;
  promiseCatchFunction = promiseCatchFunction || pCF;
  promiseChunkCatchFunction = promiseChunkCatchFunction || pCCF;
  returnRejectedPromiseExecutor = returnRejectedPromiseExecutor || true;

  const promiseExecutorsLength = promiseExecutors.length;

  for (let i = 0; i < promiseExecutorsLength; i += concurrency) {
    let chunk = [];

    for (let j = 0; j < concurrency; j++) {
      if (i + j < promiseExecutorsLength) {
        let promise = promiseTimeoutFunction({
          promise: new Promise(promiseExecutors[i + j]),
          timeoutDuration: perPromiseTimeoutDuration,
        });

        promise.__executor = promiseExecutors[i + j];

        chunk.push(promise);
      }
    }

    const promisesCatcher = promises =>
      promises.map(promise =>
        promise.catch(error =>
          promiseCatchFunction({
            error,
            returnRejectedPromiseExecutor,
            promise,
          })
        )
      );

    let chunkPromise = Promise.all(promisesCatcher(chunk));

    chunkPromise.__executors = chunk.map(promise => promise.__executor);

    const promiseChunkCatcher = promise => error =>
      promiseChunkCatchFunction({
        error,
        returnRejectedPromiseExecutor,
        promise,
      });

    yield await promiseTimeoutFunction({
      promise: chunkPromise,
      timeoutDuration: perChunkTimeoutDuration,
    }).catch(promiseChunkCatcher(chunkPromise));
  }
};

module.exports = promiseChunkGenerator;
