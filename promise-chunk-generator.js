const pTF = require("./promise-timeout");

const rejectWithDelay = (reason, delay = 100) => {
  return new Promise(function(_, reject) {
    setTimeout(reject.bind(null, reason), delay);
  });
}

const pCF = ({ error, returnRejectedPromiseExecutor, promise, retryPromise, promiseRetry }) => {
  for (let i = 0; i < promiseRetry; i++) {}

  if (returnRejectedPromiseExecutor) {
    return {
      promiseRejected: true,
      promiseExecutor: (promise && promise.__executor) || null,
      errorMessage: (error && error.message) || null,
    };
  } else {
    console.error(error);
  }
};

const cPCF = err => {
  console.error(err);
};

const promiseChunkGenerator = async function*({
  promiseFunctions,
  concurrency,
  perChunkTimeoutDuration,
  perPromiseTimeoutDuration,
  promiseTimeoutFunction,
  promiseCatchFunction,
  returnRejectedPromiseExecutor,
  chunkPromisesCatchFunction,
  promiseRetry,
}) {
  promiseFunctions = promiseFunctions || [];
  concurrency = concurrency || 1;
  perChunkTimeoutDuration = perChunkTimeoutDuration || 5 * 60 * 1000;
  perPromiseTimeoutDuration = perPromiseTimeoutDuration || 2 * 60 * 1000;
  promiseTimeoutFunction = promiseTimeoutFunction || pTF;
  promiseCatchFunction = promiseCatchFunction || pCF;
  chunkPromisesCatchFunction = chunkPromisesCatchFunction || cPCF;
  returnRejectedPromiseExecutor = returnRejectedPromiseExecutor || true;
  promiseRetry = promiseRetry || 1;

  const promiseFunctionsLength = promiseFunctions.length;

  for (let i = 0; i < promiseFunctionsLength; i += concurrency) {
    let chunks = [];

    for (let j = 0; j < concurrency; j++) {
      if (i + j < promiseFunctionsLength) {
        let promise = promiseTimeoutFunction({
          promise: new Promise(promiseFunctions[i + j]),
          timeoutDuration: perPromiseTimeoutDuration,
        });

        promise.__executor = promiseFunctions[i + j];

        chunks.push(promise);
      }
    }

    const retryPromise = promise => promise.catch(_ => new Promise(promise.__executor));

    const promisesCatcher = promises =>
      promises.map(promise =>
        promise.catch(err =>
          promiseCatchFunction({
            err,
            returnRejectedPromiseExecutor,
            promise,
            retryPromise,
            promiseRetry,
          })
        )
      );

    const allPromises = Promise.all(promisesCatcher(chunks)).catch(chunkPromisesCatchFunction);

    yield await promiseTimeoutFunction({
      promise: allPromises,
      timeoutDuration: perChunkTimeoutDuration,
    });
  }
};

module.exports = promiseChunkGenerator;
