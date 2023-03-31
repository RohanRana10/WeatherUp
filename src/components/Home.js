import React, { useEffect, useState } from 'react'
import styles from '../components/css/home.module.css';
//https://api.openweathermap.org/geo/1.0/direct?q=Pune&appid=1b6ef03eab26715d8675d1633bf6eb6e this gives lat and lon

//https://api.openweathermap.org/data/2.5/weather?lat=18.521428&lon=73.8544541&appid=1b6ef03eab26715d8675d1633bf6eb6e this gives weather

const Home = () => {
    const [region, setRegion] = useState(null);
    const [search, setSearch] = useState("Noida");
    const [regionName, setRegionName] = useState("Noida");
    const [weather, setWeather] = useState(null);
    const [visibility, setVisibility] = useState("");
    const [wind, setWind] = useState("");
    const [clouds, setClouds] = useState("");

    // const apiKey = process.env.REACT_APP_WEATHER_API;
    const apiKey = '1b6ef03eab26715d8675d1633bf6eb6e';

    const fetchAPI = async () => {
        const CoordinatesUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search}&appid=${apiKey}`
        const cResponse = await fetch(CoordinatesUrl);
        // console.log(response.json());
        // console.log(cResponse.statusText);
        const data = await cResponse.json();
        if (data.length !== 0) {
            // console.log(data);
            let latitude = data[0].lat;
            let longitude = data[0].lon;
            const tempUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
            const tResponse = await fetch(tempUrl);
            const tData = await tResponse.json();
            // console.log(tData.main.temp - 273.15);
            setRegionName(tData.name);
            setRegion(tData.main);
            // console.log(tData.weather[0].main);
            setWeather(tData.weather[0]);
            setVisibility(tData.visibility);
            setWind(tData.wind);
            setClouds(tData.clouds.all);
        }
        else {
            setRegion(null);
        }
    }


    useEffect(() => {
        fetchAPI();
        setSearch("");
        // eslint-disable-next-line
    }, []);


    const handleChange = (event) => {
        // setRegion(event.target.value);
        setSearch(event.target.value);
        // console.log(region)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setRegion(search);
        fetchAPI();
        setSearch("");
    }
    return (
        <>
            
            <div className={styles.container}>
                <h1 className={styles.title}>WeatherUp</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputData}>
                        <input type="search" placeholder='Search for location' required className={styles.inputField} value={search} onChange={handleChange} />
                    </div>
                    <button type='submit' className={styles.searchButton}>Search</button>
                </form>
                <div className={styles.box}>
                    {
                        !region ? (<p className={styles.noDataPara}>No Data Found</p>) : (
                            <div className={styles.info}>
                                <div className={styles.infoContainer}>
                                    <h2 className={styles.locationName}>{regionName}</h2>
                                    <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt={weather.main} />
                                    <h3>{weather.description}</h3>
                                    <h1 className={styles.temperature}>{region.temp ? `${Math.trunc(region.temp)}° C` : "--"}</h1>
                                    <h3 className={styles.min_max_temp}>Min: {region.temp ? `${Math.trunc(region.temp_min)}° C` : "--"} | Max: {region.temp ? `${Math.trunc(region.temp_max)}° C` : "--"}</h3>
                                </div>
                                <div className={styles.cardContainer}>
                                    <div className={styles.infoCard}>
                                        <i class="fa-solid fa-droplet"></i>
                                        <h4>Humidity </h4>
                                        <span>{region.humidity}%</span>
                                    </div>
                                    <div className={styles.infoCard}>
                                        <i class="fa-solid fa-temperature-half"></i>
                                        <h4>Feels Like </h4>
                                        <span>{region.temp ? `${Math.trunc(region.feels_like)}° C` : "--"}</span>
                                    </div>
                                    <div className={styles.infoCard}>
                                        <i class="fa-solid fa-arrows-down-to-line"></i>
                                        <h4>Pressure </h4>
                                        <span>{region.temp ? `${Math.trunc(region.pressure)} hPa` : "--"} </span>
                                    </div>
                                    <div className={styles.infoCard}>
                                        <i class="fa-solid fa-cloud-sun"></i>
                                        <h4>Clouds </h4>
                                        <span>{clouds} %</span>
                                    </div>
                                    <div className={styles.infoCard}>
                                        <i class="fa-solid fa-wind"></i>
                                        <h4>Wind </h4>
                                        <span>
                                            {Math.trunc(wind.speed * 3.6)} km/h
                                        </span>
                                    </div>
                                    <div className={styles.infoCard}>
                                        <i class="fa-regular fa-eye"></i>
                                        <h4>Visibility </h4>
                                        <span>
                                            {visibility / 1000} Km
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default Home
