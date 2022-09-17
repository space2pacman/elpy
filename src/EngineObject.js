const point = require('./Point');

class EngineObject {
    constructor(name, x, y, width, height, options = {}) {
        this._name = name;
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._events = {};
        this._collision = {};
        this._isJumping = false;
        this._isFalling = false;
        this._isFlying = false;
        this._isStopped = false;
        this._state = null;
        this._ghost = false;
        this._animate = false;
        this._added = false,
        this._exist = true;
        this._track = {
            x: null,
            y: null
        };
        this._dest = {
            x: null,
            y: null
        };
        this._offset = {
            x: 0,
            y: 0,
            object: null,
            rotate: {
                x: 0,
                y: 0
            }
        };
        this._positions = {
            start: {
                x: null,
                y: null
            }
        }
        this._degrees = 0;
        this._options = {
            obstacle: typeof options.obstacle === 'boolean' ? options.obstacle : true,
            activity: typeof options.activity === 'boolean' ? options.activity : false,
            main: typeof options.main === 'boolean' ? options.main : false,
            pushing: typeof options.pushing === 'boolean' ? options.pushing : false,
            disabledEvents: typeof options.disabledEvents === 'boolean' ? options.disabledEvents : false,
            type: options.type || null,
            custom: options.custom || null,
            color: options.color || 'black',
            image: {
                src: (typeof options.image === 'object' && options.image !== null ? options.image.src : options.image) || null,
                repeat: (typeof options.image === 'object' && options.image !== null ? options.image.repeat : null) || null,
                rendering: false,
                cached: null
            },
            images: {
                list: options.images || null,
                rendering: false,
                cached: {}
            },
            offset: {
                x: typeof options.offset === 'object' && options.offset !== null ? options.offset.x === undefined ? false : options.offset.x : false,
                y: typeof options.offset === 'object' && options.offset !== null ? options.offset.y === undefined ? false : options.offset.y : false,
            }
        };
        this._params = {
            movement: {
                acceleration: 0
            },
            jump: {
                multiplier: 0
            },
            fall: {
                multiplier: 0
            }
        }
        this._MAX_ACCELERATION = 10;

        this._init();
    }

    run(step = 1) {
        const x = this._x + Math.cos((this._degrees + 90) * Math.PI / 180) * step;
        const y = this._y + Math.sin((this._degrees + 90) * Math.PI / 180) * step;
            
        this.move(x, y);
    }

    move(x, y) {
        this._dest.x = x;
        this._dest.y = y;
        this._track.x = this._x;
        this._track.y = this._y;
        
        for(const name in this._collision) {
            const object = this._collision[name];

            if (this !== object
                && this.isExist
                && object.isExist
                && !object.ghost
                && x + this._width > object.x
                && x < object.x + object.width
                && y + this._height > object.y
                && y < object.y + object.height) {

                const side = this._getCollisionSide(x, y, object);

                this._dispatchEvent('collision', object, side);
                
                if (object.options.obstacle) {
                    return false;
                }
            }
        }

        if (this._options.offset.x && x > this._track.x) {
            this._offset.x += Math.abs(this._track.x - x);
        }

        if (this._options.offset.x && x < this._track.x) {
            this._offset.x -= Math.abs(this._track.x - x);
        }

        if (this._options.offset.y && y > this._track.y) {
            this._offset.y += Math.abs(this._track.y - y);
        }

        if (this._options.offset.y && y < this._track.y) {
            this._offset.y -= Math.abs(this._track.y - y);
        }

        this._x = x;
        this._y = y;

        this._dispatchEvent('move');
    }
    
    fly(degrees, distance = 0, step = 1) {
        const event = this._getEventObject();

        this._positions.start.x = this._x;
        this._positions.start.y = this._y;

        this._nextTick(() => {
            this._isStopped = false;
            this._isFlying = true;
            this._tick(this._onFly.bind(this, event, degrees, distance, step));
        });
    }

    jump(height, multiplier = 0.1, forced = false) {
        const event = this._getEventObject();

        if (forced) {
            this._isJumping = false;
        }

        if (this._isJumping) {
            return false;
        }

        this._isFalling = false;
        this._isJumping = true;
        this._params.movement.acceleration = this._getMaxJumpAccelerationValue(height, multiplier);
        this._params.jump.multiplier = multiplier;

        this._nextTick(() => {
            this._isStopped = false;
            this._tick(this._onJump.bind(this, event));
        });
    }

    fall(multiplier = 0.1) {
        const event = this._getEventObject();

        this._isFalling = true;
        this._params.fall.multiplier = multiplier;

        this._nextTick(() => {
            this._isStopped = false;
            this._tick(this._onFall.bind(this, event));
        });
    }

    push(pusher) {
        let direction;
        let distance;

        if (pusher.dest.y < pusher.y) {
            direction = 'up';
            distance = Math.abs(pusher.dest.y - pusher.y);
        }

        if (pusher.dest.y > pusher.y) {
            direction = 'down';
            distance = Math.abs(pusher.dest.y - pusher.y);
        }

        if (pusher.dest.x > pusher.x) {
            direction = 'right';
            distance = Math.abs(pusher.dest.x - pusher.x);
        }

        if (pusher.dest.x < pusher.x) {
            direction = 'left';
            distance = Math.abs(pusher.dest.x - pusher.x);
        }

        switch (direction) {
            case 'up':
                this.move(this.x, this.y - distance);

                if (this.track.y !== this.y) {
                    pusher.move(pusher.x, pusher.y - distance);
                }

                break;
            case 'down':
                this.move(this.x, this.y + distance);

                if (this.track.y !== this.y) {
                    pusher.move(pusher.x, pusher.y + distance);
                }

                break;
            case 'right':
                this.move(this.x + distance, this.y);

                if (this.track.x !== this.x) {
                    pusher.move(pusher.x + distance, pusher.y);
                }

                break;
            case 'left':
                this.move(this.x - distance, this.y);

                if (this.track.x !== this.x) {
                    pusher.move(pusher.x - distance, pusher.y);
                }

                break;
        }
    }

    rotate(degrees, x = 0, y = 0) {
        this._offset.rotate.x = x;
        this._offset.rotate.y = y;
        this._degrees = degrees;

        this._dispatchEvent('rotate');
    }

    stop() {
        this._isStopped = true;
    }

    destroy() {
        delete this._collision[this._name];
        this._exist = false;

        this._dispatchEvent('destroy');
    }

    collision(object) {
        if (Array.isArray(object)) {
            object.forEach(item => {
                if (item.isExist) {
                    this._collision[item.name] = item;
                }
            });
        } else {
            if (object.isExist) {
                this._collision[object.name] = object;
            }
        }
    }

    on(event, callback) {
        if (!this._events[event]) {
            this._events[event] = [];
        }

        this._events[event].push(callback);
    }
    //fix remove ?
    addOffsetObject(object, x, y) {
        this._offset.object = object;
    }
    
    get name() {
        return this._name;
    }

    get options() {
        return this._options;
    }

    get obstacles() {
        return Object.values(this._collision);
    }

    get track() {
        return this._track;
    }

    get dest() {
        return this._dest;
    }

    get offset() {
        return this._offset;
    }

    get isPushing() {
        return this._options.pushing;
    }

    get isJumping() {
        return this._isJumping;
    }

    get isFalling() {
        return this._isFalling;
    }

    get isFlying() {
        return this._isFlying;
    }

    get isExist() {
        return this._exist;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }
    
    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        return this._width = value;
    }

    get height() {
        return this._height;
    }

    set height(value) {
        return this._height = value;
    }

    get state() {
        return this._state;
    }

    set state(state) {
        this._state = state;

        this._dispatchEvent('state');
    }

    get animate() {
        return this._animate;
    }

    set animate(value) {
        if (value) {
            if (Array.isArray(this.options.images.list) && this.options.images.list.length > 0) {
                requestAnimationFrame(this._animation.bind(this));
            }
        }

        this._animate = value;
    }
    

    get ghost() {
        return this._ghost;
    }

    set ghost(value) {
        this._ghost = value;
    }

    get degrees() {
        return this._degrees;
    }

    get added() {
        return this._added;
    }

    set added(value) {
        return this._added = value;
    }

    get _isAccelerationStopped() {
        return this._params.movement.acceleration <= 0;
    }

    _dispatchEvent(name, ...data) {
        if (this._events[name] && Array.isArray(this._events[name]) && this._events[name].length > 0) {
            this._events[name].forEach(callback => {
                callback(...data);
            });
        }
    }

    _animation() {
        if (this._animate) {
            this._dispatchEvent('state');

            requestAnimationFrame(this._animation.bind(this));
        }
    }

    _takeoff() {
        const acceleration = Math.floor(this._params.movement.acceleration * 10);
        const multiplier = this._params.jump.multiplier * 10;

        this._params.movement.acceleration = (acceleration - multiplier) / 10;
        
        this.move(this._x, Math.floor(this._y - this._params.movement.acceleration));
    }

    _landing() {
        if (this._params.movement.acceleration <= this._MAX_ACCELERATION) {
            const acceleration = Math.floor(this._params.movement.acceleration * 10);
            const multiplier = this._params.fall.multiplier * 10;

            this._params.movement.acceleration = (acceleration + multiplier) / 10;
        }

        const moving = this.move(this._x, Math.floor(this._y + this._params.movement.acceleration));

        if (moving === false) {
            this._params.movement.acceleration = 0;
            
            return true;
        }
    }

    _getCollisionSide(x, y, object) {
        let side = null;

        if (x + this._width > object.x
            && x < object.x + object.width
            && (this._y + this._height <= object.y || this._y >= object.y + object.height)) {
            const top = object.y - (y + this._height);
            const bottom = y - (object.y + object.height);

            if (top > bottom) {
                side = 'top';
            } else {
                side = 'bottom';
            }
        }

        if (y + this._height > object.y
            && y < object.y + object.height
            && (this._x + this._width <= object.x || this._x >= object.x + object.width)) {
            const left = object.x - (x + this._width);
            const right = x - (object.x + object.width);

            if (left > right) {
                side = 'left';
            } else {
                side = 'right';
            }
        }

        return side;
    }

    _getMaxJumpAccelerationValue(max, multiplier) {
        let min = 0;
        let acceleration = 0;

        while(min <= max) {
            min += acceleration;
            acceleration = (Math.floor(acceleration * 10) + (multiplier * 10)) / 10;
        }

        return acceleration;
    }

    _onCollisionSide(object, side) {
        if (side === 'bottom') {
            this._params.movement.acceleration = 0;
        }
    }

    _tick(callback) {
        const response = callback();

        if (response !== false) {
            requestAnimationFrame(this._tick.bind(this, callback));
        }
    }

    _nextTick(callback) {
        requestAnimationFrame(callback);
    }

    _getEventObject() {
        const event = {
            _stopped: false,
            _paused: false,
            get stopped() {
                return this._stopped;
            },
            get paused() {
                return this._paused;
            },
            stop() {
                this._stopped = true;
            },
            pause() {
                this._paused = true;
            },
            resume() {
                this._paused = false;
            }
        }

        return event;
    }

    _onJump(event) {
        if (this._isStopped) {
            return false;
        }

        if (event.paused) {
            this._dispatchEvent('jump', event);
            
            return;
        }

        if (event.stopped) {
            this._isFalling = true;

            return false;
        }

        if (this._isAccelerationStopped) {
            this._isFalling = true;

            return false;
        } else {
            this._takeoff();
            this._dispatchEvent('jump', event);
        }
    }

    _onFall(event) {
        if (this._isStopped) {
            return false;
        }
        
        if (event.paused) {
            this._dispatchEvent('fall', event);

            return;
        }

        if (event.stopped) {
            this._isJumping = false;

            return false;
        }

        if (this._isFalling) {
            const landed = this._landing();

            if (landed === true) {
                this._isJumping = false;
            }

            this._dispatchEvent('fall', event);
        }
    }

    _onFly(event, degrees, distance, step) {
        if (this._isStopped) {
            this._isFlying = false;

            return false;
        }

        if (event.paused) {
            this._dispatchEvent('fly', event);
            
            return;
        }

        if (event.stopped) {
            this._isFlying = false;
            
            return false;
        }

        if (distance > 0 && point.distance(this._positions.start.x, this._positions.start.y, this._x, this._y) > distance) {
            this.destroy();

            return false;
        }

        let x = this._x + parseFloat(Math.cos(degrees * Math.PI / 180).toFixed(10)) * step;
        let y = this._y + parseFloat(Math.sin(degrees * Math.PI / 180).toFixed(10)) * step;

        this.move(x, y);
        this._dispatchEvent('fly', event);
    }

    _init() {
        this.on('collision', this._onCollisionSide.bind(this));
    }
}

module.exports = EngineObject;