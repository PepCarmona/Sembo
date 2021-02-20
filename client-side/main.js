/* ---------- UX INTERACTIONS ---------- */

    /*  Toggle Buttons  */
let buttons = document.querySelectorAll('.buttons button');
buttons.forEach(button => {
    button.addEventListener('click', function (event) {
        toggleButtons(buttons, event.target);
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

    /*  Toggle Tooltip  */
document.querySelector('.attributions').addEventListener('mouseenter', event => {
    event.target.children[0].classList.remove('hidden');
});
document.querySelector('.attributions').addEventListener('mouseleave', event => {
    event.target.children[0].classList.add('hidden');
});


/* ---------- AJAX REQUEST ---------- */

const mail = 'pep.carmona.coll@gmail.com';

    /*  fetch stats by iso and return a Promise with the object  */
function fetchStats(iso) {
    const url = new URL('http://localhost:2323/stats');
    url.search = new URLSearchParams({ iso: iso});
    return new Promise(resolve => {
        fetch(url, {
            headers: {
                'X-Mail': mail
            }
        })
        .then(data => {
            data.text().then(text => {
                resolve(JSON.parse(text));
            });
        })
        .catch(error => console.log(error));
    });
}

    /*  fetch all stats in parallel  */
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

    /*  fetch all stats on page load and assign click handlers to switch between countries  */
fetchAllStats().then(stats => {
    buttons.forEach(button => {        
        button.addEventListener('click', function(event) {
            if (!document.querySelector('.display').classList.contains('slim')) {
                displayStatsByIso(stats, event.target.dataset.iso)
            } else {
                window.setTimeout(function() {
                    displayStatsByIso(stats, event.target.dataset.iso);
                }, 500);
            }
        });

        /* allow button interaction only after fetch is completed to avoid displaying empty data */
        button.classList.remove('loading');
    });

    document.body.classList.remove('loading');
});

    /*  print fetched stats on html  */
function displayStatsByIso(stats, iso) {
    let average_div = document.querySelector('.display > .average > .body');
    let top3_div = document.querySelector('.display > .top3 > .body');
    let top3_span = document.querySelectorAll('.top3_span');
    for (const key in stats) {
        if (key === iso) {
            average_div.innerHTML = stats[key].average;
            top3_span.forEach((span, index) => {
                span.innerHTML = stats[key].top3[index];
            });
        }
    }
}
