module.exports = ({ promise, timeoutDuration }) => {
  promise = promise || new Promise(resolve => resolve);
  timeoutDuration = timeoutDuration || 5 * 60 * 1000;

  const timeoutPromise = new Promise((_, reject) => {
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      const reason = `Promise timeout occured after ${timeoutDuration} ms`;
      reject(new Error(reason), reason);
    }, timeoutDuration);
  });

  return Promise.race([promise, timeoutPromise]);
};
