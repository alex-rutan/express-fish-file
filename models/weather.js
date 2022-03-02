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

  /** Get current temperature and atmospheric pressure at latitude and longitude coordinates. */
  static async getCurrWeather(decLat, decLong) {
    const fields = 'fields=temperature,pressureSurfaceLevel'
    const res = await this.request(`location=${decLat},${decLong}&${fields}&timesteps=current&units=imperial`);
    console.log("RES: ", res.data);
    
    const currTemp = res.data.data.timelines[0].intervals[0].values.temperature;
    const pressure = res.data.data.timelines[0].intervals[0].values.pressureSurfaceLevel;
    return { currTemp, pressure };
  }

  /** Get today's max and min temperature at latitude and longitude coordinates. */
  static async getMaxMinTemps(decLat, decLong) {
    const fields = 'fields=temperatureMax,temperatureMin'
    const res = await this.request(`location=${decLat},${decLong}&${fields}&timesteps=1d&units=imperial`);
    console.log("RES: ", res.data);

    const maxTemp = res.data.data.timelines[0].intervals[0].values.temperatureMax;
    const minTemp = res.data.data.timelines[0].intervals[0].values.temperatureMin;
    return { maxTemp, minTemp };
  }
}

module.exports = Weather;