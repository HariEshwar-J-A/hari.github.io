import { getCityDetails, getNextFiveHrs } from './weather-data.js';
import { ContinentCards, CityCards, CitySelection } from './weather-classes.js';
(async function() {
    // ---------- Variable Declarations ----------
    // ----- Generic Variables -----
    let data;

    // ----- Top Section Variables -----
    let citySelection = document.getElementById('city');

    // ----- Middle Section Variables -----
    let displayTop = document.getElementById('display-top');
    let cardBox = document.getElementsByClassName('card-box')[0];
    let climateQuery = document
        .getElementsByClassName('filters')[0]
        .getElementsByTagName('div');
    let sunnyIcon = climateQuery[0];
    let snowyIcon = climateQuery[1];
    let rainyIcon = climateQuery[2];

    // ----- Bottom Section Variables -----
    let continentSort = document.getElementsByClassName('cont-key')[0];
    let temperatureSort = document.getElementsByClassName('temp-key')[0];

    // ---------- Function Declarations ----------

    // Initialize the Whole page with provided weather data
    await getCityDetails().then((res) => data = res);
    populateCityOptions();
    cityDetailsChange(citySelection.value);
    cityCardsDetailsChange(displayTop.value);
    contCardsDetailsChange();

    // ----- Top Section Functions -----
    // Change the Current city content as the User Queries
    function populateCityOptions() {
        let options = document.getElementById('cities');
        options.innerHTML = '';
        data.forEach(elem => {
            options.innerHTML += `<option value="${elem.cityName}">${elem.cityName}</option>`;
        });
    }

    Window.prototype.lettersOnly = function(input) {
        let regex = /[^a-z]/gi;
        input.value = input.value.replace(regex, "");
        input.value = input.value[0].toUpperCase() + input.value.slice(1);
    }

    async function cityDetailsChange(cityInput) {
        let selectedCity = cityInput.toLowerCase();
        let index = data.findIndex((city) => (city.cityName == cityInput));
        if (index > -1) {

            // -- City Details --
            let city = new CitySelection(data[index]);
            document.getElementsByClassName('city-img')[0].innerHTML = `<img src="../assets/city-icons/${selectedCity}.svg" alt="${cityInput}">`;
            document.getElementById('headTempc').innerHTML = `Temp <sup>&#8728</sup>C <br><br><b>${city.temperature}</b>`;
            document.getElementById('headHumid').innerHTML = `Humidity<br><br><b>${city.humidity}</b>`;
            document.getElementById('headTempf').innerHTML = `Temp F<br><br><b>${city.celciusToFarenheit()}</b>`
            document.getElementById('headPrecipitation').innerHTML = `Precipitation<br><br><b>${city.precipitation}</b>`;
            document.getElementById('headDateAndTime').innerHTML = `<b>${city.time.split('')[0]} </b><img src="../assets/meridiem-icons/${city.meridiem.toLowerCase()}State.svg" alt='AM/PM'><br><span>${city.getRequiredDateFormat()}</span>`;

            // -- TimeLine --
            let nextFiveHrs;
            await getNextFiveHrs(`${city.date}, ${city.time}, ${city.cityName}`).then((res) => nextFiveHrs = res.temperature);
            let headTimeArray = document.getElementsByClassName('time-list')[0];
            let headVerticalLineArray = document.getElementsByClassName('vertical-line')[0];
            let headIconArray = document.getElementsByClassName('icons')[0];
            let headTempArray = document.getElementsByClassName('temperature')[0];
            city.populateTimeLine(nextFiveHrs, headTimeArray, headVerticalLineArray, headIconArray, headTempArray);
            return true;
        } else {
            console.log('No cities Found');
            return false;
        }
    }

    // Update the time for the selected city- once per second
    function liveTimer() {
        let jsonData = data.find((d) => d.cityName === document.getElementById('city').value);
        if (jsonData) {
            let city = new ContinentCards(jsonData);
            document.getElementById('headDateAndTime').innerHTML = `<b>${city.time.split(' ')[0]} </b><img src="../assets/meridiem-icons/${city.meridiem.toLowerCase()}State.svg" alt='AM/PM'><br><span>${city.getRequiredDateFormat()}</span>`;
        };
    }

    // ----- Middle Section Functions -----
    // Change the City cards as the User filters
    function cityCardsDetailsChange(displayTop) {
        let dataArray = [];
        let displayCardCount = displayTop;
        for (var i in data) {
            dataArray.push(new CityCards(data[i]));
        }
        dataArray = dataArray.sort((a, b) => parseInt(a.temperature) < parseInt(b.temperature) ? 1 : -1);
        cardBox.innerHTML = '';

        // Set each city parameters to its respective city card
        let createcityCards = function(cities) {
            let cardCount = cities.length;
            let requiredCount = displayCardCount < cardCount ? displayCardCount : cardCount;
            for (let i = 0; i < requiredCount; i++) {
                cardBox.innerHTML += cities[i].getHTML();
                cardBox.lastElementChild.style.background = cities[i].getBG();
            }
        };

        //Apply filter (Sunny, Snowy, Rainy) on the available city data
        if (document.getElementsByClassName('active-icon')[0].id === 'sunny-cities') {
            let cities = dataArray.filter((city) => (parseInt(city.temperature) > 29));
            createcityCards(cities);
        } else if (document.getElementsByClassName('active-icon')[0].id === 'snowy-cities') {
            let cities = dataArray.filter((city) => (parseInt(city.temperature) <= 29 && parseInt(city.temperature) >= 20));
            createcityCards(cities);
        } else {
            let cities = dataArray.filter((city) => (parseInt(city.temperature) < 20));
            createcityCards(cities);
        }

        if (cardBox.scrollWidth > cardBox.clientWidth) { scrollArrowsAppear(); } else { scrollArrowsDisappear(); }

        // Set Event Listeners for the updated Cards
        setEventListenersCityCards();
    };

    // Set Event Listeners for requested City cards
    function setEventListenersCityCards() {
        let cardCount = document.getElementsByClassName('card').length;
        for (let i = 0; i < cardCount; i++) {
            document.getElementsByClassName('card')[i].addEventListener('click', function(e) {
                document.body.scrollTop = 0; // for Safari
                document.documentElement.scrollTop = 0; //for Chrome
                document.getElementById('city').value = this.getElementsByClassName('cname')[0].children[0].innerText;
                cityDetailsChange(document.getElementById('city').value);
            });
        }
    };

    // Make the scroll arrows visible
    function scrollArrowsAppear() {
        let cardBox = document.getElementsByClassName('card-box')[0];
        Array.from(document.getElementsByClassName('buttons')).forEach(element => element.style.removeProperty('display'));
        document.getElementById('forwardArrow').addEventListener('click', (e) => cardBox.scrollBy(335, 0));
        document.getElementById('backArrow').addEventListener('click', (e) => cardBox.scrollBy(-335, 0));
        document.getElementById('forwardArrow').ondblclick = ((e) => cardBox.scrollBy(cardBox.scrollWidth, 0));
        document.getElementById('backArrow').ondblclick = ((e) => cardBox.scrollBy(-cardBox.scrollWidth, 0));
    };

    // Hide the scroll arrows
    function scrollArrowsDisappear() {
        Array.from(document.getElementsByClassName('buttons')).forEach(element => element.style.display = 'none');
    };

    // ----- Bottom Section Functions -----
    // Change the continent cards as the User sorts
    function contCardsDetailsChange() {

        // Initialize Array of Continent card Objects
        let contArray = [];
        for (let i = 0; i < data.length; i++) { contArray.push(new ContinentCards(data[i])) };

        // Store the boolean values for the type of sort to be made
        let contSort = (document.getElementsByClassName('up-down-icon')[0].children[0].src.split('/').slice(-1) == `arrowDown.svg`);
        let tempSort = (document.getElementsByClassName('up-down-icon')[1].children[0].src.split('/').slice(-1) == `arrowDown.svg`);
        let contCardBox = document.getElementsByClassName('cont-card-box')[0];

        // Clear the Continent card's container
        contCardBox.innerHTML = '';

        // Sort the Continent cards based on the required criteria: Continent Names, Temperature
        contArray = contArray.sort(function(a, b) {
            if (a.timeZone.split('/')[0] === b.timeZone.split('/')[0]) {
                return (tempSort === true ? parseInt(a.temperature) > parseInt(b.temperature) : parseInt(a.temperature) < parseInt(b.temperature)) ? 1 : -1;
            }
            return (contSort === true ? a.timeZone > b.timeZone : a.timeZone < b.timeZone) ? 1 : -1;
        });

        // Update the Continent Cards to HTML DOM
        let requiredCount = 12 < contArray.length ? 12 : contArray.length;
        for (let i = 0; i < requiredCount; i++) {
            contCardBox.innerHTML += contArray[i].getContCardHTML();
        }
        setEventListenersContinentCards();
    };

    // Set Event Listeners for all available continent cards
    function setEventListenersContinentCards() {
        let contCards = document.getElementsByClassName('cont-card');
        let cardCount = contCards.length;
        for (let i = 0; i < cardCount; i++) {
            contCards[i].addEventListener('click', function(e) {
                document.body.scrollTop = 0; // for Safari
                document.documentElement.scrollTop = 0; //for Chrome
                document.getElementById('city').value = this.getElementsByClassName('info')[0].innerText.split(', ')[0];
                cityDetailsChange(document.getElementById('city').value);
            });
        }
    };

    // Change Arrows in Sort
    function changeArrow(url) {
        if (url.src.split('/').slice(-1) == `arrowDown.svg`) {
            url.src = (url.src.split('/').slice(0, -1)).join('/') + `/arrowUp.svg`;
        } else {
            url.src = (url.src.split('/').slice(0, -1)).join('/') + `/arrowDown.svg`;
        }
        contCardsDetailsChange();
    };

    // ---------- Event Declarations ----------

    // ----- Top Section Events -----
    citySelection.onfocus = (() => citySelection.value = '');

    citySelection.onblur = (() => {
        citySelection.value = data.find((d) => citySelection.value === document.getElementById('city').value) ? citySelection.value : 'Kolkata';
        cityDetailsChange(citySelection.value);
    });

    citySelection.addEventListener('input', async function() {
        let status = cityDetailsChange(this.value);
        let stats;
        await status.then((sts) => stats = sts);
        if (stats == true) { this.blur() };
    });

    setInterval(liveTimer, 1000);

    // ----- Middle Section Events-----
    window.addEventListener('resize', function(e) {
        if (document.getElementsByClassName('card-box')[0].scrollWidth > document.getElementsByClassName('card-box')[0].clientWidth) {
            scrollArrowsAppear();
        } else {
            scrollArrowsDisappear();
        }
        cityCardsDetailsChange(displayTop.value);
    });

    // City Weather Filter Events
    sunnyIcon.addEventListener('click', function(event) {
        this.className = 'active-icon';
        snowyIcon.className = '';
        rainyIcon.className = '';
        cityCardsDetailsChange(displayTop.value);
    });

    snowyIcon.addEventListener('click', function(event) {
        this.className = 'active-icon';
        sunnyIcon.className = '';
        rainyIcon.className = '';
        cityCardsDetailsChange(displayTop.value);
    });

    rainyIcon.addEventListener('click', function(event) {
        this.className = 'active-icon';
        snowyIcon.className = '';
        sunnyIcon.className = '';
        cityCardsDetailsChange(displayTop.value);
    });

    // Display Top Elements -> Input Events
    displayTop.addEventListener('input', function(e) {
        cityCardsDetailsChange(Math.min(Math.max(this.value, 3), 10));
    });

    displayTop.onblur = (() => {
        if (displayTop.value < 3) { displayTop.value = 3 };
        if (displayTop.value > 10) { displayTop.value = 10 };
    });

    // ----- Bottom Section Events-----
    continentSort.addEventListener('click', (e) => changeArrow(continentSort.children[1].children[0]));
    temperatureSort.addEventListener('click', (e) => changeArrow(temperatureSort.children[1].children[0]));
})();