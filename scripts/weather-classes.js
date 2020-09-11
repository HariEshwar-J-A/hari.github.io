// ---------- Class Declarations ----------
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

    celciusToFarenheit() {
        return `${Math.floor((parseInt(this.temperature)*9/5)+32)} F`;
    };

    getHoursMinutes() {
        return `${this.time.split(':').slice(0,2).join(':')}`;
    };

    getRequiredDateFormat() {
        return [this.date.split('/')[1], this.month, this.date.split('/')[2]].join('-');
    };

    getContCardHTML() {
        return `<div class='cont-card'>
        <div class="cont">${this.timeZone.split('/')[0]}</div>
        <div class="temp">${this.temperature}</div>
        <div class="info">${this.cityName}, ${this.getHoursMinutes()} ${this.meridiem}</div> 
        <div class="humid"><img src="images/humidityIcon.svg" alt="humidityIcon">${this.humidity}</div>
        </div>`;
    }
}

class CityCards extends ContinentCards {
    constructor(jsonData) {
        super(jsonData);
        this.precipitation = jsonData.precipitation;
    }

    getHTML() {
        return `<div class="card">
            <div class="cname">
                <p><b>${this.cityName}</b></p>
                <p>${this.temperature}</p>
            </div>
            <div class="time"><b>${this.getHoursMinutes()} ${this.meridiem}</b></div>
            <div class="date"><b>${this.getRequiredDateFormat()}</b></div>
            <div class="humid"><img src="images/humidityIcon.svg" alt="humidityIcon">${this.humidity}</div>
            <div class="precp"><img src="images/precipitationIcon.svg" alt="precipitationIcon">${this.precipitation}</div>
        </div>`;
    };

    getBG() {
        return `url('${location.href.split('/').slice(0,-1).join('/')}/images/city-icons/${this.cityName.toLowerCase()}.svg') 100px 100px/150px no-repeat, var(--bg-dark-grey-tile)`;
    };
}

class CitySelection extends CityCards {
    constructor(jsonData) {
        super(jsonData);
    };

    classifyIcons(celcius) {
        return ((celcius > 29) ? 'sunny' : (celcius > 22 ? 'cloudy' : (celcius > 17 ? 'windy' : 'rainy')));
    }
    populateTimeLine(nextFiveHrs, headTimeArray, headIconArray, headTempArray) {
        headTimeArray.innerHTML = `<p id='time1'>NOW</p>`;
        headIconArray.innerHTML = `<img id="image1" src="icons/${this.classifyIcons(parseInt(this.temperature))}Icon.svg" alt="icon">`;
        headTempArray.innerHTML = `<p id="temp1">${parseInt(this.temperature)}</p>`;
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
            headIconArray.innerHTML += `<img id="image${i}" src="icons/${this.classifyIcons(parseInt(temperature))}Icon.svg" alt="icon">`;
            headTempArray.innerHTML += `<p id="temp${i}">${parseInt(temperature)}</p>`;
        });
    }
}

export { ContinentCards, CityCards, CitySelection };