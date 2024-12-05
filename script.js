'use strict';

const apiUrl = 'https://api.awattar.at/v1/marketdata';

// Hilfsfunktion: Konvertiert Datum in Millisekunden seit Epoch
function toEpochMillis(date) {
  return date.getTime();
}

// Hilfsfunktion: Berechnet Durchschnitt, Min und Max
function calculateStats(data) {
  const prices = data.map(entry => entry.marketprice / 1000); // €/MWh -> €/kWh
  const average = prices.reduce((a, b) => a + b, 0) / prices.length;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return { average, min, max };
}

// Daten für den aktuellen Zeitraum abrufen
async function fetchPrices(start = null, end = null) {
  try {
    let url = `${apiUrl}`;
    if (start || end) {
      url += '?';
      if (start) url += `start=${start}&`;
      if (end) url += `end=${end}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    return [];
  }
}

// Daten für den Vortag abrufen
async function fetchYesterdayPrices() {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const startMillis = toEpochMillis(startOfYesterday);
  const endMillis = toEpochMillis(startOfToday);

  return await fetchPrices(startMillis, endMillis);
}

// Daten für die letzten 7 Tage abrufen
async function fetchLast7DaysPrices() {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOf7DaysAgo = new Date(startOfToday);
  startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 7);

  const startMillis = toEpochMillis(startOf7DaysAgo);
  const endMillis = toEpochMillis(now);

  return await fetchPrices(startMillis, endMillis);
}

// Diagramm erstellen
function createChart(canvasId, label, data, chartType, color, showTime) {
  if (data.length === 0) {
    console.warn(`Keine Daten für ${canvasId}`);
    return;
  }

  const ctx = document.getElementById(canvasId).getContext('2d');

  // Labels: Zeitstempel formatieren
  const labels = data.map(entry => {
    const date = new Date(entry.start_timestamp);
    return showTime
      ? `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')} ${date
          .getHours()
          .toString()
          .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
      : date.toLocaleDateString();
  });

  // Werte in €/kWh
  const values = data.map(entry => entry.marketprice / 1000);

  // Statistiken berechnen
  const { average, min, max } = calculateStats(data);

  // Diagramm erstellen
  new Chart(ctx, {
    type: chartType, // Chart-Typ dynamisch
    data: {
      labels,
      datasets: [
        {
          label: `${label} (€/kWh)`,
          data: values,
          borderColor: color.border,
          backgroundColor: color.background,
          borderWidth: 1,
          fill: chartType === 'line', // Nur beim Liniendiagramm füllen
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: '#fff' },
        },
        title: {
          display: true,
          text: `Durchschnitt: ${average.toFixed(2)} €/kWh, Min: ${min.toFixed(
            2
          )} €/kWh, Max: ${max.toFixed(2)} €/kWh`,
          color: '#fff',
        },
      },
      scales: {
        x: {
          ticks: { color: '#fff' },
        },
        y: {
          ticks: { color: '#fff' },
        },
      },
    },
  });
}

// Hauptfunktion
(async function () {
  // Nächste 24 Stunden abrufen
  const pricesNext24h = await fetchPrices();

  // Vortag abrufen
  const pricesYesterday = await fetchYesterdayPrices();

  // Letzte 7 Tage abrufen
  const pricesLast7Days = await fetchLast7DaysPrices();

  // Diagramme erstellen
  createChart(
    'next24HoursChart',
    'Strompreis Forecast',
    pricesNext24h,
    'line',
    { border: 'rgba(75, 192, 192, 1)', background: 'rgba(75, 192, 192, 0.2)' },
    true // Zeit anzeigen
  );
  createChart(
    'yesterdayChart',
    'Preis - Vortag',
    pricesYesterday,
    'bar',
    { border: 'rgba(255, 99, 132, 1)', background: 'rgba(255, 99, 132, 0.2)' },
    true // Zeit anzeigen
  );
  createChart(
    'last7DaysChart',
    'Preis - Letzte 7 Tage',
    pricesLast7Days,
    'bar',
    { border: 'rgba(54, 162, 235, 1)', background: 'rgba(54, 162, 235, 0.3)' },
    false // Nur Datum anzeigen
  );
})();
