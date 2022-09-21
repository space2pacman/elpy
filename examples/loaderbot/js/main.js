(function() {
    const options = {
        ground: {
            '0': {
                image: 'images/ground_01.png'
            }
        },
        objects: {
            '1': {
                image: 'images/block_01.png'
            }
        },
        boxes: {
            '1': {
                pushing: true,
                images: [
                    {
                        paths: ['images/box_01.png'],
                        state: 'default'
                    },
                    {
                        paths: ['images/box_02.png'],
                        state: 'highlighted'
                    }
                ]
            }
        },
        environment: {
            '1': {
                image: 'images/environment_01.png',
                type: 'environment',
                obstacle: false,
            }
        },
        character: {
            images: [
                {
                    paths: ['images/player_up_idle.png'],
                    state: 'up:idle',
                    time: 200
                },
                {
                    paths: ['images/player_up_01.png', 'images/player_up_idle.png', 'images/player_up_02.png', 'images/player_up_idle.png'],
                    state: 'up:move',
                    time: 200
                },
                {
                    paths: ['images/player_right_idle.png'],
                    state: 'right:idle',
                    time: 200
                },
                {
                    paths: ['images/player_right_01.png', 'images/player_right_idle.png', 'images/player_right_02.png', 'images/player_right_idle.png'],
                    state: 'right:move',
                    time: 200
                },
                {
                    paths: ['images/player_down_idle.png'],
                    state: 'down:idle',
                    time: 200
                },
                {
                    paths: ['images/player_down_01.png', 'images/player_down_idle.png', 'images/player_down_02.png', 'images/player_down_idle.png'],
                    state: 'down:move',
                    time: 200
                },
                {
                    paths: ['images/player_left_idle.png'],
                    state: 'left:idle',
                    time: 200
                },
                {
                    paths: ['images/player_left_01.png', 'images/player_left_idle.png', 'images/player_left_02.png', 'images/player_left_idle.png'],
                    state: 'left:move',
                    time: 200
                },
            ]
        }
    }
    const map = {
        ground: [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ],
        objects: [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]
        ],
        boxes: [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 1, 0, 1, 0],
            [0, 0, 1, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ],
        environment: [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ]
    };
    const indexes = {
        ground: {
            '0': 'ground_01',
        },
        objects: {
            '1': 'block_01'
        },
        boxes: {
            '1': 'box_01'
        },
        environment: {
            '1': 'environment_01'
        }
    };
    const elpy = new Elpy('#field', 512, 512);
    const step = 1;
    const unit = 64;
    const obstacles = {};
    const MAX_ACTIONS = 30;
    const actions = [];
    const algorithm = document.querySelector('.js-algorithm-list');
    const buttons = {
        action: document.querySelectorAll('.js-button-action'),
        actions: document.querySelector('.js-buttons-actions'),
        run: document.querySelector('.js-button-run')
    }
    let direction = '';
    let algorithmIsRunned = false;
    let boxesMoved = 0;
    const actionsTimer = [];
    const DESIRED_NUMBER_OF_BOXES_MOVED = 6;
    
    placeObjects('ground', indexes.ground, unit, unit, options.ground);
    placeObjects('objects', indexes.objects, unit, unit, options.objects);
    placeObjects('boxes', indexes.boxes, unit, unit, options.boxes);
    placeObjects('environment', indexes.environment, unit, unit, options.environment);
    
    const character = elpy.create('character', unit * 1, unit * 6, unit, unit, options.character);
    
    elpy.add(character);
    character.collision(obstacles.objects);
    character.collision(obstacles.boxes);
    
    obstacles.boxes.forEach(box => {
        box.collision(obstacles.objects);
        box.collision(obstacles.environment);
    
        box.on('collision', object => {
            if (object.options.type === 'environment') {
                box.state = 'default';
    
                if (direction === 'up') {
                    if (box.y - step === object.y) {
                        box.state = 'highlighted';
                        box.options.pushing = false;
                        boxesMoved++;
                    }
                }
    
                if (direction === 'right') {
                    if (box.x + step === object.x) {
                        box.state = 'highlighted';
                        box.options.pushing = false;
                        boxesMoved++;
                    }
                }
    
                if (direction === 'down') {
                    if (box.y + step === object.y) {
                        box.state = 'highlighted';
                        box.options.pushing = false;
                        boxesMoved++;
                    }
                }
    
                if (direction === 'left') {
                    if (box.x - step === object.x) {
                        box.state = 'highlighted';
                        box.options.pushing = false;
                        boxesMoved++;
                    }
                }
            }
        })
    });
    
    character.on('collision', object => {
        if (object.isPushing) {
            object.push(character);
        }
    });
    
    init();
    
    function placeObjects(type, indexes, width, height, options) {
        for(let i = 0; i < map[type].length; i++) {
            for(let j = 0; j < map[type][i].length; j++) {
                const cell = map[type][i][j];
                const keys = Object.keys(indexes);
                const convertedKeys = keys.map(key => Number(key));
    
                if (convertedKeys.includes(cell)) {
                    const name = indexes[cell];
                    const object = elpy.create(`${name}-${i}-${j}`, width * j, height * i , width, height, options ? JSON.parse(JSON.stringify(options[cell])) : {});
                    
                    elpy.add(object);
    
                    if (!obstacles[type]) {
                        obstacles[type] = [];
                    }
    
                    obstacles[type].push(object);
                }
            }
        }
    }
    
    function updateAlgorithm() {
        checkRunButton();
        
        algorithm.innerHTML = '';
        actions.forEach((action, index) => {
            const button = document.createElement('div');
            const remove = document.createElement('div');
    
            button.classList.add('action');
            button.classList.add('mr-12');
            button.classList.add('mb-12');
            button.setAttribute('data-action', action);
            remove.classList.add('action-remove');
            button.appendChild(remove);
            algorithm.appendChild(button);
    
            remove.addEventListener('click', () => {
                actions.splice(index, 1);
    
                if (!actions.includes('repeat')) {
                    buttons.actions.classList.remove('disabled');
                }
                
                updateAlgorithm();
            });
        });
    }

    function makeAction(state, delay, callback) {
        const STEP_DELAY = 10;
        let actionTimer = setTimeout(() => {
            character.animate = true;
            character.state = state;
    
            let count = 1;
            const timer = setInterval(() => {
                if (count === unit) {
                    const stateType = state.split(':')[0];

                    character.animate = false;
                    character.state = `${stateType}:idle`;
                    clearInterval(timer);
                }
    
                count++;
                callback();
            }, STEP_DELAY);
    
        }, delay);
    
        actionsTimer.push(actionTimer);
    }
    
    function clearActiveActions() {
        algorithm.childNodes.forEach(element => {
            element.classList.remove('active-action');
        });
    }

    function checkRunButton() {
        if (actions.length > 0) {
            buttons.run.classList.remove('disabled');
        } else {
            buttons.run.classList.add('disabled');
        }
    }
    
    function setActiveAction(index) {
        if (algorithmIsRunned) {
            algorithm.childNodes[index].classList.add('active-action');
        }
    }
    
    function runAlgorithm() {
        const DELAY = 1000;
    
        actions.forEach((action, index) => {
            if (boxesMoved === DESIRED_NUMBER_OF_BOXES_MOVED || !algorithmIsRunned) {
                buttons.run.classList.add('play');
                buttons.run.classList.remove('stop');
                
                return;
            }
    
            switch (action) {
                case 'move-left':
                    makeAction('left:move', index * DELAY, () => {
                        direction = 'left';
                        clearActiveActions();
                        setActiveAction(index);
                        character.move(character.x - step, character.y);
                    });
    
                    break;
                case 'move-up':
                    makeAction('up:move', index * DELAY, () => {
                        direction = 'up';
                        clearActiveActions();
                        setActiveAction(index);
                        character.move(character.x, character.y - step);
                    });
    
                    break;
                case 'move-right':
                    makeAction('right:move', index * DELAY, () => {
                        direction = 'right';
                        clearActiveActions();
                        setActiveAction(index);
                        character.move(character.x + step, character.y);
                    });
    
                    break;
                case 'move-down':
                    makeAction('down:move', index * DELAY, () => {
                        direction = 'down';
                        clearActiveActions();
                        setActiveAction(index);
                        character.move(character.x, character.y + step);
                    });
    
                    break;
                case 'repeat':
                    let actionTimer = setTimeout(() => {
                        clearActiveActions();
                        setActiveAction(index);
                    }, (actions.length - 1) * DELAY);
                    let delayedTimerId = setTimeout(() => {
                        runAlgorithm();
                    }, actions.length * DELAY);
    
                    actionsTimer.push(actionTimer);
                    actionsTimer.push(delayedTimerId);
    
                    break;
            }
        });
    }
    
    function stopAlgorithm() {
        actionsTimer.forEach(id => clearInterval(id));
        actionsTimer.splice(0, actionsTimer.length);
        clearActiveActions();
    }
    
    function init() {
        buttons.run.classList.add('disabled');
        buttons.action.forEach(button => {
            button.addEventListener('click', e => {
                const action = e.target.getAttribute('data-action');
    
                if (actions.length < MAX_ACTIONS && !actions.includes('repeat')) {
                    actions.push(action);
                }
    
                if (actions.length >= MAX_ACTIONS || actions.includes('repeat')) {
                    buttons.actions.classList.add('disabled');
                }
    
                updateAlgorithm();
            });
        })
    
        buttons.run.addEventListener('click', () => {
            if (algorithmIsRunned) {
                algorithmIsRunned = false;
                buttons.run.classList.add('play');
                buttons.run.classList.remove('stop');
                stopAlgorithm();
            } else {
                algorithmIsRunned = true;
                buttons.run.classList.remove('play');
                buttons.run.classList.add('stop');
                runAlgorithm();
            }
    
            algorithm.classList.add('runned');
        });
    }
})()