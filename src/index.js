import "./style.css";
import html from "./index.html";

const button = document.querySelector("button");
const input = document.querySelector("input");

button.addEventListener("click", () => getData());
// input.addEventListener("keypress", () => {
//   console.log(input.value);
// });

async function getData() {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${input.value}?unitGroup=metric&key=FCNR4DAMNNUUQ26MFULH3A79C&contentType=json`,
      {
        method: "GET",
        headers: {},
      }
    );
    const responseJSON = await response.json();
    console.log(responseJSON);
  } catch (err) {
    console.log(err);
  }
}

/* Giorno completo:
data tempmax tempmin tempmaxpercep umidità vento(dir, media, raffiche) alba tramonto icona

Orari:
orario tempmax tempmin tempmaxpercep umidità precip(prob) vento(dir, media, raffiche) icona condition
*/
