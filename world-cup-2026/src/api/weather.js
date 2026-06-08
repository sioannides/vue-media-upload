import axios from 'axios'

const KEY = import.meta.env.VITE_OPENWEATHER_KEY
const BASE = 'https://api.openweathermap.org/data/2.5'

export const hasWeatherKey = () => Boolean(KEY)

export const fetchWeather = async (city, countryCode = 'us') => {
  if (!KEY) return null
  const { data } = await axios.get(`${BASE}/weather`, {
    params: { q: `${city},${countryCode}`, appid: KEY, units: 'metric' }
  })
  return {
    temp: Math.round(data.main.temp),
    feels_like: Math.round(data.main.feels_like),
    description: data.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    humidity: data.main.humidity,
    wind: Math.round(data.wind.speed)
  }
}
