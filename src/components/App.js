import { useState } from 'react';
import axios from 'axios';
import './App.css';

export const App = () => {
  const [cityName, setCityName] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const [isError, setIsError] = useState(false);
  const [idError, setIdError] = useState(-1);
  const fetchProxyAPI = async () => {
    try {
      let resp = await axios.post('http://localhost:5000/api/lite/weather', { city: cityName });
      resp.data.state === 200? setWeatherData(resp.data.data) : setIsError(true); setIdError(resp.data.state);
    } catch(e) { if (e.response && e.response.status) { setIdError(e.response.status) } else { setIdError(599) } setIsError(true) }
  }
  const dateBuilder = () => {
    let d = new Date(), months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], day = days[d.getDay()], date = d.getDate(), month = months[d.getMonth()], year = d.getFullYear();
    return `${day}, ${date} ${month} ${year}`;
  }
  const onEnter = (e) => { if (e.keyCode === 13 && cityName.length > 1) { fetchProxyAPI() } else { setWeatherData("undefined"); setIsError(false) } };

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

