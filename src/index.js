import './style.css';
import html from './index.html';

const button = document.querySelector('button');

button.addEventListener('click', () => getData());

async function getData() {
  const response = await fetch(
    'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/turin?unitGroup=us&key=FCNR4DAMNNUUQ26MFULH3A79C&contentType=json',
    {
      method: 'GET',
      headers: {},
    }
  );

  const responseJSON = await response.json();

  console.log(responseJSON.currentConditions.temp);

  // .then((response) => {
  //     console.log(response);
  // })
  // .catch((err) => {
  //     console.error(err);
  // });
}
