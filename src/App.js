import { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import './App.css';

export const App = () => {
  const [cityName, setCityName] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const [isError, setIsError] = useState(false);
  const [idError, setIdError] = useState(-1);

  const useThrottledCallback = (callback, delay) => {
    const lastCallTimeRef = useRef(Date.now());
    const throttledCallback = useCallback((...args) => {
      const now = Date.now(); if (now - lastCallTimeRef.current >= delay) { lastCallTimeRef.current = now; callback(...args) } }, [callback, delay]);
    return throttledCallback;
  };

  const fetchProxyAPI = async () => {
    try { 
      const resp = await axios.post('http://localhost:5000/services/weather', { city: cityName }); setIsError(resp.data.code !== 200 && resp.data.code !== 304); setIdError(resp.data.code); 
      if (resp.data.code === 200 || resp.data.code === 304) { setWeatherData(resp.data.data) }
    } catch (e) { setIdError(e.response && e.response.status ? e.response.status : 599); setIsError(true) }
  };

  const throttledFetchProxyAPI = useThrottledCallback(fetchProxyAPI, 1500);

  const dateBuilder = () => {
    let d = new Date(), months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], day = days[d.getDay()], date = d.getDate(), month = months[d.getMonth()], year = d.getFullYear();
    return `${day}, ${date} ${month} ${year}`;
  };

  const onEnter = (e) => { if (e.keyCode === 13 && cityName.length > 1) { throttledFetchProxyAPI() } else { setWeatherData("undefined"); setIsError(false) } };

  return (
    <div className="wrapper">
      <div className="mainWindow">
        <div className={ typeof weatherData.city == "undefined" ? 'background' : weatherData.temp > 0 ? 'background heap': 'background cold' }></div>
        <input type="text" className="header" id="header" placeholder="Search" onChange={e=> setCityName(e.target.value)} onKeyDown={onEnter} value={cityName}/>
        {
          isError ? ( 
            <img className="errWrap" src={`/assets/${idError}.jpg`} alt="err" />
          ):
          typeof weatherData.city=="undefined" ? ( null ):
          (
            <>
              <div className="locationBox">
                <div className="location">{ `${weatherData.city}, ${weatherData.country}` }</div>
                <div className="date">{ dateBuilder() }</div>
              </div>
  
              <div className="weatherBox">
                <div className="temp">{ weatherData.temp }°c</div>
                <div className="weather">{ weatherData.weather }</div>
              </div>
            </>
          )
        }
      </div>
    </div>
  )
}

