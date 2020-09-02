import { data } from './data.js';

let locationhref = 'https://harieshwar-j-a.github.io/hari.github.io/';

// CLASS DECLARATIONS
class CityDetails {
    constructor(cityName, dateAndTime, temperature, humidity, timeZone) {
        this.cityName = cityName;
        this.d = new Date();
        this.temperature = temperature;
        this.humidity = humidity;
        this.timeZone = timeZone;
        this.dateAndTime = this.d.toLocaleString("en-US", { timeZone: this.timeZone });
        [this.fullDate, this.time] = this.dateAndTime.split(', ');
        this.meridiem = this.time.split(' ')[1];
        this.time = this.time.split(' ')[0];
    }

    getContinentName() {
        return this.timeZone.split('/')[0];
    }

    celsiusToFarenheit() {
        return `${Math.floor((parseInt(this.temperature)*9/5)+32)} F`;
    }

    getMonthName() {
        return {
            '1': "Jan",
            '2': "Feb",
            '3': "Mar",
            '4': "Apr",
            '5': "May",
            '6': "Jun",
            '7': "Jul",
            '8': "Aug",
            '9': "Sep",
            '10': "Oct",
            '11': "Nov",
            '12': "Dec"
        }[this.fullDate.split('/')[0]];
    }

    getHoursMinutes() {
        return `${this.time.split(':').slice(0,2).join(':')}`;
    }

    getRequiredDateFormat() {
        let [date, year] = this.fullDate.split('/').slice(1, 3);
        if (date.length === 1) { date = '0' + date }
        return date + '-' + this.getMonthName() + '-' + year;
    }

    getHTML() {
        return `<div class='cont-card'>
        <div class="cont">${this.getContinentName()}</div>
        <div class="temp">${this.temperature}</div>
        <div class="info">${this.cityName}, ${this.getHoursMinutes()} ${this.meridiem}</div> 
        <div class="humid"><img src="${locationhref}/images/humidityIcon.svg" alt="humidityIcon">${this.humidity}</div>
        </div>`;
    }
}

class CityCardDetails extends CityDetails {
    constructor(dataJSON) {
        super(dataJSON.cityName, dataJSON.dateAndTime, dataJSON.temperature, dataJSON.humidity, dataJSON.timeZone);
        this.precipitation = dataJSON.precipitation;
    }

    getHTML() {
        return `<div class="card">
        <div class="cname">
            <p><b>${this.cityName}</b></p>
            <p>${this.temperature}</p>
        </div>
        <div class="time"><b>${this.getHoursMinutes()} ${this.meridiem}</b></div>
        <div class="date"><b>${this.getRequiredDateFormat()}</b></div>
        <div class="humid"><img src="${locationhref}/images/humidityIcon.svg" alt="humidityIcon">${this.humidity}</div>
        <div class="precp"><img src="${locationhref}/images/precipitationIcon.svg" alt="precipitationIcon">${this.precipitation}</div>
    </div>`
    }

    getBG() {
        return `url('${locationhref}/images/city-icons/${this.cityName.toLowerCase()}.svg') 80px 100px/250px no-repeat, rgba(50, 50, 50, 0.5)`;
    }
}

class CitySelectionDetails extends CityCardDetails {
    constructor(dataJSON) {
        super(dataJSON);
        this.nextFiveHours = dataJSON.nextFiveHours;
        this.timeArray = [];
        this.tempArray = [];
        this.timeOfDay = [];
        this.iconArray = [];
    }

    getImageHTML() {
        return `<img src="${locationhref}/images/city-icons/${this.cityName.toLowerCase()}.svg" alt="${this.cityName}">`;
    }

    getCelciusHTML() {
        return `Temp <sup>&#8728</sup>C <br><br><b>${this.temperature}</b>`;
    }

    getHumidityHTML() {
        return `Humidity<br><br><b>${this.humidity}</b>`;
    }

    getDateAndTimeHTML() {
        return `<b>${this.time} </b><img src="${locationhref}/images/${this.meridiem.toLowerCase()}State.svg" alt='AM'><br><span>${super.getRequiredDateFormat()}</span>`;
    }

    getFarenheitHTML() {
        return `Temp F<br><br><b>${super.celsiusToFarenheit()}</b>`;
    }

    getPrecipitationHTML() {
        return `Precipitation<br><br><b>${this.precipitation}</b>`;
    }

    populateTimeArray() {
        let state = this.meridiem;
        let time = parseInt(this.time.split(':')[0]);
        this.timeArray.push(time);
        this.timeOfDay.push(state);
        this.tempArray.push(parseInt(data[this.cityName.toLowerCase()].temperature));
        for (let i = 0; i < 5; i++) {
            if (time == 11) {
                state = state === 'AM' ? 'PM' : 'AM';
            }
            if (time == 12) {
                time = 0;
            }
            time += 1;
            this.timeArray.push(time);
            this.timeOfDay.push(state);
            this.tempArray.push(parseInt(data[this.cityName.toLowerCase()].nextFiveHrs[i]));
        }
        this.tempArray[5] = Math.floor((this.tempArray.slice(0, 5).reduce((a, b) => a + b, 0)) / 5);
    }

    populateIconArray() {
        for (let i = 0; i < 6; i++) {
            if (this.tempArray[i] > 29) {
                this.iconArray.push('sunny');
            } else if (this.tempArray[i] > 22) {
                this.iconArray.push('cloudy');
            } else if (this.tempArray[i] > 17) {
                this.iconArray.push('windy');
            } else {
                this.iconArray.push('rainy');
            }
        }
    }

    setTimelineHTML(headTimeArray, headIconArray, headTempArray) {
        headTimeArray.innerHTML = `<p id='time1'>NOW</p>`
        headIconArray.innerHTML = `<img id="image1" src="${locationhref}/icons/${this.iconArray[0]}Icon.svg" alt="icon">`;
        headTempArray.innerHTML = `<p id="temp1">${this.tempArray[0]}</p>`
        for (let i = 1; i < 6; i++) {
            headTimeArray.innerHTML += `<p id='time${i+1}'>${this.timeArray[i]} ${this.timeOfDay[i]}</p>`
            headIconArray.innerHTML += `<img id="image${i+1}" src="${locationhref}/icons/${this.iconArray[i]}Icon.svg" alt="icon">`;
            headTempArray.innerHTML += `<p id="temp${i+1}">${this.tempArray[i]}</p>`
        }
    }
}

// TIMER DECLARATIONS

let loop = setInterval(timer, 1000);

// VARIABLE DECLARATIONS

let monthStrings = { '1': "Jan", '2': "Feb", '3': "Mar", '4': "Apr", '5': "May", '6': "Jun", '7': "Jul", '8': "Aug", '9': "Sep", '10': "Oct", '11': "Nov", '12': "Dec" }

//let currentCity = new CitySelectionDetails(data[document.getElementById('city').value.toLowerCase()]);

let headCity = document.getElementById('city');
// citySelection(headCity.value);

let cityCardContainer = document.getElementsByClassName('card-container')[0];

let displayTop = document.getElementById('display-top');

let cardBox = document.getElementsByClassName('card-box')[0];
let backArrow = document.getElementById('backarrow');
let frontArrow = document.getElementById('frontarrow');

// cardStatsChange(displayTop.value);
// updateContinentCards();

let climateQuery = document
    .getElementsByClassName('filters')[0]
    .getElementsByTagName('div');
let sunnyIcon = climateQuery[0];
let snowyIcon = climateQuery[1];
let rainyIcon = climateQuery[2];

let continentSort = document.getElementsByClassName('cont-key')[0];
let temperatureSort = document.getElementsByClassName('temp-key')[0];

window.onload = function() {
    citySelection(headCity.value);
    cardStatsChange(displayTop.value);
    updateContinentCards();
    updateTime();
}

// FUNCTION DECLARATION

function parseDate(stringDate, monthStrings) {
    let strArray = stringDate.split('/');
    let date = strArray[1];
    if (date.length === 1) { date = '0' + date; }
    let year = strArray[2];
    let month = strArray[0];
    return `${date}-${monthStrings[month]}-${year}`;
}

/**
 *
 *
 * @param {*} headTempc
 */
function bgSelector(headTempc) {
    // if (parseInt(headTempc) > 29) {
    //     document.getElementById('bgm').src = "https://www.youtube.com/embed/54n9E_LwQvQ?start=4&end=44&rel=0&autoplay=1";
    //     document.getElementsByClassName('container')[0].style.backgroundImage = 'linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("../images/sunny_bg.jpg")';
    // } else if (headTempc > 22) {
    //     document.getElementById('bgm').src = "https://www.youtube.com/embed/IKcBlTrPPMQ?start=17&end=47&rel=0&autoplay=1";
    //     document.getElementsByClassName('container')[0].style.backgroundImage = 'linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("../images/windy_bg.jpg")';
    // } else if (headTempc > 17) {
    //     document.getElementById('bgm').src = "https://www.youtube.com/embed/SDmbGrQqWog?rel=0&end=40&autoplay=1";
    //     document.getElementsByClassName('container')[0].style.backgroundImage = 'linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("../images/rainy_bg.jpg")';
    // } else {
    //     document.getElementById('bgm').src = "https://www.youtube.com/embed/9E8JNf1Fngg?start=5&end=45&rel=0&autoplay=1";
    //     document.getElementsByClassName('container')[0].style.backgroundImage = 'linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("../images/snowy_bg.jpg")';
    // }
};

/**
 *
 *
 * @param {*} cityName
 * @return {*} 
 */
function citySelection(cityName) {
    let currentCity = cityName.toLowerCase();
    if (data.hasOwnProperty(currentCity) && currentCity != '') {
        let city = new CitySelectionDetails(data[currentCity]);
        //Left section Updation
        document.getElementsByClassName('city-img')[0].innerHTML = city.getImageHTML();
        document.getElementById('headTempc').innerHTML = city.getCelciusHTML();
        document.getElementById('headHumid').innerHTML = city.getHumidityHTML();
        document.getElementById('headTempf').innerHTML = city.getFarenheitHTML();
        document.getElementById('headPrecipitation').innerHTML = city.getPrecipitationHTML();
        document.getElementById('headDateAndTime').innerHTML = city.getDateAndTimeHTML();
        city.populateTimeArray();
        city.populateIconArray();
        //updateTime();

        //Right Section Updation
        let headTimeArray = document.querySelector('.time-list');
        let headIconArray = document.querySelector('.icons');
        let headTempArray = document.querySelector('.temperature');
        city.setTimelineHTML(headTimeArray, headIconArray, headTempArray);

        //BackGround Updation
        bgSelector(parseInt(city.temperature));

        return true;
    } else {

        //Log errors
        console.log('No such City Names- available');
        return false;
    }
}

/**
 *
 *
 * @param {*} displayTop
 */
function cardStatsChange(displayTop) {
    let dataArray = []
    let cardCount = displayTop;

    // cardBox is the container which contains all the city-cards
    let cardBox = document.getElementsByClassName('card-box')[0];

    //Instantiate CityCardDetails Objects as in an array
    for (var i in data) {
        dataArray.push(new CityCardDetails(data[i]));
    }

    // Sort the Object Array- descending, based on temperature
    dataArray = dataArray.sort(function(a, b) {
        return parseInt(a.temperature) < parseInt(b.temperature) ? 1 : -1;
    });
    cardBox.innerHTML = '';

    // Define the City Cards and view based on the applied filter- Sunny, Snowy (or) Rainy 
    // Update the City Cards to HTML DOM
    if (document.getElementsByClassName('active-icon')[0].id === 'sunny-cities') {
        let sunnyCities = dataArray.filter((city) => (parseInt(city.temperature) > 29));
        let sunnyCardCount = sunnyCities.length;
        let requiredCount = cardCount <= sunnyCardCount ? cardCount : sunnyCardCount;
        for (let i = 0; i < requiredCount; i++) {
            cardBox.innerHTML += sunnyCities[i].getHTML();
            cardBox.lastElementChild.style.background = sunnyCities[i].getBG();
        }
    } else if (document.getElementsByClassName('active-icon')[0].id === 'snowy-cities') {
        let snowyCities = dataArray.filter((city) => (parseInt(city.temperature) <= 29 && parseInt(city.temperature) >= 20));
        let snowyCardCount = snowyCities.length;
        let requiredCount = cardCount <= snowyCardCount ? cardCount : snowyCardCount;
        for (let i = 0; i < requiredCount; i++) {
            cardBox.innerHTML += snowyCities[i].getHTML();
            cardBox.lastElementChild.style.background = snowyCities[i].getBG();
        }
    } else {
        let rainyCities = dataArray.filter((city) => (parseInt(city.temperature) < 20));
        let rainyCardCount = rainyCities.length;
        let requiredCount = cardCount <= rainyCardCount ? cardCount : rainyCardCount;
        for (let i = 0; i < requiredCount; i++) {
            cardBox.innerHTML += rainyCities[i].getHTML();
            cardBox.lastElementChild.style.background = rainyCities[i].getBG();
        }
    }

    // Create or Destroy the scroll buttons- based on requirement
    if (cardBox.scrollWidth > cardBox.clientWidth) { scrollArrowsAppear(); } else { scrollArrowsDisappear(); }

    // Set Event Listeners for the updated Cards
    setEventListenersCityCards();
    setEventListenersContinentCards();
}

/**
 *
 *
 */
function updateContinentCards() {
    // Initialize Array of Continent card Objects
    let contArray = []
    for (var i in data) {
        contArray.push(new CityDetails(data[i].cityName, data[i].dateAndTime, data[i].temperature, data[i].humidity, data[i].timeZone));
    }

    // Store the boolean values for the type of sort to be made
    let contSort = (document.getElementsByClassName('up-down-icon')[0].children[0].src == `${locationhref}/images/arrowDown.svg`);
    let tempSort = (document.getElementsByClassName('up-down-icon')[1].children[0].src == `${locationhref}//images/arrowDown.svg`);
    let contCardBox = document.getElementsByClassName('cont-card-box')[0];

    // Clear the Continent card's container
    contCardBox.innerHTML = '';

    // Sort the Continent cards based on the required criteria: Continent Names, Temperature
    contArray = contArray.sort(function(a, b) {
        if (a.getContinentName() === b.getContinentName()) {
            return (tempSort === true ? parseInt(a.temperature) > parseInt(b.temperature) : parseInt(a.temperature) < parseInt(b.temperature)) ? 1 : -1;
        }
        return (contSort === true ? a.timeZone > b.timeZone : a.timeZone < b.timeZone) ? 1 : -1;
    });

    // Update the Continent Cards to HTML DOM
    let requiredCount = 12 < contArray.length ? 12 : contArray.length;
    for (let i = 0; i < requiredCount; i++) {
        contCardBox.innerHTML += contArray[i].getHTML();
    }
    setEventListenersContinentCards();
}

/**
 *
 *
 */
function scrollArrowsAppear() {
    if (document.getElementById('backarrow')) {
        document.getElementById('backarrow').remove();
        document.getElementById('frontarrow').remove();
    }
    cityCardContainer.innerHTML = `<div id="backarrow"><img src=${locationhref}/images/backwardArrow.svg" alt='backArrow'></div>` +
        cityCardContainer.innerHTML + `<div id="frontarrow"><img src="${locationhref}//images/forwardArrow.svg" alt='forwardArrow'></div>`;
    //console.log("New Arrow Appears!")
    document.getElementById('frontarrow').addEventListener('click', (e) => document.getElementsByClassName('card-box')[0].scrollBy(300, 0));
    document.getElementById('backarrow').addEventListener('click', (e) => document.getElementsByClassName('card-box')[0].scrollBy(-300, 0));
}

/**
 *
 *
 */
function scrollArrowsDisappear() {
    if (document.getElementById('backarrow')) {
        document.getElementById('backarrow').remove();
        document.getElementById('frontarrow').remove();
    }
    //console.log("Old Arrow Disappears!")
}

/**
 *
 *
 */
function setEventListenersCityCards() {
    let cardCount = document.getElementsByClassName('card').length;
    for (let i = 0; i < cardCount; i++) {
        document.getElementsByClassName('card')[i].addEventListener('click', function(e) {
            document.getElementById('city').value = this.getElementsByClassName('cname')[0].children[0].innerText;
            citySelection(document.getElementById('city').value);
        });
    }
}

/**
 *
 *
 */
function setEventListenersContinentCards() {
    let contCards = document.getElementsByClassName('cont-card');
    let cardCount = contCards.length;
    for (let i = 0; i < cardCount; i++) {
        contCards[i].addEventListener('click', function(e) {
            document.getElementById('city').value = this.getElementsByClassName('info')[0].innerText.split(', ')[0];
            citySelection(document.getElementById('city').value);
        });
    }
}

/**
 *
 *
 */
function updateTime() {
    let d = new Date();
    let currentCity = document.getElementById('city').value.toLowerCase();
    let headDateAndTime = document.getElementById('headDateAndTime').childNodes;
    data[currentCity].dateAndTime = d.toLocaleString("en-US", { timeZone: data[currentCity].timeZone })
    let currentDateTime = data[currentCity].dateAndTime.split(', ');
    let currentDate = currentDateTime[0];
    let currentTime = currentDateTime[1].split(' ')[0];
    let amOrPm = currentDateTime[1].split(' ')[1].toLowerCase();

    headDateAndTime[0].innerText = `${currentTime} `;
    headDateAndTime[1].src = `images/${amOrPm}State.svg`;
    headDateAndTime[3].innerText = parseDate(currentDate, monthStrings);
}

/**
 *
 */
function timer() {
    updateTime();
}
// Add set attributes for on click!

// EVENT DECLARATIONS

window.addEventListener('resize', function(e) {
    if (document.getElementsByClassName('card-box')[0].scrollWidth > document.getElementsByClassName('card-box')[0].clientWidth) {
        scrollArrowsAppear();
    } else {
        scrollArrowsDisappear();
    }
    cardStatsChange(displayTop.value);
})

sunnyIcon.addEventListener('click', function(event) {
    this.className = 'active-icon';
    snowyIcon.className = '';
    rainyIcon.className = '';
    cardStatsChange(displayTop.value);
})

rainyIcon.addEventListener('click', function(event) {
    this.className = 'active-icon';
    snowyIcon.className = '';
    sunnyIcon.className = '';
    cardStatsChange(displayTop.value);
})

snowyIcon.addEventListener('click', function(event) {
    this.className = 'active-icon';
    sunnyIcon.className = '';
    rainyIcon.className = '';
    cardStatsChange(displayTop.value);
})

displayTop.addEventListener('input', function(e) {
    if (this.value < 3) { this.value = 3 };
    if (this.value > 10) { this.value = 10 };
    cardStatsChange(this.value);
})

frontArrow.addEventListener('click', (e) => cardBox.scrollBy(400, 0));

backArrow.addEventListener('click', (e) => cardBox.scrollBy(-400, 0));

headCity.addEventListener('input', function() {
    let cityName = this.value;
    let status = citySelection(cityName);
    if (status) {
        this.blur();
    }
});

continentSort.addEventListener('click', function(e) {
    if (this.children[0].children[0].src == `${locationhref}/images/arrowDown.svg`) {
        this.children[0].children[0].src = `${locationhref}/images/arrowUp.svg`;
    } else {
        this.children[0].children[0].src = `${locationhref}/images/arrowDown.svg`;
    }
    updateContinentCards();
});

temperatureSort.addEventListener('click', function(e) {
    if (this.children[0].children[0].src == `${locationhref}/images/arrowDown.svg`) {
        this.children[0].children[0].src = `${locationhref}/images/arrowUp.svg`;
    } else {
        this.children[0].children[0].src = `${locationhref}/images/arrowDown.svg`;
    }
    updateContinentCards();
});
