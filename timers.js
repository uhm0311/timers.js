(function () {
  Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, "wakelock");

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

    const self = this;

    this.start = function () {
      if (!self.isRunning) {
        self.isRunning = true;
        self.thread = new java.lang.Thread({
          run: () => {
            self.run();

            self.isRunning = false;
            self.thread = null;

            delete timers[self.number];
          }
        });

        self.thread.start();
      }
    }

    this.run = function () {
      do {
        try {
          if (self.isRunning && isNumber(self.delay)) {
            java.lang.Thread.sleep(Math.floor(self.delay));
          }
        } catch (_) {

        }

        try {
          if (self.isRunning && isFunction(self.callback)) {
            self.callback();
          }
        } catch (e) {
          Log.e(e);
        }
      } while (self.isRunning && self.isInterval);
    }

    this.stop = function () {
      if (self.isRunning) {
        self.isRunning = false;

        if (self.thread) {
          self.thread.interrupt();
          self.thread = null;
        }

        if (timers[self.number]) {
          delete timers[self.number];
        }
      }
    }
  }

  function set(callback, delay, isInterval) {
    const num = number++;

    const timer = new Timer(callback, delay, isInterval, num);
    timers[num] = timer;

    timer.start();
    return num;
  }

  function clear(number) {
    if (timers[number]) {
      timers[number].stop();
    }
  }

  exports.setTimeout = function (callback, delay) {
    return set(callback, delay, false);
  }

  exports.clearTimeout = function (number) {
    clear(number);
  }

  exports.setInterval = function (callback, delay) {
    return set(callback, delay, true);
  }

  exports.clearInterval = function (number) {
    clear(number);
  }

  exports.clearAll = function () {
    Object.keys(timers).forEach((number) => {
      timers[number].stop();
    });
  }
}).call(this);
