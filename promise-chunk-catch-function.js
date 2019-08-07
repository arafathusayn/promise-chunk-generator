module.exports = ({ error, returnRejectedPromiseExecutor, promise }) => {
  if (returnRejectedPromiseExecutor) {
    return promise.__executors.map(executor => ({
      promiseRejected: true,
      promiseExecutor: executor || null,
      errorMessage: (error && error.message) || null,
    }));
  } else {
    console.error(error);
  }
};
