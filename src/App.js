import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found. Please check the spelling.");
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        city: name,
        country,
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
        weathercode: weatherData.current_weather.weathercode
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-between bg-light bg-gradient">
      <header className="text-center py-5 bg-primary text-white shadow">
        <h1 className="display-5 fw-bold">🌤️ Weather Now</h1>
        <p className="lead">Check current weather in any city</p>
      </header>

      <main className="container my-5">
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={fetchWeather}
              disabled={!city || loading}
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
        </div>

        {error && (
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6">
              <div className="alert alert-danger text-center">{error}</div>
            </div>
          </div>
        )}

        {weather && (
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6">
              <div className="card shadow-lg border-0">
                <div className="card-body text-center">
                  <h3 className="card-title">
                    <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                    {weather.city}, {weather.country}
                  </h3>
                  <hr />
                  <div className="row">
                    <div className="col">
                      <h4>
                        <i className="bi bi-thermometer-half text-danger me-2"></i>
                        {weather.temperature} °C
                      </h4>
                      <p className="text-muted">Temperature</p>
                    </div>
                    <div className="col">
                      <h4>
                        <i className="bi bi-wind text-info me-2"></i>
                        {weather.windspeed} km/h
                      </h4>
                      <p className="text-muted">Wind Speed</p>
                    </div>
                  </div>
                  <p className="text-muted small mt-3">
                    Weather code: {weather.weathercode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-3 text-muted small">
        Made with ❤️ using React & Open-Meteo API
      </footer>
    </div>
  );
}

export default App;
