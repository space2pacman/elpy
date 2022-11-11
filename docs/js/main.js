const editor = ace.edit("editor");
const examplesLinks = document.querySelector('.js-examples-links');

editor.setOption('useWorker', false);
editor.session.setMode("ace/mode/javascript");
editor.setTheme("ace/theme/monokai");
editor.on('change', run);

init();

function run() {
    const elpy = new Elpy('#field', screen.width <= 992 ? screen.width : 480, 300, { preload: false });

    setTimeout(() => {
        clearIntervals();            
        destroyObjects(elpy.objects);

        const func = new Function('elpy', editor.getValue());

        func(elpy);

        elpy.load();
    });
}

function clearIntervals() {
    for(let i = 0; i < 10000; i++) {
        clearInterval(i);
    }
}

function destroyObjects(objects) {
    for(const name in objects) {
        objects[name].destroy();
    }
}

function clickFirstLink() {
    examplesLinks.children[0].click();
}

function init() {
    examplesLinks.addEventListener('click', event => {
        if (event.target.classList.contains('example-link')) {
            const exampleCode = event.target.getAttribute('data-example');
    
            for(let i = 0; i < examplesLinks.children.length; i++) {
                examplesLinks.children[i].classList.remove('active');
            }
    
            event.target.classList.add('active');
    
            if (examplesCode[exampleCode]) {
                editor.setValue(examplesCode[exampleCode]);
                editor.clearSelection();
            }
        }
    });

    clickFirstLink();
}