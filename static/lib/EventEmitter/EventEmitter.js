var EventEmitter = new Function ();

EventEmitter.prototype.initEventEmitter = function () {
    this._listeners = {};
};

EventEmitter.prototype.initEventEmitterType = function (type) {
    if (!type) {
        return;
    }
    this._listeners[type] = [];
};

EventEmitter.prototype.hasEventListener = function (type, fn) {
    if (!this.listener) {
        return false;
    }

    if (type && !this.listener[type]) {
        return false;
    }

    return true;
};

EventEmitter.prototype.addListener = function (type, fn) {
    if (!this._listeners) {
        this.initEventEmitter();
    }
    if (!this._listeners[type]) {
        this.initEventEmitterType(type);
    }
    this._listeners[type].push(fn);

    this.emit('newListener', type, fn);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function (type, fn) {
    fn._onceListener = true;
    this.addListener(type, fn);
};

EventEmitter.prototype.removeListener = function (type, fn) {
    if (!this._listeners) {
        return;
    }
    if (!this._listeners[type]) {
        return;
    }
    if (isNaN(this._listeners[type].length)) {
        return;
    }

    if (!type) {
        this.initEventEmitter();
        this.emit('removeListener', type, fn);
        return;
    }
    if (!fn) {
        this.initEventEmitterType(type);
        this.emit('removeListener', type, fn);
        return;
    }

    var self = this;
    for (var i = 0; i < this._listeners[type].length; i++) {
        (function (listener, index) {
            if (listener === fn) {
                self._listeners[type].splice(index, 1);
            }
        })(this._listeners[type][i], i);
    }
    this.emit('removeListener', type, fn);
};

EventEmitter.prototype.emit = function (type) {
    if (!this._listeners) {
        return;
    }
    if (!this._listeners[type]) {
        return;
    }
    if (isNaN(this._listeners[type].length)) {
        return;
    }

    var self = this,
        args = [].slice.call(arguments, 1);

    for (var i = 0; i < this._listeners[type].length; i++) {
        (function (listener) {
            listener.apply(self, args);
            if (listener._onceListener) {
                self.removeListener(type, listener);
            }
        })(this._listeners[type][i]);
    }
};

EventEmitter.prototype.listeners = function (type) {
    if (!type) {
        return undefined;
    }
    return this._listeners[type];
};

// jquery style alias
EventEmitter.prototype.trigger = EventEmitter.prototype.emit;
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
