const baseUrl = 'https://weather-app-api.glitch.me/';

// Update TimeLine for currect city selection
export function getNextFiveHrs(city_Date_Time_Name) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', baseUrl + 'hourly-forecast', true)
        xhr.responseType = 'json';
        // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('Content-type', 'application/json');
        var data = {
            "city_Date_Time_Name": city_Date_Time_Name,
            "hours": 5
        };
        xhr.send(JSON.stringify(data));
        xhr.onload = (() => resolve(xhr.response));
        xhr.onerror = ((err) => reject(err));
    });
}

// Update data JSON object
export function getCityDetails() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', baseUrl + 'all-timezone-cities', true);
        xhr.responseType = 'json';
        // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.send();
        xhr.onload = (() => {
            resolve(xhr.response);
        });
        xhr.onerror = ((error) => reject(error + 'has occured'));
    });
};