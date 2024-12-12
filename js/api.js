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
