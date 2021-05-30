const timers = {};
let number = 1;

function isFunction(functionToCheck) {
  return functionToCheck && typeof functionToCheck === 'function';
}

function isNumber(numberToCheck) {
  return numberToCheck && typeof numberToCheck === 'number';
}

function Timer(callback, delay) {
  this.isRunning = false;
  this.thread = null;

  this.callback = callback;
  this.delay = delay;
}

function start(isInterval, number) {
  if (!this.isRunning) {
    this.isRunning = true;
    this.thread = new java.lang.Thread({
      run: () => {
        run.call(this, isInterval);

        this.isRunning = false;
        this.thread = null;

        delete timers[number];
      }
    });

    this.thread.start();
  }
}

function run(isInterval) {
  do {
    try {
      if (this.isRunning && isNumber(this.delay)) {
        java.lang.Thread.sleep(this.delay);
      }
    } catch (_) {

    }

    try {
      if (this.isRunning && isFunction(this.callback)) {
        this.callback();
      }
    } catch (e) {
      print(e);
    }
  } while (this.isRunning && isInterval);
}

function stop() {
  if (this.isRunning) {
    this.isRunning = false;

    if (this.thread) {
      this.thread.interrupt();
      this.thread = null;
    }
  }
}

function set(callback, delay, isInterval, number) {
  const timer = new Timer(callback, delay);
  timers[number] = timer;

  start.call(timer, isInterval, number);
  return number++;
}

function clear(number) {
  if (timers[number]) {
    stop.call(timers[number]);
  }
}

exports.setTimeout = function (callback, delay) {
  return set(callback, delay, false, number);
}

exports.clearTimeout = function (timeout) {
  clear(timeout);
}

exports.setInterval = function (callback, delay) {
  return set(callback, delay, true, number);
}

exports.clearInterval = function (interval) {
  clear(interval);
}
