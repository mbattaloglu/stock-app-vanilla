import { STOCK_DATA } from "../data/data.js";

const stockTableBody = document.querySelector(".stock-table-body");
const gainersTableBody = document.querySelector(".gainers-table-body");
const losersTableBody = document.querySelector(".losers-table-body");

//Need filtering, otherwise it sorts the data by changePercent in ascending order(for stock table)
const GAINER_DATA = STOCK_DATA.filter((data) => data.changePercent > 0)
  .sort((prev, last) => last.changePercent - prev.changePercent)
  .slice(0, 5);
const LOSER_DATA = STOCK_DATA.filter((data) => data.changePercent < 0)
  .sort((prev, last) => prev.changePercent - last.changePercent)
  .slice(0, 5);

function createsStockTableRow(data) {
  const row = document.createElement("tr");

  const name = document.createElement("td");
  name.textContent = data.name;

  const previousClose = document.createElement("td");
  previousClose.textContent = data.previousClose;

  const last = document.createElement("td");
  last.textContent = data.last;

  const changePercent = document.createElement("td");
  changePercent.textContent = data.changePercent;
  changePercent.classList.add(data.changePercent < 0 ? "decrease" : "increase");

  const change = document.createElement("td");
  change.textContent = data.change;
  change.classList.add(data.changePercent < 0 ? "decrease" : "increase");

  const tradeTime = document.createElement("td");
  tradeTime.textContent = data.tradeTime;

  row.appendChild(name);
  row.appendChild(previousClose);
  row.appendChild(last);
  row.appendChild(changePercent);
  row.appendChild(change);
  row.appendChild(tradeTime);

  return row;
}

function createBiggestTableRow(data, isGainer) {
  const row = document.createElement("tr");

  const nameTD = document.createElement("td");
  const nameDiv = document.createElement("div");

  const shortNameTitle = document.createElement("h3");
  shortNameTitle.textContent = data.shortName;

  const silentName = document.createElement("p");
  silentName.textContent = data.name;
  silentName.classList.add("silent");

  const changeTD = document.createElement("td");
  const changeDiv = document.createElement("div");

  const changePercentTitle = document.createElement("h3");
  changePercentTitle.textContent = data.changePercent;
  changePercentTitle.classList.add(isGainer ? "increase" : "decrease");

  const lastP = document.createElement("p");
  lastP.textContent = data.last;
  lastP.classList.add("silent");

  nameDiv.appendChild(shortNameTitle);
  nameDiv.appendChild(silentName);
  nameTD.appendChild(nameDiv);

  changeDiv.appendChild(changePercentTitle);
  changeDiv.appendChild(lastP);
  changeTD.appendChild(changeDiv);

  row.appendChild(nameTD);
  row.appendChild(changeTD);

  return row;
}

function insertDataToTable(data, tableBody) {
  tableBody.appendChild(data);
}

if (!STOCK_DATA || STOCK_DATA.length === 0 || !Array.isArray(STOCK_DATA)) {
  const title = document.createElement("h1");
  title.textContent = "No Data. Please try again later.";
  stockTableBody.appendChild(title);
} else {
  STOCK_DATA.forEach((data) => {
    const row = createsStockTableRow(data);
    row.addEventListener("click", () => {
      window.location = `pages/StockHistory/?name=${data.name}`;
    });
    insertDataToTable(row, stockTableBody);
  });
}

if (!GAINER_DATA || GAINER_DATA.length === 0 || !Array.isArray(GAINER_DATA)) {
  const title = document.createElement("p");
  title.textContent =
    "An Error Occured while loading data. Please try again later.";
  gainersTableBody.appendChild(title);
} else {
  GAINER_DATA.forEach((data) => {
    const row = createBiggestTableRow(data, true);
    row.addEventListener("click", () => {
      window.location = `pages/StockHistory/?name=${data.name}`;
    });
    insertDataToTable(row, gainersTableBody);
  });
}

if (!LOSER_DATA || LOSER_DATA.length === 0 || !Array.isArray(LOSER_DATA)) {
  const title = document.createElement("p");
  title.textContent =
    "An Error Occured while loading data. Please try again later.";
  losersTableBody.appendChild(title);
} else {
  LOSER_DATA.forEach((data) => {
    const row = createBiggestTableRow(data, false);
    row.addEventListener("click", () => {
      window.location = `pages/StockHistory/?name=${data.name}`;
    });
    insertDataToTable(row, losersTableBody);
  });
}
