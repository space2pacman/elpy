![logo](/docs/images/logo.png)

2D JavaScript game engine.

[Demo](https://space2pacman.github.io/elpy/docs/) | [Game examples](https://space2pacman.github.io/elpy/docs/examples.html)

## Docs
- <a href="#install">Install</a>
- <a href="#basic-usage-example">Basic usage example</a>
- <a href="#object">Object</a>
  - <a href="#create-object">Create object</a>
  - <a href="#rundelta-step">run()</a>
  - <a href="#movex-y">move()</a>
  - <a href="#flydegrees-distance-step">fly()</a>
  - <a href="#jumpheight-multiplier-forced">jump()</a>
  - <a href="#fallmultiplier">fall()</a>
  - <a href="#pushobject-distance">push()</a>
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
- <a href="#getters--setters">Getters / Setters</a>
- <a href="#license">License</a>
## Install
```js

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
    const wall = elpy.create('wall', 100, 50, 20, 20, { color: 'brown' })

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
    
    elpy.load();
  </script>
</body>
</html>
```
## Engine instance
### Create engine instance
```js
const elpy = new Elpy(
  "#element", // id element canvas or HTML object element get by document.querySelector()
  500, // width
  500, // height
  
  // options, not required
  {
    preload: true // default - true, enable / disable preloader
  }
)

/*
elpy.load();

Method called at the end of the code. 
Needed for the preloader if it is enabled (it is enabled by default).
If the preloader is disabled, then the "elpy.load();" method is not needed.
*/

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
elpy.load();

// getters
elpy.width;
elpy.height;
elpy.offset;
elpy.objects;
```
## Object
### Create object
```js
const player = elpy.create(
  'player',
  10,
  10,
  20,
  20,
  {
    obstacle,
    activity,
    main,
    pushing,
    disabledEvents,
    type,
    custom,
    color,
    image: {
      src,
      repeat,
      rendering,
      cached
    },
    images: {
      list,
      rendering,
      cached
    },
    offset: {
      x,
      y
    }
  }
)
```
---
### run(delta, step)
| name | type | default | value |
| :---: | :---: | :---: | :---: |
| **`delta`** | `<Number>` | `1` | `1, -1` |
| **`step`** | `<Number>` | `1` |

>Vector movement.

<sub>_min example_</sub>
```js
player.run();
```
<sub>_max example_</sub>
```js
player.run(-1, 10);
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
### push(object, distance)
| name | type | default |
| :---: | :---: | :---: |
| **`object`** | `<Object>` |
| **`distance`** | `<Number>` | `1` |

> Pushing an object. The one who pushes must have a collision with what he pushes.

<sub>_min example_</sub>
```js
player.push(object);
```
<sub>_max example_</sub>
```js
player.push(object, 10);
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
})
```
## Getters / Setters
<table width="100%" style="display: table">
  <tr>
    <td>
      <b>Getters</b>
    </td>
    <td>
      <b>Setters</b>
    </td>
  </tr>
  <tr>
    <td>
      <table>
        <tr>
          <td align="center">
            <b>name</b>
          </td>
          <td align="center">
            <b>type</b>
          </td>
          <td>
            <b>description</b>
          </td>
        </tr>
        <tr>
          <td align="center">name</td>
          <td align="center">
            <code>&lt;String&gt;</code>
          </td>
          <td>Returns the name of the object.</td>
        </tr>
        <tr>
          <td align="center">options</td>
          <td align="center">
            <code>&lt;Object&gt;</code>
          </td>
          <td>Returns object options.</td>
        </tr>
        <tr>
          <td align="center">track</td>
          <td align="center">
            <code>&lt;Object&gt;</code>
          </td>
          <td>Returns the object's<br> previous moves.</td>
        </tr>
        <tr>
          <td align="center">dest</td>
          <td align="center">
            <code>&lt;Object&gt;</code>
          </td>
          <td>Returns the coordinates<br> where the object is moving.</td>
        </tr>
        <tr>
          <td align="center">offset</td>
          <td align="center">
            <code>&lt;Object&gt;</code>
          </td>
          <td>Returns the offset<br> coordinates of an object.</td>
        </tr>
        <tr>
          <td align="center">isPushing</td>
          <td align="center">
            <code>&lt;Boolean&gt;</code>
          </td>
          <td>Is it possible to push an object.</td>
        </tr>
        <tr>
          <td align="center">isJumping</td>
          <td align="center">
            <code>&lt;Boolean&gt;</code>
          </td>
          <td>Is the object in a jump.</td>
        </tr>
        <tr>
          <td align="center">isFlying</td>
          <td align="center">
            <code>&lt;Boolean&gt;</code>
          </td>
          <td>Is the object in fly.</td>
        </tr>
        <tr>
          <td align="center">isExist</td>
          <td align="center">
            <code>&lt;Boolean&gt;</code>
          </td>
          <td>Does the object exist.</td>
        </tr>
        <tr>
          <td align="center">x</td>
          <td align="center">
            <code>&lt;Number&gt;</code>
          </td>
          <td></td>
        </tr>
        <tr>
          <td align="center">y</td>
          <td align="center">
            <code>&lt;Number&gt;</code>
          </td>
          <td></td>
        </tr>
        <tr>
          <td align="center">width</td>
          <td align="center">
            <code>&lt;Number&gt;</code>
          </td>
          <td></td>
        </tr>
        <tr>
          <td align="center">height</td>
          <td align="center">
            <code>&lt;Number&gt;</code>
          </td>
          <td></td>
        </tr>
        <tr>
          <td align="center">state</td>
          <td align="center">
            <code>&lt;String&gt;</code>
          </td>
          <td>Returns the current state of the object.</td>
        </tr>
        <tr>
          <td align="center">animate</td>
          <td align="center">
            <code>&lt;Boolean&gt;</code>
          </td>
          <td>Is the object animated.</td>
        </tr>
        <tr>
          <td align="center">ghost</td>
          <td align="center">
            <code>&lt;Boolean&gt;</code>
          </td>
          <td>Whether collision is canceled<br> with other objects that go to it.</td>
        </tr>
        <tr>
          <td align="center">degrees</td>
          <td align="center">
            <code>&lt;Number&gt;</code>
          </td>
          <td></td>
        </tr>
        <tr>
          <td align="center">added</td>
          <td align="center">
            <code>&lt;Boolean&gt;</code>
          </td>
          <td>Is the object added.</td>
        </tr>
      </table>
    </td>
    <td>
      <table>
        <tr>
          <td align="center">
            <b>name</b>
          </td>
          <td align="center">
            <b>type</b>
          </td>
          <td>
            <b>description</b>
          </td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;<br>&nbsp;</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;<br>&nbsp;</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;<br>&nbsp;</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td align="center">x</td>
          <td align="center">
            <code>&lt;Number&gt;</code>
          </td>
          <td></td>
        </tr>
        <tr>
          <td align="center">y</td>
          <td align="center">
            <code>&lt;Number&gt;</code>
          </td>
          <td></td>
        </tr>
        <tr>
          <td align="center">width</td>
          <td align="center">
            <code>&lt;Number&gt;</code>
          </td>
          <td></td>
        </tr>
        <tr>
          <td align="center">height</td>
          <td align="center">
            <code>&lt;Number&gt;</code>
          </td>
          <td></td>
        </tr>
        <tr>
          <td align="center">state</td>
          <td align="center">
            <code>&lt;String&gt;</code>
          </td>
          <td>Used to switch textures.</td>
        </tr>
        <tr>
          <td align="center">animate</td>
          <td align="center">
            <code>&lt;Boolean&gt;</code>
          </td>
          <td>Whether to animate the object.</td>
        </tr>
        <tr>
          <td align="center">ghost</td>
          <td align="center">
            <code>&lt;Boolean&gt;</code>
          </td>
          <td>Cancels collision with<br> other objects that go to it.</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td align="center">added</td>
          <td align="center">
            <code>&lt;Boolean&gt;</code>
          </td>
          <td>Is the object added.</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

## License
[MIT](https://github.com/space2pacman/elpy/blob/master/LICENSE.md)
