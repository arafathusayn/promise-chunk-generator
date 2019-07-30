const promiseTimeoutFunction = require("./promise-timeout");

const promiseChunk = async function*({ promiseFunctions, limit, perChunkTimeout, perPromiseTimeout, promiseTimeout }) {
  if (!promiseTimeout) {
    promiseTimeout = promiseTimeoutFunction;
  }

  const promiseFunctionsLength = promiseFunctions.length;

  for (let i = 0; i < promiseFunctionsLength; i += limit) {
    let chunks = [];

    for (let j = 0; j < limit; j++) {
      chunks.push(
        promiseTimeout({
          promise: new Promise(promiseFunctions[i + j]),
          timeout: perPromiseTimeout,
        })
      );
    }

    const allPromises = Promise.all(chunks).catch(err => {
      console.error(err);
    });

    yield await promiseTimeout({
      promise: allPromises,
      timeout: perChunkTimeout,
    });
  }
};

module.exports = promiseChunk;
