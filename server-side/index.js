/* ---------- API CALL ---------- */

const https = require('https');

// The program takes previously validated 'iso' and retrieves data from the backend API
function getHotels (iso) {
    return new Promise ((resolve, reject) => {
        https.get(`https://developers.sembo.com/sembo/hotels-test/countries/${iso}/hotels`, (res) => {
            // if response is 'OK' the program proceeds with data retrieve and manipulation
            if (res.statusCode === 200) {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    if (JSON.parse(data).length === 0) resolve('ISO Error');
                    else {
                        resolve(data);
                    }
                });
            // if response is not 'OK' prints error
            } else {
                console.log(`Error ${res.statusCode}. Retrying...`);
                resolve('API Error');
            }
        }).on('error', (err) => {
            reject(err);
        })
    })
}


/* ---------- DATA MANIPULATION ---------- */

let getAverageScore = function (hotels) {
    return hotels.map(hotel => hotel.score)
                 .reduce((aggregator, score) => aggregator + score) / hotels.length;
}

let getTop3 = function (hotels) {
    return hotels.sort((a, b) => b.score - a.score).splice(0, 3)
                 .map(hotel => hotel.name);
}

// Recursive loop through Promise to automatically re-fetch hotels data in case of API failure
function getHotelStats(iso) {
    return getHotels(iso).then(function(resolve) {
        if (resolve === 'API Error') {
            return getHotelStats(iso);
        } else {
            if (resolve === 'ISO Error') {
                return resolve;
            } else {
                let stats = {
                    average: getAverageScore(JSON.parse(resolve)),
                    top3: getTop3(JSON.parse(resolve))
                }
                console.log(stats.average);
                console.log(stats.top3);
                return stats;
            }
        }
    });
}


/* ---------- SERVER SETUP ---------- */

const http = require('http');
const hostname = '127.0.0.1';
const port = '2323';

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end();
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


/* ---------- ROUTING ---------- */

const express = require('express');
const app = express();

app.get('/', async (req, res) => {
    let stats = await getHotelStats(req.query.iso);
    if (stats === 'ISO Error') res.send('No hotels exist for selected ISO');
    else res.send(stats);
});
app.get('/test', (req, res) => {
    res.send('Test');
});

app.listen(2324, () => {
    console.log('App listening on port 2324');
})