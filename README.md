# Elpy.js - 2D JavaScript game engine.

![logo](/docs/images/background.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/space2pacman/elpy/blob/master/LICENSE.md)
[![Javascript](https://img.shields.io/badge/language-javascript-green.svg)](https://en.wikipedia.org/wiki/JavaScript)

| [Demo](https://space2pacman.github.io/elpy/docs/) | [Game examples](https://space2pacman.github.io/elpy/docs/examples.html) |
| :---: | :---: |

## Docs
- <a href="#install">Install</a>
- <a href="#basic-usage-example">Basic usage example</a>
- <a href="#engine">Engine</a>
  - <a href="#createname-x-y-width-height-options">create()</a>
- <a href="#object">Object</a>
  - <a href="#runstep">run()</a>
  - <a href="#movex-y">move()</a>
  - <a href="#flydegrees-distance-step">fly()</a>
  - <a href="#jumpheight-multiplier-forced">jump()</a>
  - <a href="#fallmultiplier">fall()</a>
  - <a href="#pushobject">push()</a>
  - <a href="#rotatedegrees-x-y">rotate()</a>
  - <a href="#stop">stop()</a>
  - <a href="#destroy">destroy()</a>
  - <a href="#collisionobject">collision()</a>
  - <a href="#onevent-callback">on()</a>
    - <a href="#event-collision">Event `'collision'`</a>
    - <a href="#event-move">Event `'move'`</a>
    - <a href="#event-rotate">Event `'rotate'`</a>
    - <a href="#event-destroy">Event `'destroy'`</a>
    - <a href="#event-state">Event `'state'`</a>
    - <a href="#event-jump">Event `'jump'`</a>
    - <a href="#event-fall">Event `'fall'`</a>
    - <a href="#event-fly">Event `'fly'`</a>
    - <a href="#event-object">Event object</a>
- <a href="#object-getters">Object getters</a>
- <a href="#object-setters">Object setters</a>
- <a href="#development">Development</a>
- <a href="#license">License</a>

![games](/docs/images/games-background.png)

## Install
#### Download
Latest builds are available in the project [releases page](https://github.com/space2pacman/elpy/releases/latest).
#### CDN
```js
https://
```
#### NPM
```js
npm install
```
## Basic usage example
```html
<!DOCTYPE html>
<html>
<head>
  <title>Elpy.js</title>
</head>
<body>
  <canvas id="field"></canvas>
  <script src="elpy.min.js"></script>
  <script>
    const elpy = new Elpy('#field', 500, 500);
    const player = elpy.create('player', 50, 50, 20, 20);
    const wall = elpy.create('wall', 100, 50, 20, 20, { color: 'brown' });

    elpy.add(player);
    elpy.add(wall);
    player.collision(wall);

    elpy.key(key => {
      if (key === 'ArrowUp') {
        player.move(player.x, player.y - 1);
      }
      if (key === 'ArrowDown') {
        player.move(player.x, player.y + 1);
      }
      if (key === 'ArrowLeft') {
        player.move(player.x - 1, player.y);
      }
      if (key === 'ArrowRight') {
        player.move(player.x + 1, player.y);
      }
    });
  </script>
</body>
</html>
```
## Engine
### Create engine instance
```js
const elpy = new Elpy(
  "#element", // id element canvas or HTML object element get by document.querySelector()
  500, // width
  500, // height
  
  // options
  {
    preload, // default - true, enable / disable preloader
    favicon // default - true, enable / disable favicon
  }
)

elpy.create();
alpy.add();
elpy.key();
elpy.keydown();
elpy.keyup();
elpy.mousemove();
elpy.click();
elpy.tick();
elpy.nextTick();
elpy.checkObjectInViewport();
elpy.fixingCamera();
elpy.unfixingCamera();
elpy.on();

// getters
elpy.width;
elpy.height;
elpy.offset;
elpy.objects;
```
---
### create(name, x, y, width, height, options)
| name | type |
| :---: | :---: |
| **`name`** | `<String>` |
| **`x`** | `<Number>` |
| **`y`** | `<Number>` |
| **`width`** | `<Number>` |
| **`height`** | `<Number>` |

> Creates and returns an engine object.

<sub>_min example_</sub>
```js
const player = elpy.create('player', 10, 10, 20, 20);
```
<sub>_max example_</sub>
```js
const player = elpy.create('player', 10, 10, 20, 20, {
  obstacle: true, // default - true
  activity: false, // default - false
  pushing: false, // default - false
  disabledEvents: false, // default - false
  type: 'player object', // default - null
  custom: {}, // default - null
  color, // default - 'black'
  // image: '' or image: { src: '', repeat: false }
  image: { 
    src: '', // default - null
    repeat: false // default - false
  },
  images: {
    list: // default - null
    [
      {
        paths: ['images/player_left.png', 'images/player_right.png'], // links for image.
        state: 'move:left', // in what condition are the images available. player.state = 'move:left'.
        time: 100 // if player.animate = true - switching time between images.
      }
    ], 
  }
});
```
---
## Object
### run(step)
| name | type | default |
| :---: | :---: | :---: |
| **`step`** | `<Number>` | `1` |

>Vector movement. Moves in different directions depending on positive or negative values.

<sub>_min example_</sub>
```js
player.run();
```
<sub>_max example_</sub>
```js
player.run(-1);
```
---
### move(x, y)
| name | type |
| :---: | :---: |
| **`x`** | `<Number>` |
| **`y`** | `<Number>` |

>Move by coordinates.

```js
player.move(10, 10);
```
---
### fly(degrees, distance, step)
| name | type | default |
| :---: | :---: | :---: |
| **`degrees`** | `<Number>` |
| **`distance`** | `<Number>` | `0` |
| **`step`** | `<Number>` | `1` |

>Vector flight.

<sub>_min example_</sub>
```js
player.fly(0);
```
<sub>_max example_</sub>
```js
player.fly(0, 100, 10);
```
---
### jump(height, multiplier, forced)
| name | type | default |
| :---: | :---: | :---: |
| **`height`** | `<Number>` |
| **`multiplier`** | `<Number>` | `0.1` |
| **`forced`** | `<Boolean>` | `false` |

<sub>_min example_</sub>
```js
player.jump(10);
```
<sub>_max example_</sub>
```js
player.jump(10, 0.5, true);
```
---
### fall(multiplier)
| name | type | default |
| :---: | :---: | :---: |
| **`multiplier`** | `<Number>` | `0.1` |

>Free fall.

<sub>_min example_</sub>
```js
player.fall();
```
<sub>_max example_</sub>
```js
player.fall(0.5);
```
---
### push(object)
| name | type |
| :---: | :---: |
| **`object`** | `<Object>` |

> Pushing an object. The one who pushes must have a collision with what he pushes.

```js
player.push(object);
```
---
### rotate(degrees, x, y)
| name | type | default |
| :---: | :---: | :---: |
| **`degrees`** | `<Number>` |
| **`x`** | `<Number>` | `0` |
| **`y`** | `<Number>` | `0` |

> Object rotation.

<sub>_min example_</sub>
```js
player.rotate(90);
```
<sub>_max example_</sub>
```js
player.rotote(90, 10, 20);
```
---
### stop()

> Stop: jump, fall, fly.

```js
player.stop();
```
---
### destroy()

> Destroy object.

```js
player.destroy();
```
---
### collision(object)
| name | type |
| :---: | :---: |
| **`object`** | `<Object>` |

> Add collision object.

```js
player.collision(object);
```
---
### on(event, callback)
| name | type |
| :---: | :---: |
| **`event`** | `<String>` |
| **`callback`** | `<Function>` |

> Add an event listener.

```js
player.on('eventName', () => {
  // Event handling.
});
```
#### Event: `'collision'`
> Callback arguments.

| name | type |
| :---: | :---: |
| **`object`** | `<Object>` |
| **`side`** | `<String>` |

```js
player.on('collision', (object, side) => {
  // object - collision object.
  // side - side of the object that was collided.
});
```
#### Event: `'move'`
```js
player.on('move', () => {
  // Event handling.
});
```
#### Event: `'rotate'`
```js
player.on('rotate', () => {
  // Event handling.
});
```
#### Event: `'destroy'`
```js
player.on('destroy', () => {
  // Event handling.
});
```
#### Event: `'state'`
```js
player.on('state', () => {
  // Event handling.
});
```
#### Event: `'jump'`
> Callback arguments.

| name | type | description |
| :---: | :---: | :--: |
| **`event`** | `<Object>` | <a href="#event-object">link</a> |

```js
player.on('jump', (event) => {
  // event - event object.
});
```
#### Event: `'fall'`
> Callback arguments.

| name | type | description |
| :---: | :---: | :--: |
| **`event`** | `<Object>` | <a href="#event-object">link</a> |

```js
player.on('fall', (event) => {
  // event - event object.
});
```
#### Event: `'fly'`
> Callback arguments.

| name | type | description |
| :---: | :---: | :--: |
| **`event`** | `<Object>` | <a href="#event-object">link</a> |

```js
player.on('fly', (event) => {
  // event - event object.
});
```
#### Event object

> The object that is returned in the event callback: `jump`, `fall`, `fly`.

| name | type | description |
| :---: | :---: | :--- |
| `stopped` | `<Boolean>` | The property will be `true` if the object has been stopped. |
| `paused` | `<Boolean>` | The property will be `true` if the object has been paused. |
| `stop()` | | Stop object. If he was in a state: `jump`, `fall`, `fly`. |
| `pause()` | | Pause object. If he was in a state: `jump`, `fall`, `fly`. |
| `resume()` | | Resume object. If it was paused. |

```js
player.on('jump', (event) => {
  event.stopped; // true / false
  event.paused; // true / false
  event.stop();
  event.pause();
  event.resume();
});
```
## Object getters
<sub>_min example_</sub>
```js
player.name;
```
| name | type | description |
| :---: | :---: | :--- |
| name | `<String>` | Returns the name of the object. |
| options | `<Object>` | Returns object options. |
| track | `<Object>` | Returns the object's previous moves. |
| dest | `<Object>` | Returns the coordinates where the object is moving. |
| offset | `<Object>` | Returns the offset coordinates of an object. |
| isPushing | `<Boolean>` | Is it possible to push an object. |
| isJumping | `<Boolean>` | Is the object in a jump. |
| isFlying | `<Boolean>` | Is the object in fly. |
| isExist | `<Boolean>` | Does the object exist. |
| x | `<Number>` |  |
| y | `<Number>` |  |
| width | `<Number>` |  |
| height | `<Number>` |  |
| state | `<String>` | Returns the current state of the object. |
| animate | `<Boolean>` | Is the object animated. |
| ghost | `<Boolean>` | Whether collision is canceled with other objects that go to it. |
| degrees | `<Number>` |  |
| added | `<Boolean>` | Is the object added. |
## Object setters
<sub>_min example_</sub>
```js
player.x;
```
| name | type | description |
| :---: | :---: | :--- |
| x | `<Number>` |  |
| y | `<Number>` |  |
| width | `<Number>` |  |
| height | `<Number>` |  |
| state | `<String>` | Used to switch textures. |
| animate | `<Boolean>` | Whether to animate the object. |
| ghost | `<Boolean>` | Cancels collision with other objects that go to it. |
| added | `<Boolean>` | Is the object added. |
## Development
```
npm run serve
```
## License
[MIT](https://github.com/space2pacman/elpy/blob/master/LICENSE.md)
