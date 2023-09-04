'use strict';

import './style.css';
import dom from './domHandler';

window.fetchWeatherData = fetchWeatherData;
let isMetric = true,
	currCityWeatherData = {
		city: null,
		country: null,
		temp_c: null,
		temp_f: null,
		humidity: null,
		precip_mm: null,
		precip_in: null,
		wind_kph: null,
		wind_mph: null,
	};

document.forms[0].addEventListener('submit', handleSearchSubmit);
document.body.addEventListener('click', delegateBodyClick);

function delegateBodyClick(e) {
	const node = e.target;
	if (node.closest('.unit__input')) changeUnits(node);
	if (!node.closest('.search__error')) dom.errorPopupSearchbar.close();
	else return;
}

function handleSearchSubmit(e) {
	e.preventDefault();
	const cityName = document.querySelector('#search__input').value;
	if (cityName.length === 0) return;

	fetchWeatherData(cityName).then(data => {
		if (data) dom.displayWeatherData(data, isMetric);
	});
}

function changeUnits(node) {
	if ((node.value === 'metric' && isMetric) || (node.value === 'imperial' && !isMetric)) return;

	isMetric = !isMetric;
	dom.displayWeatherData(currCityWeatherData, isMetric);
}

async function fetchWeatherData(locationQuery) {
	// Using WeatherAPI
	let response;
	try {
		const baseURL = 'https://api.weatherapi.com/v1/current.json';
		// Using a free key for practice, currently I HAVE NOT learnt to keep key private in backend.
		const key = `1d1b30bb224a47bf94390844230409`;
		const shouldGetAirQuality = 'no';
		const fullURL = `${baseURL}?key=${key}&q=${locationQuery}&aqi=${shouldGetAirQuality}`;
		response = await fetch(fullURL, { mode: 'cors' });

		if (response.status === 200) {
			const responseObj = await response.json();

			currCityWeatherData.city = responseObj.location.name;
			currCityWeatherData.country = responseObj.location.country;
			currCityWeatherData.temp_c = responseObj.current.temp_c;
			currCityWeatherData.temp_f = responseObj.current.temp_f;
			currCityWeatherData.humidity = responseObj.current.humidity;
			currCityWeatherData.precip_mm = responseObj.current.precip_mm;
			currCityWeatherData.precip_in = responseObj.current.precip_in;
			currCityWeatherData.wind_kph = responseObj.current.wind_kph;
			currCityWeatherData.wind_mph = responseObj.current.wind_mph;
			return currCityWeatherData;
		} else throw Error('Response Not OK');
	} catch (err) {
		switch (response.status) {
			case 400:
				dom.errorPopupSearchbar.message(`Error: Invalid Location: "${locationQuery}"`);
				break;
			case 401:
				dom.errorPopupSearchbar.message('Error: Invalid API key!');
				break;
			case 403:
				dom.errorPopupSearchbar.message('Error: API key exceeds rate limit!');
				break;
			default:
				dom.errorPopupSearchbar.message('Error: Something went wrong...');
				debugger;
				break;
		}
		return null;
	}
}
