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

//Step 2 - Get the forecast using the location the user entered
const getForecast = (location) => {
    //Get the forecast from the list
    let locationKey = location.toLowerCase()
    let selectedForecast = mockForecast[locationKey]

    //Save this forecast
    forecastData = selectedForecast

    //Set up the notification
    let notificationText = ""

    //to not spam users with notifs, we'll loop through the forecast data we retrieved
    //and make a list of all the sunny days
    selectedForecast.forEach(day => {
        console.log('day', day)
        if(day.weather.toLowerCase() === "sunny") {
            notificationText += `${day.date}: Weather is ${day.weather}.\n`;
        }
    });

    // Send the notification
    console.log('notification text:', notificationText)
    if(notificationText) { // if the list of sunny days isn't empty, we'll send a notif
        createNotification(notificationText)
    }

    // Return the forecast data for display on the page!
    return selectedForecast
}

// Step 3 - Display the forecast data on the page using the DOM
const displayMockForecast = (forecast, index) => {
    console.log(forecast)
    //Get all the DOM objects we're going to edit
    const date = document.getElementById('date-detail')
    const weather = document.getElementById('weather-detail')
    const temp = document.getElementById('temp-detail')
    const humidity = document.getElementById('humidity-detail')
    const forecastImage = document.getElementById('forecast-img')

    // Change their inner text attributes
    // Option chaining - null safety, if there's no currForecast it prevents the script from crashing by just returning undefined
    // Nullish Coalescing Operator (??) - if the currForecast is null, then use the default value. In this case, a dash (-)
        // Both of these allow us to prevent the script from crashing if the forecast data is empty and display some default values instead

    console.log(index)
    const currForecast = forecast[index]
    date.innerText = currForecast?.date ?? "-"
    weather.innerText = currForecast?.weather ?? "-"
    temp.innerText = currForecast?.temp ?? "-"
    humidity.innerText = currForecast?.humidity ?? "-"
    forecastImage.src = `${currForecast?.weather.toLowerCase() ?? "sunny"}.jpg` //Template literal strings - we can put variables in them
}

// Step 1 - write the submissions handler
const handleSubmit = () => {

    //get the location the user requested
    const locationInput = document.getElementById("location-input")
    const location = locationInput.value
    
    //get the forecast
    const forecast = getForecast(location)

    //display the forecast data
    //We'll display the forecast data at index 1 to start with, since that's day 0
    displayMockForecast(forecast, 1)
}

// Step 5 - Other handlers for the next and back buttons
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
// Step 6
//notifications

// First:
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

// Then:
// create a notif
function createNotification(text) {
    if(Notification?.permission === "granted") {
        const img = "sunny.jpg";
        const notification = new Notification("Weather Alert", { body: text, icon: img });
    }
}