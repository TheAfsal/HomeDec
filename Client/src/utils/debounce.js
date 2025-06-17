export const debounce = (func, delay) => {
  let timeout;
  let pendingPromiseReject;

  return (...args) => {
    // Cancel the previous pending promise
    if (pendingPromiseReject) pendingPromiseReject({ canceled: true });

    return new Promise((resolve, reject) => {
      clearTimeout(timeout);
      pendingPromiseReject = reject;

      timeout = setTimeout(async () => {
        try {
          const result = await func(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
};
