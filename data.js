'use strict';

// Zentralisiertes Datenhandling-Modul
const apiUrl = 'https://api.awattar.at/v1/marketdata';

/**
 * Hilfsfunktion: Konvertiert Datum in Millisekunden seit Epoch
 * @param {Date} date
 * @returns {number} Millisekunden seit Epoch
 */
export function toEpochMillis(date) {
  return date.getTime();
}

/**
 * Daten vom API abrufen
 * @param {number|null} start - Startzeit in Millisekunden
 * @param {number|null} end - Endzeit in Millisekunden
 * @returns {Promise<Array>} API-Daten
 */
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

/**
 * Daten für den Vortag abrufen
 * @returns {Promise<Array>} API-Daten
 */
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

/**
 * Daten für die letzten 7 Tage abrufen
 * @returns {Promise<Array>} API-Daten
 */
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

/**
 * Daten für benutzerdefinierte Zeiträume abrufen
 * @param {number} days - Anzahl der Tage rückwärts ab heute
 * @returns {Promise<Array>} API-Daten
 */
export async function fetchCustomRangePrices(days) {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfRange = new Date(startOfToday);
  startOfRange.setDate(startOfToday.getDate() - days);

  const startMillis = toEpochMillis(startOfRange);
  const endMillis = toEpochMillis(now);

  return await fetchPrices(startMillis, endMillis);
}
