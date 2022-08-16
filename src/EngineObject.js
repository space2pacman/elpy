const Point = require('./Point');

class EngineObject {
    constructor(name, x, y, width, height, options = {}) {
        this._name = name;
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._events = {};
        this._collision = {};
        this._direction = null;
        this._distance = null;
        this._isFlying = false;
        this._isJumping = false;
        this._isFalling = false;
        this._state = null;
        this._ghost = false;
        this._animate = false;
        this._added = false,
        this._track = {
            x: 0,
            y: 0
        };
        this._offset = {
            x: 0,
            y: 0,
            object: null,
            engine: {
                x: 0,
                y: 0
            },
            rotate: {
                x: 0,
                y: 0
            }
        };
        this._timers = {
            fly: null
        };
        this._jump = {
            acceleration: 0,
            multiplier: 0,
            docking: false
        };
        this._degrees = 0;
        this._speeds = {
            fly: null
        };
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
        this._exist = true;
        this._MAX_ACCELERATION = 10;
        this._init();
    }

    run(delta = 1, step = 1) {
        let x;
        let y;

        if (delta === 1) {
            x = this._x + Math.cos((delta * (this._degrees + 90)) * Math.PI / 180) * step;
            y = this._y + Math.sin((delta * (this._degrees + 90)) * Math.PI / 180) * step;
        }

        if (delta === -1) {
            x = this._x + Math.sin((delta * (this._degrees - 180)) * Math.PI / 180) * step;
            y = this._y + Math.cos((delta * (this._degrees - 180)) * Math.PI / 180) * step;
        }
            
        this.move(x, y);
    }

    move(x, y) {
        if (!this.checkObjectInViewport()) {
            return false;
        }

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
    // fix убрать таймеры?
    fly(degrees, speed, distance = 0, step = 1) {
        if (speed === 0) {
            this._isFlying = false;
            this._resetTimers();

            return false;
        }

        if (this._isFlying) {
            this._isFlying = false;
            this._resetTimers();
        }

        const positions = {
            start: {
                x: this._x,
                y: this._y
            }
        }
        const point = new Point();

        this._speeds.fly = speed;
        this._timers.fly = setInterval(() => {
            if (this.track.x === this._x && this.track.y === this._y) {
                this._isFlying = false;
            } else {
                this._isFlying = true;
            }

            if (this._isJumping || this._isFalling) {
                return;
            }

            if (distance > 0 && point.distance(positions.start.x, positions.start.y, this._x, this._y) > distance) {
                this._isFlying = false;
                this.destroy();

                return;
            }

            let x = this._x + parseFloat(Math.cos(degrees * Math.PI / 180).toFixed(10)) * step;
            let y = this._y + parseFloat(Math.sin(degrees * Math.PI / 180).toFixed(10)) * step;

            this.move(x, y);
        }, this._speeds.fly);
    }

    jump(height, multiplier = 0.1) {
        if (height === 0) {
            this._isJumping = false;
            this._isFalling = false;

            return false;
        }

        if (this._isJumping || this._isFlying) {
            return false;
        }
        
        this._isJumping = true;
        this._jump.acceleration = this._getMaxJumpAccelerationValue(height, multiplier);
        this._jump.multiplier = multiplier;
        this._jump.docking = false;

        requestAnimationFrame(this._bounce.bind(this));
    }

    fall(multiplier = 0.1) {
        this._isFalling = true;
        this._jump.acceleration = 0;
        this._jump.multiplier = multiplier;
        this._jump.docking = false;
        
        requestAnimationFrame(this._bounce.bind(this));
    }

    // fix убрать direction?
    push(pusher, direction, distance) {
        this._direction = direction;
        this._distance = distance;

        switch (this._direction) {
            case 'up':
                this.move(this.x, this.y - this._distance);

                if (pusher.y !== this.y + this.height) {
                    pusher.move(pusher.x, pusher.y - this._distance);
                }

                break;
            case 'down':
                this.move(this.x, this.y + this._distance);
                
                if (pusher.y + pusher.height !== this.y) {
                    pusher.move(pusher.x, pusher.y + this._distance);
                }

                break;
            case 'right':
                this.move(this.x + this._distance, this.y);

                if (pusher.x + pusher.width !== this.x) {
                    pusher.move(pusher.x + this._distance, pusher.y);
                }

                break;
            case 'left':
                this.move(this.x - this._distance, this.y);

                if (pusher.x !== this.x + this.width) {
                    pusher.move(pusher.x - this._distance, pusher.y);
                }

                break;
        }
    }

    rotate(degrees, x, y) {
        this._offset.rotate.x = x || 0;
        this._offset.rotate.y = y || 0;
        this._degrees = degrees;
        this._dispatchEvent('rotate');
    }

    destroy() {
        this._resetTimers();

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

    obstacles() {
        return Object.values(this._collision);
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
        this._offset.engine.x = x;
        this._offset.engine.y = y;
    }

    checkObjectInViewport() {
        if (this._checkObjectNotActivity && (this._checkObjectInViewportX || this._checkObjectInViewportY)) {
            return false;
        } else {
            return true;
        }
    }
    
    get name() {
        return this._name;
    }

    get options() {
        return this._options;
    }

    get track() {
        return this._track;
    }

    get offset() {
        return this._offset;
    }

    get isPushing() {
        return this._options.pushing;
    }

    get isFlying() {
        return this._isFlying;
    }

    get isFalling() {
        return this._isFalling;
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

    get _checkObjectInViewportX() {
        return this._x > this._offset.object.x + this._offset.engine.x + (this._width * 2)
        || this._x < this._offset.object.x - this._offset.engine.x - (this._width * 2);
    }

    get _checkObjectInViewportY() {
        return this._y > this._offset.object.y + this._offset.engine.y + (this._height * 2)
        || this._y < this._offset.object.y - this._offset.engine.y - (this._height * 2);
    }

    get _checkObjectNotActivity() {
        return !this._options.activity && this._offset.object;
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

    _bounce() {
        if (this._isFalling) {
            this._landing();
        } else {
            this._takeoff();
        }

        if (this._isJumping || this._isFalling) {
            requestAnimationFrame(this._bounce.bind(this));
        }
    }

    _takeoff() {
        if (this._jump.acceleration <= 0) {
            this._isFalling = true;
        } else {
            this._jump.acceleration = (Math.floor(this._jump.acceleration * 10) - (this._jump.multiplier * 10)) / 10;
            this.move(this._x, this._y - this._jump.acceleration);
        }
    }

    _landing() {
        if (this._jump.acceleration <= this._MAX_ACCELERATION) {
            this._jump.acceleration = (Math.floor(this._jump.acceleration * 10) + (this._jump.multiplier * 10)) / 10;
        }
        
        if (this._jump.docking) {
            this.move(this._x, this._y + this._jump.multiplier);
        } else {
            const moving = this.move(this._x, this._y + this._jump.acceleration);

            if (moving === false) {
                this._jump.docking = true;
            }
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

    _resetTimers() {
        clearInterval(this._timers.fly);
    }

    _onCollisionPush(object) {
        if (object.isPushing) {
            object.push(this, this._direction, this._distance);
        }
    }

    _onCollisionSide(object, side) {
        if (side === 'top') {
            if (this._y + this._height === object.y) {
                this._isJumping = false;
                this._isFalling = false;
            }
        }

        if (side === 'bottom') {
            if (this._y > object.y + object.height) {
                this._jump.acceleration = (Math.floor(this._jump.acceleration * 10) - (this._jump.multiplier * 10)) / 10;
                this.move(this._x, this._y - this._jump.acceleration);
            } else {
                this._jump.acceleration = 0;
                
                if (this._isJumping) {
                    this._isFalling = false;
                }
            }
        }
    }

    _init() {
        this.on('collision', this._onCollisionPush.bind(this));
        this.on('collision', this._onCollisionSide.bind(this));
    }
}

module.exports = EngineObject;