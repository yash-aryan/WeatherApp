'use strict';

import './style.css';
import dom from './domHandler';

let isMetric = true,
	currCityWeatherData = {
		city: null,
		country: null,
		iconPath: null,
		description: null,
		temp_c: null,
		temp_f: null,
		humidity: null,
		precip_mm: null,
		precip_in: null,
		wind_kph: null,
		wind_mph: null,
	};

document.forms[0].addEventListener('submit', handleSearchSubmit);
document.addEventListener('click', delegateBodyClick);

function delegateBodyClick(e) {
	const node = e.target;
	if (node.closest('.unit__input')) changeUnits(node);
	if (!node.closest('#search__error')) dom.errorPopupSearchbar.close();
	else return;
}

function handleSearchSubmit(e) {
	e.preventDefault();
	const cityName = document.querySelector('#search__input').value;
	if (cityName.length === 0) {
		dom.errorPopupSearchbar.message('Error: Search field should not be empty!');
		return;
	}

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
		const BASE_URL = 'https://api.weatherapi.com/v1/current.json';
		// Using a free key for practice, currently I HAVE NOT learnt to keep key private in backend.
		const KEY = `1d1b30bb224a47bf94390844230409`;
		const FULL_URL = `${BASE_URL}?key=${KEY}&q=${locationQuery}`;
		response = await fetch(FULL_URL, { mode: 'cors' });

		if (response.status === 200) {
			const responseObj = await response.json();
			extractWeatherData(responseObj);
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

	function extractWeatherData(responseObj) {
		currCityWeatherData.city = responseObj.location.name;
		currCityWeatherData.country = responseObj.location.country;
		const pathString = responseObj.current.condition.icon.split('/').slice(3).join('/');
		currCityWeatherData.iconPath = `../src/${pathString}`;
		currCityWeatherData.description = responseObj.current.condition.text;
		currCityWeatherData.temp_c = responseObj.current.temp_c;
		currCityWeatherData.temp_f = responseObj.current.temp_f;
		currCityWeatherData.humidity = responseObj.current.humidity;
		currCityWeatherData.precip_mm = responseObj.current.precip_mm;
		currCityWeatherData.precip_in = responseObj.current.precip_in;
		currCityWeatherData.wind_kph = responseObj.current.wind_kph;
		currCityWeatherData.wind_mph = responseObj.current.wind_mph;
	}
}
