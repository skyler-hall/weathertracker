const mockForecast = {
    miami: [
        {
            date: "Oct 15th, 2025",
            weather: "Rainy",
            temp: "85F",
            humidity: "20%"
        },
        {
            date: "Oct 16th, 2025",
            weather: "Windy",
            temp: "75F",
            humidity: "50%"
        },
        {
            date: "Oct 17th, 2025",
            weather: "Sunny",
            temp: "70F",
            humidity: "70%"
        }
    ],
    sunrise: [
        {
            date: "Oct 15th, 2025",
            weather: "Cloudy",
            temp: "85F",
            humidity: "20%"
        },
        {
            date: "Oct 16th, 2025",
            weather: "Cold",
            temp: "75F",
            humidity: "20%"
        },
        {
            date: "Oct 17th, 2025",
            weather: "Snowy",
            temp: "40F",
            humidity: "10%"
        }
    ],
    weston: [
        {
            date: "Oct 15th, 2025",
            weather: "Clear",
            temp: "73F",
            humidity: "20%"
        },
        {
            date: "Oct 16th, 2025",
            weather: "Sunny",
            temp: "80F",
            humidity: "20%"
        },
        {
            date: "Oct 17th, 2025",
            weather: "Sunny",
            temp: "87F",
            humidity: "10%"
        }
    ],
}


let day = 1 //index of the "day" we're on for the forecast
// so page 1 is day 1, aka today
// page 2 is tomorrow, page 0 is yesterday (if available)
// so on so forth

let forecastData = null

document.addEventListener('DOMContentLoaded', () => {
    const getWeatherButton = document.getElementById('weather-button')
    getWeatherButton.addEventListener('click', () => handleSubmit())

    const nextButton = document.getElementById('next-button')
    nextButton.addEventListener('click', () => handleNext())

    const prevButton = document.getElementById('prev-button')
    prevButton.addEventListener('click', () => handlePrev())

    requestNotificationPermission() //ask the user if we can send notifications 
})

const retrieveApiData = async (location) => {
    const API_ENDPOINT = 'http://api.weatherapi.com/v1/forecast.json'
    const key = 'key=YOUR_API_KEY_HERE'
    const q = `q=${location}`
    const days = 'days=3'
    const OPTIONS = 'aqi=no&alerts=no'
    const DAY_FIELDS = 'day_fields=avgtemp_f,avghumidity,condition'

    //const requestUrl = API_ENDPOINT + "?" + key + "&" + q + "&" + days + '&' + options + '&' + DAY_FIELDS
    const requestUrl = `${API_ENDPOINT}?${key}&${q}&${days}&${OPTIONS}&${DAY_FIELDS}`

    console.log(requestUrl)

    const response = await fetch(requestUrl)
    const data = await response.json()

    console.log(data)

    const rawForecastData = data.forecast.forecastday //array of forecasts

    const forecast = []

    rawForecastData.forEach((currentDay) => {
        forecast.push({
            date: currentDay.date,
            weather: currentDay.day.condition.text,
            temp: currentDay.day.avgtemp_f,
            humidity: currentDay.day.avghumidity,
            //potentially, add img key here
        })
    })

    console.log(forecast)
    return forecast
}

const getForecast = (selectedForecast) => {
    //let locationKey = location.toLowerCase()
    //let selectedForecast = mockForecast[locationKey]
    //const selectedForecast = retrieveApiData(location)

    forecastData = selectedForecast

    let notificationText = ""

    //to not spam users with notifs, we'll loop through the forecast data we retrieved
    //and make a list of all the sunny days
    selectedForecast.forEach(day => {
        console.log('day', day)
        if(day.weather.toLowerCase() === "sunny") {
            notificationText += `${day.date}: Weather is ${day.weather}.\n`;
        }
    });

    console.log('notification text:', notificationText)
    if(notificationText) { // if the list of sunny days isn't empty, we'll send a notif
        createNotification(notificationText)
    }

    return selectedForecast
}

const displayMockForecast = (forecast, index) => {
    console.log('forecast to display',forecast)
    const date = document.getElementById('date-detail')
    const weather = document.getElementById('weather-detail')
    const temp = document.getElementById('temp-detail')
    const humidity = document.getElementById('humidity-detail')
    const forecastImage = document.getElementById('forecast-img')

    console.log(index)
    const currForecast = forecast[index]
    date.innerText = currForecast?.date ?? "-"
    weather.innerText = currForecast?.weather ?? "-"
    temp.innerText = currForecast?.temp ?? "-"
    humidity.innerText = currForecast?.humidity ?? "-"
    forecastImage.src = `${currForecast?.weather.toLowerCase() ?? "sunny"}.jpg` //replace with image from forecast data
}

const handleSubmit = async () => {
    const locationInput = document.getElementById("location-input")
    const location = locationInput.value
    
    const selectedForecast = await retrieveApiData(location)
    const forecast = getForecast(selectedForecast)
    displayMockForecast(forecast, 1)
}

// just moves through the forecast array
const handleNext = () => {
    day += 1
    displayMockForecast(forecastData, day)
}

const handlePrev = () => {
    day -= 1
    displayMockForecast(forecastData, day)
}

//-----------------------------------------------------------------
//notifications

//request permission to send notifications
function requestNotificationPermission() {
    if (!("Notification" in window)) { // it's actually a bit hard to check whether a browser supports notifs
        //so this is failsafe code
        console.log("This browser does not support notifications.");
        return;
    }
    
    //request notification permissions and print out the user's response to the console
    Notification.requestPermission().then((result) => {
      console.log(result);
    });
}

// create a notif
function createNotification(text) {
    if(Notification?.permission === "granted") {
        const img = "sunny.jpg";
        const notification = new Notification("Weather Alert", { body: text, icon: img });
    }
}