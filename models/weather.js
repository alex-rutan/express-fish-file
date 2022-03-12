const axios = require('axios');
const BASE_URL = "https://api.tomorrow.io/v4/timelines";
const API_KEY = process.env.WEATHER_API_KEY;


/** Weather Class.
 *
 * Static class tying together methods used to get weather data 
 * from the Weather API.
 */

class Weather {
  static async request(endpoint) {
    // console.debug("Weather API Call:", endpoint);
    const url = `${BASE_URL}?${endpoint}&apikey=${API_KEY}`;

    try {
      console.log("HERE", url);
      return await axios.get(url);
    } catch (err) {
      console.error("Weather API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get current weather, temperature, atmospheric pressure, and wind speed at latitude and longitude coordinates. */
  static async getCurrWeather(decLat, decLong) {
    const fields = 'fields=weatherCode,temperature,pressureSeaLevel,windSpeed'
    const res = await this.request(`location=${decLat},${decLong}&${fields}&timesteps=current&units=imperial`);
    console.log("RES: ", res.data);
    
    const values = res.data.data.timelines[0].intervals[0].values;

    const currWeatherCode = String(values.weatherCode) + "0";
    const currTemp = String(Math.round(values.temperature));
    const pressure = String(values.pressureSeaLevel);
    const windSpeed = String(Math.round(values.windSpeed));

    console.log("CURRTEMP: ", currTemp);
    return { currWeatherCode, currTemp, pressure, windSpeed };
  }

  
  /** Get 7-day forecasted weather conditions at latitude and longitude coordinates. */
  static async getForecastedWeather(decLat, decLong) {
    const fields = 'fields=weatherCodeDay,precipitationProbability,temperatureMax,temperatureMin,windSpeed,pressureSeaLevel'
    const res = await this.request(`location=${decLat},${decLong}&${fields}&timesteps=1d&units=imperial`);
    console.log("RES: ", res.data);

    const days = res.data.data.timelines[0].intervals.slice(0, 7);
    const forecast = [];

    for (let day of days) {
      const values = day.values;

      const allDayWeatherCode = String(values.weatherCodeDay);
      const highTemp = String(Math.round(values.temperatureMax));
      const lowTemp = String(Math.round(values.temperatureMin));
      const precipChance = String(values.precipitationProbability);
      const windSpeed = String(Math.round(values.windSpeed));
      const pressure = String(values.pressureSeaLevel);

      forecast.push({ allDayWeatherCode, highTemp, lowTemp, precipChance, windSpeed, pressure });
    }

    // const values = res.data.data.timelines[0].intervals[0].values;

    // const allDayWeatherCode = String(values.weatherCodeDay);
    // const maxTemp = String(Math.round(values.temperatureMax));
    // const minTemp = String(Math.round(values.temperatureMin));
    // const precipChance = String(values.precipitationProbability);
    // const windSpeed = String(Math.round(values.windSpeed));
    // const pressure = String(values.pressureSurfaceLevel);

    return forecast;
  }
}


module.exports = Weather;