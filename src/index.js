import './style.css';
import { format, addDays } from 'date-fns';
import html from './index.html';

const searchButton = document.querySelector('header .search-icon');
const input = document.querySelector('header input[type="text"]');
const daysContainer = document.querySelector('#day-grid');
const hoursContainer = document.querySelector('#hours-grid');
let globalAPIData;

window.addEventListener('load', async () => {
  let data = await getData('Avigliana');
  globalAPIData = data;
  renderData();
});

searchButton.addEventListener('click', async () => {
  if (input.value) {
    let data = await getData(input.value);
    globalAPIData = data;
    renderData();
  } else {
    alert('Inserisci una località');
  }
});

input.addEventListener('keypress', async (e) => {
  if (e.keyCode == 13) {
    if (input.value) {
      let data = await getData(input.value);
      globalAPIData = data;
      renderData();
    } else {
      alert('Inserisci una località');
    }
  }
});

async function getData(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next13days?unitGroup=metric&lang=it&elements=name%2Caddress%2CresolvedAddress%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslike%2Chumidity%2Cprecip%2Cprecipprob%2Cwindgust%2Cwindspeed%2Cwinddir%2Ccloudcover%2Cconditions%2Cdescription%2Cicon&include=days%2Ccurrent%2Chours%2Cfcst&key=FCNR4DAMNNUUQ26MFULH3A79C&contentType=json`,
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

function renderData() {
  console.log(globalAPIData);
  daysContainer.innerHTML = '';
  createCurrentField();
  createForecastDaysField();
  createHoursInfoData(0);
}

function createCurrentField() {
  let currentField = document.createElement('div');
  currentField.classList.add('current-card');
  currentField.innerHTML = `<p class="current-time">${format(
    new Date(),
    'H:mm'
  )}</p>
        <div class="place">${globalAPIData.address}</div>
        <p class="address">${globalAPIData.resolvedAddress.replace(
          /^[^,]*,\s/,
          ''
        )}</p>
        <p class="current-temp">${globalAPIData.currentConditions.temp}°C</p>
        <p class="">Percepita ${globalAPIData.currentConditions.feelslike}°</p>
        <img src="../src/assets/${
          globalAPIData.currentConditions.icon
        }.svg" alt="" class="current-day-icon" />
        <div class="current-info-box">
          <div class="current-info">
            <img class="" src="../src/assets/water.svg" alt="" />
            <p>${Math.round(globalAPIData.currentConditions.humidity)}%</p>
            <img class="" src="../src/assets/cloud.svg" alt="" />
            <p>${Math.round(globalAPIData.currentConditions.cloudcover)}%</p>
          </div>
          <div class="current-wind-box">
            <div class="wind-circle">
              <img src="../src/assets/winddir.svg" alt="" />
            </div>
            <p>${Math.round(
              globalAPIData.currentConditions.windspeed
            )} / ${Math.round(
    globalAPIData.currentConditions.windgust
  )} Km/h</p>
          </div>
        </div>`;
  daysContainer.appendChild(currentField);
  let windDirection = document.querySelector('.wind-circle img');
  windDirection.style.transform = `rotate(-${globalAPIData.currentConditions.winddir}deg)`;
}

function createForecastDaysField() {
  for (let i = 0; i < globalAPIData.days.length; i++) {
    let dayField = document.createElement('div');
    dayField.classList.add('day-card');
    dayField.setAttribute('data-index', i);
    dayField.innerHTML = `<p class="day">${translateDay(
      format(addDays(new Date(), i), 'EEEE')
    )}
    </p>
        <p class="date">${format(addDays(new Date(), i), 'dd/MM/yyyy')}</p>
        
        <img class="day-icon" src="../src/assets/${setDayIcon(i)}.svg" alt="" />
        <div class="icon-text">
          <img src="../src/assets/min.svg" alt="" />
          <p class="min">${Math.round(globalAPIData.days[i].tempmin)}°</p>
          <img src="../src/assets/max.svg" alt="" />
          <p class="max">${Math.round(globalAPIData.days[i].tempmax)}°</p>
        </div>`;
    dayField.addEventListener('click', function (e) {
      let day = e.target.getAttribute('data-index');
      createHoursInfoData(day);
    });
    daysContainer.appendChild(dayField);
  }
}

function createHoursInfoData(dayIndex) {
  const selectedCard = document.querySelector(`[data-index="${dayIndex}"]`);
  const date =
    selectedCard.children[0].textContent + selectedCard.children[1].textContent;
  const selectedDayData = globalAPIData.days[dayIndex];
  hoursContainer.innerHTML = `<p class="day-name">${date}</p>
      <p class="hour-title">Temp.</p>
      <p class="hour-title hide-info hide-b">T. perc.</p>
      <p class="hour-title hide-info hide-a">Prec. (mm)</p>
      <p class="hour-title hide-info hide-a">% Prec.</p>
      <p class="hour-title hide-info hide-a">% Cop.</p>
      <p class="hour-title hide-info hide-b">% Umid.</p>
      <p class="hour-title hide-info hide-b">Venti (Km/h)</p>
      <div class="more"></div>`;
  let currentHour = new Date().getHours();
  let i = 0;

  if (dayIndex == 0) {
    i = currentHour;
  }

  for (i; i < 24; i++) {
    hoursContainer.innerHTML += `<p class="hour-data hour">${i}:00</p>
    <div class="hour-icon">
      <img src="../src/assets/${
        selectedDayData.hours[i].icon
      }.svg" class="hour-data"></img>
    </div>
    <p class="hour-data description">${selectedDayData.hours[i].conditions}</p>
    <p class="hour-data hour-temp">${Math.round(
      selectedDayData.hours[i].temp
    )}°</p>
    <p class="hour-data hide-info hide-b">${Math.round(
      selectedDayData.hours[i].feelslike
    )}°</p>
    <p class="hour-data hide-info hide-a">${selectedDayData.hours[i].precip}</p>
    <p class="hour-data hide-info hide-a">${Math.round(
      selectedDayData.hours[i].precipprob
    )}</p>
    <p class="hour-data hide-info hide-a">${Math.round(
      selectedDayData.hours[i].cloudcover
    )}</p>
    <p class="hour-data hide-info hide-b">${Math.round(
      selectedDayData.hours[i].humidity
    )}</p>
    <div class="hour-wind hide-info hide-b">
      <img class="hour-wind-direction" data-index="${i}" src=${arrow} alt="">
      <p class="hour-data">${Math.round(
        selectedDayData.hours[i].windspeed
      )} / ${Math.round(selectedDayData.hours[i].windgust)}</p>
    </div>
    <div class="more info" data-index="${i}">+</div>`;
    const hourWindDirectionIcon = document.querySelector(
      `.hour-wind-direction[data-index="${i}"]`
    );
    hourWindDirectionIcon.style.transform = `rotate(-${selectedDayData.hours[i].winddir}deg)`;
  }
  const moreButtons = document.querySelectorAll('.more.info');
  moreButtons.forEach((btn) =>
    btn.addEventListener('click', () =>
      createModal(selectedDayData, btn.getAttribute('data-index'))
    )
  );
}

function setDayIcon(i) {
  if (i == 0) {
    return globalAPIData.days[i].icon;
  } else {
    return globalAPIData.days[i].hours[12].icon;
  }
}

function createModal(day, hour) {
  console.log(day);
  const dialog = document.querySelector('#more-modal');
  const indexData = day.hours[hour];
  console.log(indexData);
  dialog.innerHTML = ` <p>Temperatura percepita: ${indexData.feelslike}°C</p>
      <p>Precipitazioni: ${indexData.precip}mm</p>
      <p>Prob. precipitazioni: ${indexData.precipprob}%</p>
      <p>Copertura: ${Math.round(indexData.cloudcover)}%</p>
      <p>Umidità: ${Math.round(indexData.humidity)}%</p>
      <p>Direzione vento: ${Math.round(indexData.winddir)}°</p>
      <p>Velocità vento: ${Math.round(indexData.windspeed)} / ${Math.round(
    indexData.windgust
  )} Km/h</p>
      <button>Close</button>`;
  const modalBtn = document.querySelector('dialog button');
  modalBtn.addEventListener('click', () => dialog.close());
  dialog.showModal();
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
