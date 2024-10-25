type DebounceOptions = { maxWait?: number };

const debounce = (func: Function, wait: number, options?: DebounceOptions) => {
  let timer: NodeJS.Timer;
  let maxTimer: NodeJS.Timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      clearTimeout(maxTimer);
      maxTimer = null;
      func(...args);
    }, wait);
    if (options?.maxWait && !maxTimer) {
      maxTimer = setTimeout(() => {
        clearTimeout(timer);
        maxTimer = null;
        func(...args);
      }, options?.maxWait);
    }
  };
};

export default debounce;
