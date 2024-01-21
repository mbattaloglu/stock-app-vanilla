import generateCandlesData from "@devexperts/dxcharts-lite/dist/chart/utils/candles-generator.utils";
import { STOCK_DATA } from "../../../data/data.js";

//Get the parameters from the URL(Stock Name)
let stockName = window.location.search.split("=")[1];
//Decode the URI
stockName = decodeURI(stockName);

const stockData = STOCK_DATA.find((stock) => stock.name === stockName);

const info = document.querySelector(".info");
const chartContainer = document.querySelector(".chart-container");
const radioButtons = document.querySelectorAll(".chart-type-selector input");

function createStockInfoBox() {
  const shortName = document.createElement("h1");
  shortName.innerText = stockData.name;

  const price = document.createElement("h2");
  price.innerText = stockData.last;

  const changePercent = document.createElement("h3");
  changePercent.innerText = stockData.changePercent + "%";
  changePercent.classList.add(
    stockData.changePercent > 0 ? "increase" : "decrease"
  );

  const date = document.createElement("h4");
  date.innerText = stockData.tradeTime;

  info.appendChild(shortName);
  info.appendChild(price);
  info.appendChild(changePercent);
  info.appendChild(date);
}

function createChart(candles) {
  // eslint-disable-next-line no-undef
  const chart = DXChart.createChart(chartContainer);
  chart.setData({ candles });
  return chart;
}

function generateHeikinAshiCandlesData(candles) {
  let heikinAshiCandles = [];
  for (let i = 0; i < candles.length; i++) {
    heikinAshiCandles.push(
      generateHeikinAshiCandle(candles[i - 1], candles[i])
    );
  }
  return heikinAshiCandles;
}

function generateHeikinAshiCandle(previousCandle, currentCandle) {
  if (previousCandle) {
    const heikinAshiCandle = {
      open: (previousCandle.open + previousCandle.close) / 2,
      hi: Math.max(currentCandle.hi, currentCandle.open, currentCandle.close),
      lo: Math.min(currentCandle.lo, currentCandle.open, currentCandle.close),
      close:
        (currentCandle.open +
          currentCandle.close +
          currentCandle.hi +
          currentCandle.lo) /
        4,
      timestamp: currentCandle.timestamp,
      isVisible: currentCandle.isVisible,
      volume: currentCandle.volume,
    };
    return heikinAshiCandle;
  } else return currentCandle;
}

if (!stockData) {
  const title = document.createElement("h1");
  title.innerText = "No data found";

  const infoText = document.createElement("p");
  infoText.innerText = "Please, try again later.";

  const homePage = document.createElement("a");
  homePage.innerText = "Go Home Page";
  homePage.href = "/src";
  homePage.style.color = "red";

  chartContainer.appendChild(title);
  chartContainer.appendChild(infoText);
  chartContainer.appendChild(homePage);
  document.querySelector(".chart-type-selector").style.display = "none";
} else {
  createStockInfoBox();
  // create and set candles data
  const candles = generateCandlesData();
  // create and set heikin ashi candles data
  const heikinAshiCandles = generateHeikinAshiCandlesData(candles);
  // create chart
  const chart = createChart(candles);

  Array.from(radioButtons).forEach((radioButton) => {
    radioButton.addEventListener("change", (e) => {
      if (e.target.value === "heikinAshi") {
        chart.setData({ candles: heikinAshiCandles });
        chart.setChartType("candle");
      } else {
        chart.setData({ candles });
        chart.setChartType(e.target.value);
      }
    });
  });
}
