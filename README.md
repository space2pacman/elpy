![logo](/docs/images/logo.png)

2D JavaScript game engine

[Demo](https://space2pacman.github.io/elpy/docs/) / [Game examples](https://space2pacman.github.io/elpy/docs/examples.html)

## Engine

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

## Engine object
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
### _run_(delta, step)
```delta``` type: ```Number``` | default: ```1``` | value: ```1,-1```  
```step``` type: ```Number``` | default: ```1```

Vector movement.
```js
player.run(-1, 10);
```
---
### _move_(x, y)
```x``` type: ```Number```  
```y``` type: ```Number```

Move by coordinates.
```js
player.move(10, 10);
```

```
player.fly(degrees: number, distance: number, step: number);
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
