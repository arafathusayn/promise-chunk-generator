module.exports = ({ error, returnRejectedPromiseExecutor, promise }) => {
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
