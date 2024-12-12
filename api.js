'use strict';

const apiUrl = 'https://api.awattar.at/v1/marketdata';

export async function fetchPrices(start = null, end = null) {
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

// Hilfsfunktion: Konvertiert Datum in Millisekunden seit Epoch
function toEpochMillis(date) {
  return date.getTime();
}

// Daten für den Vortag abrufen
export async function fetchYesterdayPrices() {
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
export async function fetchLast7DaysPrices() {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOf7DaysAgo = new Date(startOfToday);
  startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 7);

  const startMillis = toEpochMillis(startOf7DaysAgo);
  const endMillis = toEpochMillis(now);

  return await fetchPrices(startMillis, endMillis);
}
