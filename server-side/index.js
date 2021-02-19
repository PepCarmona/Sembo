/* ---------- API CALL ---------- */

const https = require('https');

    /*  the server takes previously validated 'iso' and retrieves data from the backend API  */
function getHotels (iso, header) {
    const options = {
        host: 'developers.sembo.com',
        path: `/sembo/hotels-test/countries/${iso}/hotels`,
        protocol: 'https:',
        headers: {
            'X-API-Key': header
        }
    }
    return new Promise ((resolve, reject) => {
        https.get(options, (res) => {
            /*  if response is 'OK' the program proceeds with data retrieve and manipulation  */
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
            /*  if response is not 'OK' prints error  */
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

    /*  recursive loop through Promise to automatically re-fetch hotels data in case of API failure  */
function getHotelStats(iso, header) {
    return getHotels(iso, header).then(function(resolve) {
        if (resolve === 'API Error') {
            return getHotelStats(iso, header);
        } else {
            if (resolve === 'ISO Error') {
                return resolve;
            } else {
                let stats = {
                    average: getAverageScore(JSON.parse(resolve)),
                    top3: getTop3(JSON.parse(resolve))
                }
                console.log(` ---> Stats sent ('${iso}')`)
                return stats;
            }
        }
    });
}

let getAverageScore = function (hotels) {
    return hotels.map(hotel => hotel.score)
                 .reduce((aggregator, score) => aggregator + score) / hotels.length;
}

let getTop3 = function (hotels) {
    return hotels.sort((a, b) => b.score - a.score).splice(0, 3)
                 .map(hotel => hotel.name);
}


/* ---------- ROUTING ---------- */

const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors())

app.get('/stats', async (req, res) => {
    const mail = req.header('x-mail');
    const hashedMail = require('crypto').createHash('sha1').update(mail).digest('hex');
    if (mail == null) {
        res.statusCode = 401;
        res.send('X-Mail header not provided');
    } else {
        let stats = await getHotelStats(req.query.iso, hashedMail);
        if (stats === 'ISO Error') {
            res.statusCode = 404;
            res.send('No hotels exist for selected ISO');
        }
        else {
            res.statusCode = 200;
            res.send(stats);
        };
    }
});

app.listen(2323, () => {
    console.log('App listening on port 2323');
})