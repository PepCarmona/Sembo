/* ---------- UX INTERACTIONS ---------- */

    /* --- Toggle Buttons --- */
let buttons = document.querySelectorAll('.buttons button');
buttons.forEach(button => {
    button.addEventListener('click', function (event) {
        toggleButtons(buttons, event.target);
        fetchStats(event.target.dataset.iso);
    });
});

function toggleButtons(buttons, target) {
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    target.classList.add('active');
    let display = document.querySelector('.display');
    if (display.classList.contains('slim')) display.classList.remove('slim');
    else {
        display.classList.add('slim');
        window.setTimeout(function() {
            display.classList.remove('slim');
        }, 500);
    }
}

    /* --- Toggle Tooltip --- */
document.querySelector('.attributions').addEventListener('mouseenter', event => {
    event.target.children[0].classList.remove('hidden');
});
document.querySelector('.attributions').addEventListener('mouseleave', event => {
    event.target.children[0].classList.add('hidden');
});


/* ---------- AJAX REQUEST ---------- */

function fetchStats(iso) {
    const url = new URL('http://localhost:2323/stats');
    url.search = new URLSearchParams({ iso: iso});
    return new Promise(resolve => {
        fetch(url)
        .then(data => {
            data.text().then(text => {
                resolve(JSON.parse(text));
            });
        })
        .catch(error => console.log(error));
    });
}

async function fetchAllStats() {
    let statsEs = fetchStats('es');
    let statsIT = fetchStats('it');
    let statsFR = fetchStats('fr');
    return {
        es: await statsEs,
        it: await statsIT,
        fr: await statsFR
    }
}

fetchAllStats().then(stats => {
    console.log(stats.es.top3);
});
