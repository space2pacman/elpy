(function() {
    const driver = new Driver();
    const actions = document.querySelector('.js-buttons-actions');
    const run = document.querySelector('.js-button-run');
    const resetOnboarding = document.querySelector('.js-reset-onboarding');
    const algorithmList = document.querySelector('.js-algorithm-list');
    const loaderbotOnboarding = localStorage['loaderbot-onboarding'];

    resetOnboarding.addEventListener('click', () => {
        delete localStorage['loaderbot-onboarding'];

        location.reload();
    });

    if (loaderbotOnboarding === 'true') {
        return;
    }

    driver.highlight({
        element: '.js-buttons-actions',
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
                    element: '.js-button-run',
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
    });
})()