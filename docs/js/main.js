const editor = ace.edit("editor");
const examplesLinks = document.querySelector('.js-examples-links');
const elpy = new Elpy('#field', 480, 300, { preload: false });

editor.setOption('useWorker', false);
editor.session.setMode("ace/mode/javascript");
editor.setTheme("ace/theme/monokai");
editor.on('change', run);

init();

function run() {
    setTimeout(() => {
        clearIntervals();            
        destroyObjects();

        const func = new Function('elpy', editor.getValue());

        func(elpy);
    });
}

function clearIntervals() {
    for(let i = 0; i < 10000; i++) {
        clearInterval(i);
    }
}

function destroyObjects() {
    for(const name in elpy.objects) {
        elpy.objects[name].destroy();
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
    
            event.target.classList.add('active')
    
            if (examplesCode[exampleCode]) {
                editor.setValue(examplesCode[exampleCode]);
                editor.clearSelection();
            }
        }
    });

    clickFirstLink();
}