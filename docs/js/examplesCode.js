const examplesCode = {
    'moving-elpy': `const options = { image: 'images/elpy.png' };
const obj = elpy.create('object', 0, 0, 40, 46, options);
let x = true;
let y = true;
let step = 1;
let multiplierX = 1;
let multiplierY = 1;

setInterval(() => {
    if (x) {
        if (obj.x >= elpy.width - obj.width) {
            x = false;
        }

        multiplierX = 1;
    } else {
        if (obj.x <= 0) {
            x = true;
        }

        multiplierX = -1;
    }

    if (y) {
        if (obj.y >= elpy.height - obj.height) {
            y = false;
        }

        multiplierY = 1;
    } else {
        if (obj.y <= 0) {
            y = true;
        }

        multiplierY = -1;
    }

    obj.move(
        obj.x + (step * multiplierX), 
        obj.y + (step * multiplierY)
    );
});

elpy.add(obj);`,
    'car': `const options = { image: 'images/car.png' };
const car = elpy.create('car', 0, 0, 30, 55, options);
let degrees = 0;
let switchDirection = false;

car.move(
    elpy.width / 2 - car.width / 2,
    elpy.height / 2 - car.height / 2
);

setInterval(() => {
    if (degrees > 360) {
        degrees = 0;
        switchDirection = !switchDirection;
    }

    car.rotate(switchDirection ? -degrees : degrees);
    car.run(-1);
    degrees++;
});

elpy.add(car);`,
    'paint':`let i = 0;

elpy.mousemove((x, y) => {
    const obj = elpy.create('object' + i, x, y - 10, 1, 1, {
        image: 'images/elpy.png'
    });

    i++;

    elpy.tick(() => {
        if (obj.width >= 40) {
            obj.destroy();

            return false;
        }

        obj.height = obj.height + 2;
        obj.width = obj.width + 2;
        obj.move(obj.x - 1, obj.y - 1);
    });
    elpy.add(obj);
});`
}