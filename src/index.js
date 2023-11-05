import "./style.css";

class WheatherApp {
  constructor(apiKey, apiUrl) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
    this.form = document.querySelector("[data-form]");
    this.section = document.querySelector("[data-section]");
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const city = this.form.input.value;
      if (city) {
        this.displayWeather(city);
      }
    });
  }

  async fetchWeatherData(city) {
    try {
      const response = await fetch(
        `${this.apiUrl}?key=${this.apiKey}&q=${city}&days=3&aqi=no&alerts=no`,
        { mode: "cors" }
      );
      if (!response.ok) {
        throw new Error(`City ${city} is not found`);
      }
      return response.json();
    } catch (err) {
      alert(err);
      return null;
    }
  }

  convertData(data) {
    const {
      location: { name, localtime, region, country },
      current: {
        condition: { text, icon },
        temp_c,
        temp_f,
      },
      forecast: {
        forecastday: [
          {
            day: { maxtemp_c, mintemp_c, mintemp_f, maxtemp_f },
          },
        ],
      },
    } = data;

    return {
      name,
      localtime,
      text,
      icon,
      temp_c,
      temp_f,
      maxtemp_c,
      maxtemp_f,
      mintemp_c,
      mintemp_f,
      region,
      country,
    };
  }

  formatDate(dateString) {
    const [[year, month, day], [hour, minute]] = [
      dateString.split(" ")[0].split("-"),
      dateString.split(" ")[1].split(":"),
    ];

    return `${day}-${month}-${year} ${hour}:${minute}`;
  }

  displayData(preData) {
    const data = this.convertData(preData);
    const html = `
      <p class="city">${data.name}/${data.region}/${data.country}</p>
      <p class="date">Date: <span>${this.formatDate(data.localtime)}</span></p>
      <figure>
        <img src="${data.icon}" alt="${data.text}" />
        <figcaption>${data.text}</figcaption>
      </figure>
      <p class="temperature">${data.temp_c}°C</p>
      <p class="lowHigh">L: <span>${data.mintemp_c}°C</span> H: <span>${
      data.maxtemp_c
    }°C</span></p>`;

    this.section.innerHTML = "";
    this.section.innerHTML = html;
  }
  async displayWeather(city) {
    const data = await this.fetchWeatherData(city);
    if (data) {
      this.displayData(data);
    }
  }
}

const key = "8d664b9b29314e7a820201242232910";
const url = "https://api.weatherapi.com/v1/forecast.json";

new WheatherApp(key, url);
