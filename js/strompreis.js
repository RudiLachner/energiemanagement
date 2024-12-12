'use strict';

import { fetchPrices } from './api.js';
import { createChart } from './charts.js';

(async function () {
  const pricesNext24h = await fetchPrices();
  const pricesYesterday = await fetchPrices(/* start/end args for yesterday */);
  const pricesLast7Days =
    await fetchPrices(/* start/end args for last 7 days */);

  createChart(
    'next24HoursChart',
    'Strompreis Forecast',
    pricesNext24h,
    'line',
    { border: 'rgba(75, 192, 192, 1)', background: 'rgba(75, 192, 192, 0.2)' },
    true
  );
  createChart(
    'yesterdayChart',
    'Preis - Vortag',
    pricesYesterday,
    'bar',
    { border: 'rgba(255, 99, 132, 1)', background: 'rgba(255, 99, 132, 0.2)' },
    true
  );
  createChart(
    'last7DaysChart',
    'Preis - Letzte 7 Tage',
    pricesLast7Days,
    'bar',
    { border: 'rgba(54, 162, 235, 1)', background: 'rgba(54, 162, 235, 0.3)' },
    false
  );
})();
