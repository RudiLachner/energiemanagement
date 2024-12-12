// 'use strict';

// import { fetchPrices, fetchYesterdayPrices } from './data.js';

// (async function () {
//   try {
//     console.log('Fetching current and yesterday prices...');
//     const pricesToday = await fetchPrices();
//     const pricesYesterday = await fetchYesterdayPrices();

//     // Aktueller Preis (letzter Eintrag des Tages)
//     const currentPrice =
//       pricesToday[pricesToday.length - 1]?.marketprice / 1000;

//     // Preis zur gleichen Uhrzeit gestern
//     const now = new Date();
//     const matchingTimeYesterday =
//       pricesYesterday.find(
//         entry => new Date(entry.start_timestamp).getHours() === now.getHours()
//       )?.marketprice / 1000;

//     // Vergleich anzeigen
//     const ctx = document.getElementById('priceComparison').getContext('2d');
//     new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: ['Heute', 'Gestern'],
//         datasets: [
//           {
//             label: 'Strompreis (€/kWh)',
//             data: [currentPrice, matchingTimeYesterday],
//             backgroundColor: [
//               'rgba(75, 192, 192, 0.6)',
//               'rgba(255, 99, 132, 0.6)',
//             ],
//             borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
//             borderWidth: 1,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: { display: false },
//           tooltip: {
//             callbacks: {
//               label: tooltipItem => `${tooltipItem.raw.toFixed(2)} €/kWh`,
//             },
//           },
//         },
//         scales: {
//           x: { ticks: { color: '#fff' } },
//           y: {
//             ticks: { color: '#fff', callback: value => `${value} €/kWh` },
//             beginAtZero: true,
//           },
//         },
//       },
//     });
//   } catch (error) {
//     console.error('Error in index.js:', error);
//   }
// })();
'use strict';

import { fetchPrices, fetchYesterdayPrices } from './data.js';

(async function () {
  try {
    console.log('Fetching current and yesterday prices...');
    const pricesToday = await fetchPrices();
    const pricesYesterday = await fetchYesterdayPrices();

    // Durchschnittspreise berechnen
    const calculateAveragePrice = prices => {
      const total = prices.reduce(
        (sum, entry) => sum + entry.marketprice / 1000,
        0
      ); // €/MWh -> €/kWh
      return total / prices.length;
    };

    const averageToday = calculateAveragePrice(pricesToday);
    const averageYesterday = calculateAveragePrice(pricesYesterday);

    // Vergleich anzeigen
    const ctx = document.getElementById('priceComparison').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Heute (Ø)', 'Gestern (Ø)'],
        datasets: [
          {
            label: 'Durchschnittlicher Strompreis (€/kWh)',
            data: [averageToday, averageYesterday],
            backgroundColor: [
              'rgba(75, 192, 192, 0.6)',
              'rgba(255, 99, 132, 0.6)',
            ],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: tooltipItem => `${tooltipItem.raw.toFixed(2)} €/kWh`,
            },
          },
        },
        scales: {
          x: { ticks: { color: '#fff' } },
          y: {
            ticks: { color: '#fff', callback: value => `${value} €/kWh` },
            beginAtZero: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error in index.js:', error);
  }
})();
