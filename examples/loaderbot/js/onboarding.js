(function() {
    const driver = new Driver();
    const actions = document.querySelector('#actions');
    const run = document.querySelector('#run');
    const algorithmList = document.querySelector('#algorithm-list');
    const loaderbotOnboarding = localStorage['loaderbot-onboarding'];

    if (loaderbotOnboarding === 'true') {
        return;
    }

    driver.highlight({
        element: '#actions',
        popover: {
            title: 'Click x4 on button "arrow up"',
            showButtons: false
        }
    });

    actions.addEventListener('click', () => {
        if (algorithmList.childNodes.length === 4) {
            driver.reset();

            setTimeout(() => {
                driver.highlight({
                    element: '#run',
                    popover: {
                        title: 'Click on run',
                        position: 'left',
                        showButtons: false
                    }
                });
                
                localStorage['loaderbot-onboarding'] = true;
            }, 1000);
        }
    });

    run.addEventListener('click', () => {
        driver.reset();
    })
})()