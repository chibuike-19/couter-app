import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";

function App() {
  const [cityClickCounts, setCityClickCounts] = useState({});

  useEffect(() => {
    const storedCityClickCounts =
      JSON.parse(localStorage.getItem("cityClickCounts")) || {};
    setCityClickCounts(storedCityClickCounts);
  }, []);

  const handleButtonClick = () => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            axios
              .get(
                `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=6a7831ffece741a3af14553f1d4ea41c`
              )
              .then((response) => {
                console.log(response);
                const city =
                  response.data.results[0].components.state ||
                  response.data.results[0].components.county ||
                  response.data.results[0].components.city;
                const newCityClickCounts = { ...cityClickCounts };
                newCityClickCounts[city] = (newCityClickCounts[city] || 0) + 1;
                setCityClickCounts(newCityClickCounts);
                localStorage.setItem(
                  "cityClickCounts",
                  JSON.stringify(newCityClickCounts)
                );
              })
              .catch((error) => {
                console.error(error);
              });
          },
          (error) => {
            console.error(error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  };

  return (
    <div>
      <h1>Click Count by City</h1>
      <ul>
        {Object.entries(cityClickCounts).map(([city, clickCount]) => (
          <li key={city}>
            <p>{city}</p> ={">"} <span>{clickCount}</span>
          </li>
        ))}
      </ul>
      <button onClick={handleButtonClick}>Click me</button>
    </div>
  );
}

export default App;
