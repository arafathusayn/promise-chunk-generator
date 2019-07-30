module.exports = ({ promise, timeout }) => {
  const timeoutPromise = new Promise(resolve => {
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      resolve(null);
    }, timeout);
  });

  return Promise.race([promise, timeoutPromise]);
};
