const timers = {};
let number = 1;

function isFunction(functionToCheck) {
  return functionToCheck && typeof functionToCheck === 'function';
}

function isNumber(numberToCheck) {
  return numberToCheck && typeof numberToCheck === 'number';
}

function Timer(callback, delay, isInterval, number) {
  this.isRunning = false;
  this.thread = null;

  this.callback = callback;
  this.delay = delay;

  this.isInterval = isInterval;
  this.number = number;

  this.start = function (number) {
    if (!this.isRunning) {
      this.isRunning = true;
      this.thread = new java.lang.Thread({
        run: () => {
          this.run();
  
          this.isRunning = false;
          this.thread = null;
  
          delete timers[number];
        }
      });
  
      this.thread.start();
    }
  }

  this.run = function () {
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
    } while (this.isRunning && this.isInterval);
  }

  this.stop = function () {
    if (this.isRunning) {
      this.isRunning = false;
  
      if (this.thread) {
        this.thread.interrupt();
        this.thread = null;
      }
    }
  }
}

function set(callback, delay, isInterval) {
  const result = number;
  number++;

  const timer = new Timer(callback, delay, isInterval, result);
  timers[result] = timer;

  timer.start();
  return result;
}

function clear(number) {
  if (timers[number]) {
    timers[number].stop();
  }
}

exports.setTimeout = function (callback, delay) {
  return set(callback, delay, false);
}

exports.clearTimeout = function (timeout) {
  clear(timeout);
}

exports.setInterval = function (callback, delay) {
  return set(callback, delay, true);
}

exports.clearInterval = function (interval) {
  clear(interval);
}

exports.clearAll = function() {
  for (const number in Object.keys(timers)) {
    timers[number].stop();
  }
}
