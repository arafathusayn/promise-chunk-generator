module.exports = ({ promise, timeoutDuration }) => {
  promise = promise || new Promise(resolve => resolve);
  timeoutDuration = timeoutDuration || 5 * 60 * 1000;

  const timeoutPromise = new Promise((_, reject) => {
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      reject(new Error(`Promise timeout occured after ${timeoutDuration} ms`));
    }, timeoutDuration);
  });

  return Promise.race([promise, timeoutPromise]);
};
