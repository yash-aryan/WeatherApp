'use strict';

function displayWeatherData(weatherData, isMetric) {
	const outputTempValue = document.querySelector('#condition__temp'),
		outputHumidValue = document.querySelector('#condition__humid'),
		outputPrecipValue = document.querySelector('#condition__precip'),
		outputWindSpeedValue = document.querySelector('#condition__wind-speed'),
		outputCity = document.querySelector('#output-city');

	outputCity.textContent = `${weatherData.city}, ${weatherData.country}`;
	outputHumidValue.textContent = `${weatherData.humidity}%`;

	if (isMetric) {
		outputTempValue.textContent = `${weatherData.temp_c} °C`;
		outputPrecipValue.textContent = `${weatherData.precip_mm} mm`;
		outputWindSpeedValue.textContent = `${weatherData.wind_kph} kmph`;
	} else {
		outputTempValue.textContent = `${weatherData.temp_f} °F`;
		outputPrecipValue.textContent = `${weatherData.precip_in} inches`;
		outputWindSpeedValue.textContent = `${weatherData.wind_mph} mph`;
	}
}

const errorPopupSearchbar = (() => {
	const popup = document.querySelector('#search__error');
	close();

	function message(text) {
		popup.style.display = 'block';
		popup.textContent = text;
	}

	function close() {
		popup.style.display = 'none';
	}

	return {
		message,
		close,
	};
})();

export default {
	displayWeatherData,
	errorPopupSearchbar,
};
