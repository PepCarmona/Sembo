# Sembo API Test

Hello, my name is Pep Carmona and I am a 25 year-old Software Developer. This is my solution proposal to Sembo's
client-server application to retrieve, compute and display data extracted from an API.

My proposal is developed using Javascript to consume and compute the data, and HTML and CSS to display it.
The Javascript part is formed by two sections: Server-Side and Client-Side.

* Server-Side Javascript uses _NodeJs_ (with _ExpressJs_) to setup a server and a routing system. 

    In this section the whole list of hotels per country is retrieved from the API with the `getHotels()` function, 
    using the _https_ module of _NodeJs_ and a _Promise_ architecture, that allows asynchronous data manipulation further on. 
    Since this API has a high feilure rate, this Promise is encapsulated in a _recursive loop_ to automatically
    retry data retrieval in case of API error. Once successfully retrieved, this data is computed and score 
    average and top 3 scorers are computed. Finally, an _ExpressJs_ instance is used to setup a route that responds
    to a get request and sends back computed data of the country depending on the iso received as query param.


* Client-Side Javascript uses the _fetch API_ to make a get request to the _NodeJs_ server through the _ExpressJs_ route.

    At the client side, the program requests the computed data with the `fetchStats()` function, that takes an iso
    as parameter and returns a _Promise_ of the computed stats of the selected iso country. Then a `fetchAllStats()`
    function is called on page load to fetch _in parallel_ the stats of all the available iso's, and store the result 
    in an associative array to be used on user interaction. This javascript also defines buttons interactions and
    hidrates the static HTML with the fetched data.


----


###  REQUIREMENTS

- **NodeJs**: the server side javascript uses node to setup a server that listens to requests on port **2323**.


----


### INSTRUCTIONS 

The script automatically runs the server process and opens the client webpage on the default browser.

- **WINDOWS** Users -> run the `sembo-win` script via double click or powershell

- **LINUX** Users   -> run the `sembo-linux` script via double click (only if manually allowed) or terminal


----


                                                                                    Developed in Ubuntu 18.04
                                                                                    using Visual Studio Code as IDE
                                                                                    using Google Chrome as browser

                                                                                    Tested in Windows 10
                                                                                    Tested in Ubuntu 20.04
                                                                                    Tested in WSL2 in Windows 10