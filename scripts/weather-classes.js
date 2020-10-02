// ---------- Class Declarations ----------

/**
 * ----- Base Class -> Continent Cards -----
 *
 * @class ContinentCards
 */
class ContinentCards {
    constructor(jsonData) {
        this.timeZone = jsonData.timeZone;
        this.cityName = jsonData.cityName;
        this.temperature = jsonData.temperature;
        this.humidity = jsonData.humidity;
        let d = new Date();
        [this.date, this.time] = d.toLocaleString("en-US", { timeZone: this.timeZone }).split(', ');
        this.month = d.toLocaleString("en-US", { timeZone: this.timeZone, month: 'short' });
        this.meridiem = this.time.split(' ')[1];
    }


    /**
     * Converts Celcius to Farenheit
     *
     * @return {*} 
     * @memberof ContinentCards
     */
    celciusToFarenheit() {
        return `${Math.floor((parseInt(this.temperature)*9/5)+32)} F`;
    };


    /**
     * Parses time to get hrs:mins format
     *
     * @return {*} 
     * @memberof ContinentCards
     */
    getHoursMinutes() {
        return `${this.time.split(':').slice(0,2).join(':')}`;
    };


    /**
     * Provides date format with month name
     *
     * @return {*} 
     * @memberof ContinentCards
     */
    getRequiredDateFormat() {
        return [this.date.split('/')[1], this.month, this.date.split('/')[2]].join('-');
    };


    /**
     * Provides HTML String for each Continent Card
     *
     * @return {*} 
     * @memberof ContinentCards
     */
    getContCardHTML() {
        return `<div class='cont-card'>
        <div class="cont">${this.timeZone.split('/')[0]}</div>
        <div class="temp">${this.temperature}</div>
        <div class="info">${this.cityName}, ${this.getHoursMinutes()} ${this.meridiem}</div> 
        <div class="humid"><img src="assets/climate-icons/humidityIcon.svg" alt="humidityIcon">${this.humidity}</div>
        </div>`;
    }
}


/**
 * ----- Child Class level 1 -> City Cards -----
 *
 * @class CityCards
 * @extends {ContinentCards}
 */
class CityCards extends ContinentCards {
    constructor(jsonData) {
        super(jsonData);
        this.precipitation = jsonData.precipitation;
    }


    /**
     * Provides HTML String for each City Card
     *
     * @return {*} 
     * @memberof CityCards
     */
    getHTML() {
        return `<div class="card">
            <div class="cname">
                <p><b>${this.cityName}</b></p>
                <p>${this.temperature}</p>
            </div>
            <div class="time"><b>${this.getHoursMinutes()} ${this.meridiem}</b></div>
            <div class="date"><b>${this.getRequiredDateFormat()}</b></div>
            <div class="humid"><img src="assets/climate-icons/humidityIcon.svg" alt="humidityIcon">${this.humidity}</div>
            <div class="precp"><img src="assets/climate-icons/precipitationIcon.svg" alt="precipitationIcon">${this.precipitation}</div>
        </div>`;
    };


    /**
     * Provides CSS url path for setting background- for each City Card
     *
     * @return {*} 
     * @memberof CityCards
     */
    getBG() {
        return `url('${location.href.split('/').slice(0,-1).join('/')}/../assets/city-icons/${this.cityName.toLowerCase()}.svg') 120px 100px/200px no-repeat, var(--bg-dark-grey-tile)`;
    };
}


/**
 * ----- Child Class level 2 -> City Selection -----
 *
 * @class CitySelection
 * @extends {CityCards}
 */
class CitySelection extends CityCards {
    constructor(jsonData) {
        super(jsonData);
    };


    /**
     * Provides the String for Type of Icon to be returned- with respect to their temperature
     *
     * @param {*} celcius
     * @return {*} 
     * @memberof CitySelection
     */
    classifyIcons(celcius) {
        return ((celcius > 29) ? 'sunny' : (celcius > 22 ? 'cloudy' : (celcius > 17 ? 'windy' : 'rainy')));
    }


    /**
     * Populates the TimeLine for hourly forecast.
     * 
     * @param {*} nextFiveHrs
     * @param {*} headTimeArray
     * @param {*} headVerticalLineArray
     * @param {*} headIconArray
     * @param {*} headTempArray
     * @memberof CitySelection
     */
    populateTimeLine(nextFiveHrs, headTimeArray, headVerticalLineArray, headIconArray, headTempArray) {
        headTimeArray.innerHTML = `<p id='time1'>NOW</p>`;
        headIconArray.innerHTML = `<img id="image1" src="assets/climate-icons/${this.classifyIcons(parseInt(this.temperature))}Icon.svg" alt="icon">`;
        headTempArray.innerHTML = `<p id="temp1">${parseInt(this.temperature)}</p>`;
        headVerticalLineArray.innerHTML = '<div class="vl">I</div>';
        let meridiemNew = this.meridiem;
        let hours = parseInt(this.time.split(':'));
        let i = 1;
        // #scalability for next hours
        nextFiveHrs.forEach(temperature => {
            if (hours == 11) { meridiemNew = meridiemNew === 'AM' ? 'PM' : 'AM'; };
            if (hours == 12) { hours = 0; };
            hours++;
            i++;
            headTimeArray.innerHTML += `<p id='time${i}'>${hours} ${meridiemNew}</p>`;
            headVerticalLineArray.innerHTML += '<div class="vl">I</div> <div class="vl">I</div>';
            headIconArray.innerHTML += `<img id="image${i}" src="assets/climate-icons/${this.classifyIcons(parseInt(temperature))}Icon.svg" alt="icon">`;
            headTempArray.innerHTML += `<p id="temp${i}">${parseInt(temperature)}</p>`;
        });
    }
}

export { ContinentCards, CityCards, CitySelection };