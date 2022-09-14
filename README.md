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
### _create object_
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
### _run_(delta, step)
| name | type | default | value |
| :---: | :---: | :---: | :---: |
| **`delta`** | `<Number>` | `1` | `1, -1` |
| **`step`** | `<Number>` | `1` | |

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
### _move_(x, y)
`x` type: `Number`  
`y` type: `Number`

>Move by coordinates.

```js
player.move(10, 10);
```
---
### _fly_(degrees, distance, step)
`degrees` type: `Number`  
`distance` type: `Number` | default: `0`  
`step` type: `Number` | default: `1`

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
### _jump_(height, multiplier, forced);
`height` type: `Number`  
`multiplier` type: `Number` | default: `0.1`  
`forced` type: `Boolean` | default: `false`

<sub>_min example_</sub>
```js
player.jump(10);
```
<sub>_max example_</sub>
```js
player.jump(10, 0.5, true);
```
---

```
player.jump();
player.fall();
player.push();
player.rotate();
player.stop();
player.destroy();
player.collision();
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
