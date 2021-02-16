// Definition of Node https module which allows interaction via HTTPS 
const https = require("https");

// The program takes previously validated 'iso' and retrieves data from the backend API
let getHotels = function (iso) {
    http.get(`https://developers.sembo.com/sembo/hotels-test/countries/${iso}/hotels`, (res) => {
        // if response is 'OK' the program proceeds with data retrieve and manipulation
        if (res.statusCode === 200) {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                let hotels = JSON.parse(data);
                /*  average is calculated retrieving only the score property of each hotel, 
                    adding them all and dividing by total of hotel occurrences  */
                let average = JSON.parse(data).map(hotel => hotel.score)
                                          .reduce((aggregator, score) => aggregator + score) / hotels.length;
                /* top 3 are calculated sorting the hotels (descendent) and retrieving first 3 elements */
                let top = hotels.sort((a, b) => b.score - a.score).splice(0, 3);
                console.log('Average: ' + average);
                console.log('Top 3:');
                top.forEach(hotel => {
                    console.log(`${hotel.name} (${hotel.score})`);
                });
            });
        // if response is not 'OK' prints error and retries automatically
        } else {
            console.log(`Error ${res.statusCode}. Retrying...`)
            getHotels(iso);
        }
    });
}
getHotels('es');