'use strict';

import {
  fetchPrices,
  fetchYesterdayPrices,
  fetchLast7DaysPrices,
} from './data.js';
import { createChart } from './charts.js';

(async function () {
  try {
    console.log('Fetching data for charts...');

    // Daten laden
    const pricesNext24h = await fetchPrices();
    console.log('Next 24 hours data:', pricesNext24h);

    const pricesYesterday = await fetchYesterdayPrices();
    console.log('Yesterday data:', pricesYesterday);

    const pricesLast7Days = await fetchLast7DaysPrices();
    console.log('Last 7 days data:', pricesLast7Days);

    // Diagramme erstellen
    createChart(
      'next24HoursChart',
      'Strompreis Forecast',
      pricesNext24h,
      'line',
      {
        border: 'rgba(75, 192, 192, 1)',
        background: 'rgba(75, 192, 192, 0.2)',
      },
      true
    );

    createChart(
      'yesterdayChart',
      'Preis - Vortag',
      pricesYesterday,
      'bar',
      {
        border: 'rgba(255, 99, 132, 1)',
        background: 'rgba(255, 99, 132, 0.2)',
      },
      true
    );

    createChart(
      'last7DaysChart',
      'Preis - Letzte 7 Tage',
      pricesLast7Days,
      'bar',
      {
        border: 'rgba(54, 162, 235, 1)',
        background: 'rgba(54, 162, 235, 0.3)',
      },
      false
    );
  } catch (error) {
    console.error('Error in strompreis.js:', error);
  }
})();
