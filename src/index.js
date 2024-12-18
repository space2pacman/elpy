const EngineObject = require('./EngineObject');

class Engine {
    constructor(link, width, height, options = {}) {
        this._link = link;
        this._width = width || window.innerWidth;
        this._height = height || window.innerHeight;
        this._preload = typeof options.preload === 'boolean' ? options.preload : true;
        this._favicon = typeof options.favicon === 'boolean' ? options.favicon : true;
        this._field = null;
        this._ctx = null;
        this._exist = true;
        this._keys = [];
        this._events = {};
        this._storage = {
            images: []
        };
        this._objects = {};
        this._offset = {
            object: null,
            x: 0,
            y: 0
        };

        this._init();
    }

    create(name, x, y, width, height, options = {}) {
        this._objects[name] = new EngineObject(name, x, y, width, height, options);

        if (!this._objects[name].options.disabledEvents) {
            this._objects[name].on('destroy', this._onDestroyObject.bind(this, name));
        }

        return this._objects[name];
    }

    add(object) {
        if (Array.isArray(object)) {
            object.forEach(item => {
                item.added = true;
                
                this._addObjectImages(item);
                this._render();
            });
        } else {
            object.added = true;

            this._addObjectImages(object);
            this._render();
        }
    }

    key(callback) {
        document.addEventListener('keydown', this._onMultiKeydown.bind(this));
        document.addEventListener('keyup', this._onMultiKeyup.bind(this));
        
        requestAnimationFrame(this._streamKeys.bind(this, callback));
    }

    keydown(callback) {
        document.addEventListener('keydown', event => {
            callback(event.code);
        });
    }

    keyup(callback) {
        document.addEventListener('keyup', event => {
            callback(event.code);
        });
    }

    mousemove(callback) {
        this._field.addEventListener('mousemove', event => {
            callback(event.x - this._field.offsetLeft, event.y - this._field.offsetTop);
        });
    }

    click(callback) {
        this._field.addEventListener('click', event => {
            callback(event.x - this._field.offsetLeft, event.y - this._field.offsetTop);
        });
    }

    tick(callback) {
        const response = callback();
        
        if (response !== false) {
            requestAnimationFrame(this.tick.bind(this, callback));
        }
    }

    nextTick(callback) {
        requestAnimationFrame(callback);
    }

    checkObjectInViewport(object) {
        return this._checkObjectInViewportX(object) && this._checkObjectInViewportY(object);
    }

    fixingCamera(object, fixedCamera = {}) {
        this._setOffsetObject(object);
        this._setOffsetObjectToObjects();

        object.options.fixedCamera.x = typeof fixedCamera === 'object' && fixedCamera !== null ? fixedCamera.x === undefined ? false : fixedCamera.x : false;
        object.options.fixedCamera.y = typeof fixedCamera === 'object' && fixedCamera !== null ? fixedCamera.y === undefined ? false : fixedCamera.y : false;
        
        if (object.options.fixedCamera.x) {
            object.offset.x = (this._offset.x - ((this._width / 2) - (object.width / 2)));
            this._offset.x = ((this._width / 2) - (object.width / 2));
        }

        if (object.options.fixedCamera.y) {
            object.offset.y = (this._offset.y - ((this._height / 2) - (object.height / 2)));
            this._offset.y = ((this._height / 2) - (object.height / 2));
        }
    }

    unfixingCamera() {
        Object.values(this._objects).forEach(object => {
            if (object !== this._offset.object) {
                object.x = object.x - this._offset.object.offset.x;
                object.y = object.y - this._offset.object.offset.y;
            }
        });
        
        this._offset.object.options.fixedCamera.x = false;
        this._offset.object.options.fixedCamera.y = false;
        this._offset.object.x = this._offset.object.x - this._offset.object.offset.x;
        this._offset.object.y = this._offset.object.y - this._offset.object.offset.y;
        this._offset.x = 0;
        this._offset.y = 0;
    }

    destroy() {
        Object.values(this._objects).forEach(object => {
            object.destroy();
        });

        this.nextTick(() => {
            this._exist = false;
        });
    }

    on(event, callback) {
        if (!this._events[event]) {
            this._events[event] = [];
        }

        this._events[event].push(callback);
    }

    async load() {
        if (this._imagesIsLoading) {
            await this._render();

            requestAnimationFrame(this.load.bind(this));
        } else {
            this._preload = false;

            await this._render();

            this._dispatchEvent('load');
        }
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get offset() {
        return this._offset;
    }

    get objects() {
        return this._objects;
    }

    get _imagesIsLoaded() {
        if (this._preload) {
            const loadedImages = this._storage.images.filter(item => item.loaded);
            const isLoaded = loadedImages.length === this._storage.images.length;

            return isLoaded;
        } else {
            return true;
        }
    }

    get _imagesIsLoading() {
        if (this._preload) {
            const loadedImages = this._storage.images.filter(item => item.loaded);
            const isLoading = loadedImages.length !== this._storage.images.length;

            return isLoading;
        } else {
            return false;
        }
    }

    _setOffsetObject(object) {
        this._offset.object = object;
        this._offset.x = object.x;
        this._offset.y = object.y;
    }

    _setOffsetObjectToObjects() {
        for (const name in this._objects) {
            const object = this._objects[name];

            object.setOffsetObject(this._offset.object);
        }
    }

    _onMultiKeydown(event) {
        if (!this._keys.includes(event.code)) {
            this._keys.push(event.code);
        }
    }

    _onMultiKeyup(event) {
        const index = this._keys.indexOf(event.code);

        if (index !== -1) {
            this._keys.splice(index, 1);
        }
    }

    _addObjectImages(object) {
        const images = object.options.images.list;
        const image = object.options.image.path;

        if (image) {
            this._addObjectImageToStorage(object);
        }

        if (images) {
            this._addObjectImagesToStorage(object);
        }
    }

    _addObjectImageToStorage(object) {
        const id = `${object.name}:${object.options.image.path}`;

        if (!this._storage.images.find(image => image.id === id)) {
            this._storage.images.push({ id, loaded: false });
        }
    }

    _addObjectImagesToStorage(object) {
        object.options.images.list.forEach(images => {
            images.paths.forEach(path => {
                const id = `${object.name}:${images.state}:${path}`;

                if (!this._storage.images.find(image => image.id === id)) {
                    this._storage.images.push({ id, loaded: false });
                }
            });
        });
    }

    _loadImage(url, object, state) {
        return new Promise(resolve => {
            const image = new Image();

            image.src = url;
            
            image.addEventListener('load', () => {
                if (state) {
                    const id = `${object.name}:${state}:${url}`;
                    const item = this._storage.images.find(item => item.id === id);

                    item.loaded = true;
                } else {
                    const id = `${object.name}:${url}`;
                    const item = this._storage.images.find(item => item.id === id);

                    item.loaded = true;
                }

                resolve(image);
            });
        });
    }
    
    _loadImages(listImages, object) {
        return new Promise(async resolve => {
            const images = {};

            for(let i = 0; i < listImages.length; i++) {
                const listImageItem = listImages[i];
                
                if (!images[listImageItem.state]) {
                    images[listImageItem.state] = this._getImageParams(listImageItem);
                }
                
                for(let j = 0; j < listImageItem.paths.length; j++) {
                    const path = listImageItem.paths[j];

                    images[listImageItem.state].list[j] = await this._loadImage(path, object, listImageItem.state);

                    if (i === listImages.length - 1 && j === listImageItem.paths.length - 1) {
                        resolve(images);
                    }
                };
            };
        });
    }

    _getImageParams(image) {
        const params = {
            list: [],
            time: image.time || 0,
            currentImage: null,
            lastRenderTime: 0
        }

        return params;
    }

    _checkObjectInViewportX(object) {
        return this._offset.object
        && object.x < (this._offset.object.x + this._width)
        && object.x > (this._offset.object.x - this._width);
    }

    _checkObjectInViewportY(object) {
        return this._offset.object
        && object.y < (this._offset.object.y + this._height)
        && object.y > (this._offset.object.y - this._height);
    }

    async _render() {
        if (!this._preload) {
            this._ctx.clearRect(0, 0, this._width, this._height);
        }

        for(const name in this._objects) {
            const object = this._objects[name];
            const images = object.options.images.list;
            const image = object.options.image.path;

            if (!object.added) {
                return;
            }

            if (image) {
                await this._renderImage(object);
            }

            if (images) {
                await this._renderImages(object);
            }
            
            if (!image && !images && this._imagesIsLoaded) {
                this._renderShape(object);
            }
        }

        if (this._preload) {
            const images = this._storage.images.length;
            const imagesLoaded = this._storage.images.filter(item => item.loaded).length;
            
            this._showLoadingScreen(images, imagesLoaded);
        }
    }

    async _renderImage(object) {
        if (!object.isExist || object.options.image.rendering) {
            return;
        }
        
        await this._renderingImage(object);

        const offset = {
            x: 0,
            y: 0
        }

        if (this._offset.object) {
            offset.x = this._offset.object.offset.x;
            offset.y = this._offset.object.offset.y;
        } else {
            offset.x = this._offset.x;
            offset.y = this._offset.y;
        }

        if (this._offset.object && !this._offset.object.options.fixedCamera.x) {
            offset.x = 0;
        }

        if (this._offset.object && !this._offset.object.options.fixedCamera.y) {
            offset.y = 0;
        }

        if (object.options.image.repeat) {
            this._drawRepeatImage(object, offset);

            return;
        }

        const x = (object.x - offset.x) + object.width / 2;
        const y = (object.y - offset.y) + object.height / 2;
        const angle = object.degrees * Math.PI / 180;

        if ((object.x > (offset.x + this._width) || (object.x + object.width) < offset.x)
        || (object.y > (offset.y + this._height) || (object.y + object.height) < offset.y)) {
            return;
        }

        this._ctx.save();
        this._ctx.translate(x - object.offset.rotate.x, y - object.offset.rotate.y);
        this._ctx.rotate(angle);
        this._ctx.translate(-x + object.offset.rotate.x, -y + object.offset.rotate.y);
        this._ctx.drawImage(object.options.image.cached, (object.x - offset.x), (object.y - offset.y), object.width, object.height);
        this._ctx.restore();
    }

    async _renderImages(object) {
        if (!object.isExist || object.options.images.rendering) {
            return;
        }

        await this._renderingImages(object);

        if (!object.state) {
            object.state = this._getFirstState(object.options.images.cached);
        }

        const cached = object.options.images.cached[object.state];

        if (object.animate) {
            this._calculateRenderTime(cached);
            this._notifyAboutRenderedImage(object, cached);
        } else {
            cached.currentImage = cached.list[0];
        }

        if (this._imagesIsLoading) {
            return;
        }

        const offset = {
            x: 0,
            y: 0
        }

        if (this._offset.object) {
            offset.x = this._offset.object.offset.x;
            offset.y = this._offset.object.offset.y;
        } else {
            offset.x = this._offset.x;
            offset.y = this._offset.y;
        }

        if (this._offset.object && !this._offset.object.options.fixedCamera.x) {
            offset.x = 0;
        }

        if (this._offset.object && !this._offset.object.options.fixedCamera.y) {
            offset.y = 0;
        }

        const x = (object.x - offset.x) + object.width / 2;
        const y = (object.y - offset.y) + object.height / 2;
        const angle = object.degrees * Math.PI / 180;

        if (!this._offset.object) {
            this._ctx.save();
            this._ctx.translate(x - object.offset.rotate.x, y - object.offset.rotate.y);
            this._ctx.rotate(angle);
            this._ctx.translate(-x + object.offset.rotate.x, -y + object.offset.rotate.y);
            this._ctx.drawImage(cached.currentImage, object.x, object.y, object.width, object.height);
            this._ctx.restore();
            
            return;
        }

        this._ctx.save();
        this._ctx.translate(x - object.offset.rotate.x, y - object.offset.rotate.y);
        this._ctx.rotate(angle);
        this._ctx.translate(-x + object.offset.rotate.x, -y + object.offset.rotate.y);

        if (object === this._offset.object) {
            let x;
            let y;
            
            if (this._offset.object.options.fixedCamera.x) {
                x = this._offset.x;
            } else {
                x = object.x;
            }

            if (this._offset.object.options.fixedCamera.y) {
                y = this._offset.y;
            } else {
                y = object.y;
            }

            this._ctx.drawImage(cached.currentImage, x, y, object.width, object.height);
        } else {
            this._ctx.drawImage(cached.currentImage, (object.x - offset.x), (object.y - offset.y), object.width, object.height);
        }

        this._ctx.restore();
    }

    async _renderingImage(object) {
        object.options.image.rendering = true;

        if (!object.options.image.cached) {
            object.options.image.cached = await this._loadImage(object.options.image.path, object);
        }

        object.options.image.rendering = false;
    }

    async _renderingImages(object) {
        object.options.images.rendering = true;

        if (this._isEmpty(object.options.images.cached)) {
            object.options.images.cached = await this._loadImages(object.options.images.list, object);
        }

        object.options.images.rendering = false;
    }

    _renderShape(object) {
        const offset = {
            x: 0,
            y: 0
        }

        if (this._offset.object) {
            offset.x = this._offset.object.offset.x;
            offset.y = this._offset.object.offset.y;
        } else {
            offset.x = this._offset.x;
            offset.y = this._offset.y;
        }

        if (this._offset.object && !this._offset.object.options.fixedCamera.x) {
            offset.x = 0;
        }

        if (this._offset.object && !this._offset.object.options.fixedCamera.y) {
            offset.y = 0;
        }
        
        const x = (object.x - offset.x) + object.width / 2;
        const y = (object.y - offset.y) + object.height / 2;
        const angle = object.degrees * Math.PI / 180;

        this._ctx.save();
        this._ctx.translate(x - object.offset.rotate.x, y - object.offset.rotate.y);
        this._ctx.rotate(angle);
        this._ctx.translate(-x + object.offset.rotate.x, -y + object.offset.rotate.y);
        this._ctx.fillStyle = object.options.color;
        this._ctx.fillRect((object.x - offset.x), (object.y - offset.y), object.width, object.height);
        this._ctx.restore();
    }

    _getFirstState(states) {
        return Object.keys(states)[0];
    }

    _calculateRenderTime(cached) {
        if (performance.now() > (cached.lastRenderTime + cached.time)) {
            let index = cached.list.indexOf(cached.currentImage);

            if ((index + 1) > (cached.list.length - 1) || index === -1) {
                index = 0;
            } else {
                index = index + 1;
            }

            cached.lastRenderTime = performance.now();
            cached.currentImage = cached.list[index];
        }

        if (!cached.currentImage) {
            cached.currentImage = cached.list[0];
        }
    }

    _notifyAboutRenderedImage(object, cached) {
        const image = cached.currentImage.getAttribute('src');
        const images = object.options.images.list.find(i => i.state === object.state).paths;

        this._dispatchEvent('animation', object, image, images);
    }

    _streamKeys(callback) {
        this._keys.forEach(key => {
            callback(key);
        });

        requestAnimationFrame(this._streamKeys.bind(this, callback));
    }

    _onDestroyObject(name) {
        delete this._objects[name];
    }

    _drawRepeatImage(object, offset) {
        const pattern = this._ctx.createPattern(object.options.image.cached, 'repeat');
        const delta = this._getRepeatImageDelta(object);

        this._ctx.fillStyle = pattern;
        this._ctx.save();
        this._ctx.translate(-offset.x + delta.x, -offset.y + delta.y);
        this._ctx.fillRect(object.x - delta.x, object.y - delta.y, object.width, object.height);
        this._ctx.restore();
    }

    _getRepeatImageDelta(object) {
        const delta = {
            x: 0,
            y: 0
        }
        const difference = {
            x: object.width - Math.abs(object.x),
            y: object.height - Math.abs(object.y)
        }

        if (object.x < 0) {
            delta.x = difference.x % object.options.image.cached.width;
        } else {
            delta.x = -(difference.x % object.options.image.cached.width);
        }

        if (object.y < 0) {
            delta.y = difference.y % object.options.image.cached.height;
        } else {
            delta.y = -(difference.y % object.options.image.cached.height);
        }

        return delta;
    }

    _showLoadingScreen(current, max) {
        const x = (this._width / 2) - ((this._width / 2) / 2);
        const y = (this._height / 2) - (((this._height / 100) * 10) / 2);
        const width = this._width / 2;
        const height = (this._height / 100) * 10;

        this._ctx.fillStyle = 'black';
        this._ctx.fillRect(0, 0, this._width, this._height);
        this._ctx.fillStyle = 'white';
        this._ctx.fillRect(x, y, width, height);
        this._ctx.fillStyle = 'black';
        this._ctx.fillRect(x + 5, y + 6, width - 10, height - 12);
        this._ctx.fillStyle = 'white';
        this._ctx.fillRect(x + 4, y + 5, ((width - 8) / current) * max, height - 10);
    }

    _isEmpty(object) {
        return Object.values(object).length === 0;
    }

    _setFavIcon() {
        const favicon = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAk1JREFUOE9jZKAQMJKqv6c4UqSkd/kbmD64AY9XhXLeu/Yl8s7xR17MfxifsrOy9EfuuPAApDDGQNF1yYX7u/uyQlXef/nC27xo+3kMA0ACfaGWnIzPn5s//cO0SICFRVyTj3OxtJhY5/xL97vkuFmznojIlHx//7t6wYEDP7AaABOsidFx+Pj+5543z78zR0mJ/z337f89ht+/VzwXFHWasWmfDbK3cYZBTbRh249P3yq/fmFgkGXmYuD8+ffvw59/jk04dc2egYHhP14XgCRzcz3ZPz58Z/Xl298yM30Tj1fXbjA8fHif4R8Hm9b6c7ev4zWgsSTO/8fXb7P+/P0v9vcvI4OUiDjDh9c/GO69ecJw5e5dv0tX72zGaUB1dog/CwvL2h8/fjDzcPEyvP30leHPr38MzAwsDPdfvv5879lbpytXrpzBakBDQwPTx8dnbv7981eFk52T4d///wyvPn1jePzsPcPb958e/mP853H58q0bOAOxIjPYhYHh3+4nz94x/GX4x8DLxcPw+cd/hkfPXzG8+/i16/r1m+XoCQ8lFlKj/PL//P4x4dGzNwy8vFwMChJyDNcePGZ49/kLAxsLk/uxk2d34TUgLtBLjZuH+8b563dOMzH85VWQlhP6//+fOBcnG8PDZ2899hw+vBOvAVkp4ZpCbNzXrt178Pf20+chFrpa8oz/GSd8/f6d4frDh8fPnb9ijZwGQIahJyRGTzd7j3sPHzv8+PFjo5ayxstP3941vHzz4drPfz93P773/CwhA0jNnAwAsYwMINM2tAQAAAAASUVORK5CYII=';
        const head = document.getElementsByTagName('head')[0];
        const link = document.createElement('link');
        
        link.rel = 'shortcut icon';
        link.href = 'data:image/png;base64,' + favicon;
        
        head.appendChild(link);
    }

    _setDefaultStyle() {
        document.body.style.margin = 0;
    }

    _setFieldStyle() {
        if (typeof this._link === 'string') {
            this._field = document.querySelector(this._link);
        }

        if (this._link instanceof HTMLCanvasElement) {
            this._field = this._link;
        }

        this._field.width = this._width;
        this._field.height = this._height;
        this._field.style.display = 'block';
        this._ctx = this._field.getContext('2d');
    }

    _checkReadyStateChange() {
        document.addEventListener('readystatechange', () => {
            if (document.readyState === 'complete') {
                this.load();
            }
        });
    }

    _dispatchEvent(name, ...data) {
        if (this._events[name] && Array.isArray(this._events[name]) && this._events[name].length > 0) {
            this._events[name].forEach(callback => {
                callback(...data);
            });
        }
    }

    _frameRender() {
        this.tick(() => {
            if (!this._exist) {
                return false;
            }
            
            this._render();
        });
    }

    _init() {
        if (this._favicon) {
            this._setFavIcon();
        }

        this.on('load', this._frameRender.bind(this));
        this._setDefaultStyle();
        this._setFieldStyle();
        this._checkReadyStateChange();
    }
}

module.exports = Engine;