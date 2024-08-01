import './style.css';
import { format, addDays } from 'date-fns';
import html from './index.html';

/* Capture and create DOM element*/
const searchButton = document.querySelector('header .search-icon');
const input = document.querySelector('header input[type="text"]');
const daysContainer = document.querySelector('#day-grid');

// const place = document.querySelector('.place');
// const address = document.querySelector('.address');
// const currentTime = document.querySelector('.current-time');
// const currentTemp = document.querySelector('.current-temp');

window.addEventListener('load', async () => {
  let data = await getData('Avigliana');
  renderData(data);
});

searchButton.addEventListener('click', async () => {
  if (input.value) {
    let data = await getData(input.value);
    renderData(data);
  } else {
    alert('Inserisci una località');
  }
});

input.addEventListener('keypress', async (e) => {
  if (e.keyCode == 13) {
    if (input.value) {
      let data = await getData(input.value);
      renderData(data);
    } else {
      alert('Inserisci una località');
    }
  }
});

async function getData(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next13days?unitGroup=metric&lang=it&elements=name%2Caddress%2CresolvedAddress%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslike%2Chumidity%2Cprecip%2Cprecipprob%2Cwindgust%2Cwindspeed%2Cwinddir%2Ccloudcover%2Cconditions%2Cdescription%2Cicon&include=days%2Ccurrent%2Chours%2Cfcst&key=FCNR4DAMNNUUQ26MFULH3A79C&contentType=json`,
      // `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next13days?unitGroup=metric&lang=it&key=FCNR4DAMNNUUQ26MFULH3A79C&contentType=json`,
      {
        method: 'GET',
        headers: {},
      }
    );
    const responseJSON = await response.json();
    return responseJSON;
  } catch (err) {
    alert('Qualcosa è andato storto: ' + err);
  }
}

function renderData(data) {
  console.log(data);
  createCurrentField(data);
  createForecastDaysField(data);
  // currentTime.textContent = format(new Date(), 'H:mm');
  // address.textContent = data.resolvedAddress.replace(/^[^,]*,\s/, '');
  // console.log(data);
  // place.textContent = data.address;
}

function createCurrentField(data) {
  let currentField = document.createElement('div');
  currentField.classList.add('current-card');
  currentField.innerHTML = `<p class="current-time">${format(
    new Date(),
    'H:mm'
  )}</p>
        <div class="place">${data.address}</div>
        <p class="address">${data.resolvedAddress.replace(/^[^,]*,\s/, '')}</p>
        <p class="current-temp">${data.currentConditions.temp}°C</p>
        <p class="">Percepita ${data.currentConditions.feelslike}°</p>
        <img src="../src/assets/${
          data.currentConditions.icon
        }.png" alt="" class="current-day-icon" />
        <div class="current-info-box">
          <div class="icon-text current">
            <img class="" src="../src/assets/snow.png" alt="" />
            <p>${Math.round(data.currentConditions.humidity)}%</p>
            <img class="" src="../src/assets/snow.png" alt="" />
            <p>${Math.round(data.currentConditions.cloudcover)}%</p>
          </div>
          <div class="current-wind-box">
            <div class="wind-circle">
              <img src="../src/assets/snow.png" alt="" />
            </div>
            <p></p>
          </div>
        </div>`;
  daysContainer.appendChild(currentField);
  let windDirection = document.querySelector('.wind-circle img');
  windDirection.style.transform = `rotate(-${data.currentConditions.winddir}deg)`;
}

function createForecastDaysField(data) {
  for (let i = 0; i < data.days.length; i++) {
    console.log('Day n. ' + data.days[i].temp);

    let dayField = document.createElement('div');
    dayField.classList.add('day-card');
    dayField.innerHTML = `<p class="day">${translateDay(
      format(addDays(new Date(), i), 'EEEE')
    )}
    </p>
        <p class="date">${format(addDays(new Date(), i), 'dd/MM/yyyy')}</p>
        <div class="icon-text forecast">
          <img src="../src/assets/snow.png" alt="" />
          <p class="min">${Math.round(data.days[i].tempmin)}</p>
          <img src="../src/assets/snow.png" alt="" />
          <p class="max">${Math.round(data.days[i].tempmax)}</p>
        </div>
        <img class="forecast day-icon" src="../src/assets/snow.png" alt="" />`;
    daysContainer.appendChild(dayField);
    let windDirection = document.querySelector('.wind-circle img');
    windDirection.style.transform = `rotate(-${data.currentConditions.winddir}deg)`;
  }
}

function translateDay(day) {
  switch (day) {
    case 'Monday':
      return 'Lunedì';
      break;
    case 'Tuesday':
      return 'Martedì';
      break;
    case 'Wednesday':
      return 'Mercoledì';
      break;
    case 'Thursday':
      return 'Giovedì';
      break;
    case 'Friday':
      return 'Venerdì';
      break;
    case 'Saturday':
      return 'Sabato';
      break;
    case 'Sunday':
      return 'Domenica';
      break;

    default:
      break;
  }
}

//https://erikflowers.github.io/weather-icons/
