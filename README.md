![logo](/docs/images/logo.png)

2D JavaScript game engine

[Demo](https://space2pacman.github.io/elpy/docs/) / [Game examples](https://space2pacman.github.io/elpy/docs/examples.html)

## Engine instance
```js
// Create app
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
Method called at the end of the code. 
Needed for the preloader if it is enabled (it is enabled by default).
If the preloader is disabled, then the "elpy.load();" method is not needed.
*/
elpy.load();

elpy.create();
alpy.add();

elpy.key();
elpy.keydown();
elpy.keyup();
elpy.mousemove();
elpy.click();

elpy.checkObjectInViewport();

elpy.tick();
elpy.nextTick();

// getters
elpy.width;
elpy.height;
elpy.offset;
elpy.objects;
```

## Object
### create object
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
| name | type | default |
| :---: | :---: | :---: |
| **`object`** | `<Object>` |

> Add collision object.

```js
player.collision(object);
```
---
```
player.obstacles();
player.on();

//getters
player.name;
player.options;
player.track;
player.dest;
player.offset;
player.isPushing;
player.isJumping;
player.isFlying;
player.isFalling;
player.isExist;
player.x;
player.y;
player.width;
player.height;
player.state;
player.animate;
player.ghost;
player.degrees;
player.added;
```
