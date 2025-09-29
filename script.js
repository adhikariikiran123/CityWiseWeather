// API Configuration
const API_KEY = "0d0f5c5da358d4c738e7d525b882a970"; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const backBtn = document.getElementById('backBtn');
const weatherCard = document.getElementById('weatherCard');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinner = document.getElementById('loadingSpinner');

// Weather display elements
const cityName = document.getElementById('cityName');
const currentDateTime = document.getElementById('currentDateTime');
const temperature = document.getElementById('temperature');
const weatherCondition = document.getElementById('weatherCondition');
const weatherIcon = document.getElementById('weatherIcon');
const windSpeed = document.getElementById('windSpeed');
const humidity = document.getElementById('humidity');
const feelsLike = document.getElementById('feelsLike');
const pressure = document.getElementById('pressure');
const weatherDescription = document.getElementById('weatherDescription');
const visibility = document.getElementById('visibility');
const recentCities = document.getElementById('recentCities');

// Weather condition to Hindi mapping
const conditionHindiMap = {
    'clear sky': 'साफ आसमान',
    'few clouds': 'कुछ बादल',
    'scattered clouds': 'बिखरे हुए बादल',
    'broken clouds': 'टूटे हुए बादल',
    'overcast clouds': 'घनघोर बादल',
    'light rain': 'हल्की बारिश',
    'moderate rain': 'मध्यम बारिश',
    'heavy rain': 'भारी बारिश',
    'thunderstorm': 'तूफान',
    'snow': 'बर्फबारी',
    'mist': 'धुंध',
    'fog': 'कोहरा',
    'haze': 'धुंधलापन'
};

// Weather icon mapping
const iconMap = {
    '01d': 'fas fa-sun',
    '01n': 'fas fa-moon',
    '02d': 'fas fa-cloud-sun',
    '02n': 'fas fa-cloud-moon',
    '03d': 'fas fa-cloud',
    '03n': 'fas fa-cloud',
    '04d': 'fas fa-cloud',
    '04n': 'fas fa-cloud',
    '09d': 'fas fa-cloud-rain',
    '09n': 'fas fa-cloud-rain',
    '10d': 'fas fa-cloud-sun-rain',
    '10n': 'fas fa-cloud-moon-rain',
    '11d': 'fas fa-bolt',
    '11n': 'fas fa-bolt',
    '13d': 'fas fa-snowflake',
    '13n': 'fas fa-snowflake',
    '50d': 'fas fa-smog',
    '50n': 'fas fa-smog'
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 60000);
    
    // Load recent searches from localStorage
    loadRecentSearches();
    
    // Set focus to search input
    cityInput.focus();
    
    // Check if there's a city in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const cityParam = urlParams.get('city');
    if (cityParam) {
        cityInput.value = cityParam;
        searchWeather();
    }
});

// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    const dateTimeString = now.toLocaleDateString('en-IN', options);
    currentDateTime.textContent = dateTimeString;
}

// Search for weather
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

async function searchWeather() {
    const city = cityInput.value.trim();
    
    if (city === '') {
        showError('Please enter a city name');
        return;
    }
    
    showLoading();
    hideError();
    hideWeatherCard();
    
    try {
        const weatherData = await fetchWeatherData(city);
        displayWeather(weatherData);
        addToRecentSearches(city);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError('City not found. Please check the spelling and try again.');
    } finally {
        hideLoading();
    }
}

// Fetch weather data from OpenWeatherMap API
async function fetchWeatherData(city) {
    const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    
    if (!response.ok) {
        throw new Error('City not found');
    }
    
    return await response.json();
}

// Display weather data
function displayWeather(data) {
    const condition = data.weather[0].description;
    const hindiCondition = conditionHindiMap[condition] || condition;
    
    cityName.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherCondition.textContent = `${hindiCondition} (${condition})`;
    windSpeed.textContent = `${data.wind.speed} km/h`;
    humidity.textContent = `${data.main.humidity}%`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    pressure.textContent = `${data.main.pressure} hPa`;
    weatherDescription.textContent = `The weather in ${data.name} is characterized by ${condition}. Temperature feels like ${Math.round(data.main.feels_like)}°C.`;
    visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    
    // Set weather icon
    const iconClass = iconMap[data.weather[0].icon] || 'fas fa-cloud';
    weatherIcon.className = iconClass;
    
    showWeatherCard();
}

// Recent searches functionality
function addToRecentSearches(city) {
    let recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    
    // Remove if already exists
    recent = recent.filter(item => item.toLowerCase() !== city.toLowerCase());
    
    // Add to beginning
    recent.unshift(city);
    
    // Keep only last 5 searches
    recent = recent.slice(0, 5);
    
    localStorage.setItem('recentSearches', JSON.stringify(recent));
    loadRecentSearches();
}

function loadRecentSearches() {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    recentCities.innerHTML = '';
    
    recent.forEach(city => {
        const cityElement = document.createElement('div');
        cityElement.className = 'recent-city';
        cityElement.textContent = city;
        cityElement.addEventListener('click', () => {
            cityInput.value = city;
            searchWeather();
        });
        recentCities.appendChild(cityElement);
    });
}

// UI state management
function showLoading() {
    loadingSpinner.style.display = 'block';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

function showWeatherCard() {
    weatherCard.style.display = 'block';
}

function hideWeatherCard() {
    weatherCard.style.display = 'none';
}

function showError(message) {
    errorMessage.style.display = 'block';
    errorMessage.querySelector('p').textContent = message;
}

function hideError() {
    errorMessage.style.display = 'none';
}

// Back button functionality
backBtn.addEventListener('click', function() {
    window.location.href = 'index.html';
});