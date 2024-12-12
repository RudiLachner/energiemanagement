'use strict';

import { fetchPrices, fetchYesterdayPrices } from './data.js';

// Simulierte PV-Daten als Fallback, falls keine Daten im Session Storage vorhanden sind
const fallbackPVData = [
  0, 0, 0, 0, 0, 0, 50, 150, 300, 500, 700, 800, 850, 800, 700, 500, 300, 150,
  50, 0, 0, 0, 0, 0,
];

// Simulierte Verbrauchsdaten als Fallback
const fallbackConsumptionData = [
  400, 380, 370, 360, 350, 340, 850, 600, 380, 400, 400, 700, 1200, 850, 600,
  450, 550, 450, 750, 1100, 600, 750, 600, 450,
];

(async function () {
  // Strompreis-Kachel aktualisieren
  try {
    console.log('Fetching current and yesterday prices...');
    const pricesToday = await fetchPrices();
    const pricesYesterday = await fetchYesterdayPrices();

    const calculateAveragePrice = prices => {
      const total = prices.reduce(
        (sum, entry) => sum + entry.marketprice / 1000,
        0
      ); // €/MWh -> €/kWh
      return total / prices.length;
    };

    const averageToday = calculateAveragePrice(pricesToday);
    const averageYesterday = calculateAveragePrice(pricesYesterday);

    const ctxPrice = document
      .getElementById('priceComparison')
      .getContext('2d');
    new Chart(ctxPrice, {
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
    console.error('Error in price tile:', error);
  }

  // PV-Produktion-Kachel aktualisieren
  try {
    const ctxPV = document.getElementById('pvPreview').getContext('2d');

    // PV-Daten aus Session Storage laden oder Fallback verwenden
    const pvData =
      JSON.parse(sessionStorage.getItem('pvData')) || fallbackPVData;

    new Chart(ctxPV, {
      type: 'line',
      data: {
        labels: Array.from(
          { length: 24 },
          (_, i) => `${i.toString().padStart(2, '0')}:00`
        ),
        datasets: [
          {
            label: 'PV-Leistung (W)',
            data: pvData,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 1,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
        scales: {
          x: { ticks: { color: '#fff' } },
          y: {
            ticks: { color: '#fff', callback: value => `${value} W` },
            beginAtZero: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error in PV tile:', error);
  }

  // Verbrauch Haushalt-Kachel aktualisieren
  try {
    const ctxConsumption = document
      .getElementById('consumptionPreview')
      .getContext('2d');

    // Verbrauchsdaten aus Session Storage laden oder Fallback verwenden
    const consumptionData =
      JSON.parse(sessionStorage.getItem('consumptionData')) ||
      fallbackConsumptionData;

    new Chart(ctxConsumption, {
      type: 'bar',
      data: {
        labels: Array.from(
          { length: 24 },
          (_, i) => `${i.toString().padStart(2, '0')}:00`
        ),
        datasets: [
          {
            label: 'Haushaltsverbrauch (W)',
            data: consumptionData,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
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
              label: tooltipItem => `${tooltipItem.raw} W`,
            },
          },
        },
        scales: {
          x: { ticks: { color: '#fff' } },
          y: {
            ticks: { color: '#fff', callback: value => `${value} W` },
            beginAtZero: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error in consumption tile:', error);
  }
})();

// 'use strict';

// import { fetchPrices, fetchYesterdayPrices } from './data.js';

// // Simulierte PV-Daten als Fallback, falls keine Daten im Session Storage vorhanden sind
// const fallbackPVData = [
//   0, 0, 0, 0, 0, 0, 50, 150, 300, 500, 700, 800, 850, 800, 700, 500, 300, 150,
//   50, 0, 0, 0, 0, 0,
// ];

// // Simulierte Verbrauchsdaten als Fallback
// const fallbackConsumptionData = Array(24).fill(300);

// (async function () {
//   // Strompreis-Kachel aktualisieren
//   try {
//     console.log('Fetching current and yesterday prices...');
//     const pricesToday = await fetchPrices();
//     const pricesYesterday = await fetchYesterdayPrices();

//     const calculateAveragePrice = prices => {
//       const total = prices.reduce(
//         (sum, entry) => sum + entry.marketprice / 1000,
//         0
//       ); // €/MWh -> €/kWh
//       return total / prices.length;
//     };

//     const averageToday = calculateAveragePrice(pricesToday);
//     const averageYesterday = calculateAveragePrice(pricesYesterday);

//     const ctxPrice = document
//       .getElementById('priceComparison')
//       .getContext('2d');
//     new Chart(ctxPrice, {
//       type: 'bar',
//       data: {
//         labels: ['Heute (Ø)', 'Gestern (Ø)'],
//         datasets: [
//           {
//             label: 'Durchschnittlicher Strompreis (€/kWh)',
//             data: [averageToday, averageYesterday],
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
//     console.error('Error in price tile:', error);
//   }

//   // PV-Produktion-Kachel aktualisieren
//   try {
//     const ctxPV = document.getElementById('pvPreview').getContext('2d');

//     // PV-Daten aus Session Storage laden oder Fallback verwenden
//     const pvData =
//       JSON.parse(sessionStorage.getItem('pvData')) || fallbackPVData;

//     new Chart(ctxPV, {
//       type: 'line',
//       data: {
//         labels: Array.from(
//           { length: 24 },
//           (_, i) => `${i.toString().padStart(2, '0')}:00`
//         ),
//         datasets: [
//           {
//             label: 'PV-Leistung (W)',
//             data: pvData,
//             borderColor: 'rgba(54, 162, 235, 1)',
//             backgroundColor: 'rgba(54, 162, 235, 0.2)',
//             borderWidth: 1,
//             fill: true,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: { display: true },
//         },
//         scales: {
//           x: { ticks: { color: '#fff' } },
//           y: {
//             ticks: { color: '#fff', callback: value => `${value} W` },
//             beginAtZero: true,
//           },
//         },
//       },
//     });
//   } catch (error) {
//     console.error('Error in PV tile:', error);
//   }

//   // Verbrauch Haushalt-Kachel aktualisieren
//   try {
//     const ctxConsumption = document
//       .getElementById('consumptionPreview')
//       .getContext('2d');

//     // Verbrauchsdaten aus Session Storage laden oder Fallback verwenden
//     const consumptionData =
//       JSON.parse(sessionStorage.getItem('consumptionData')) ||
//       fallbackConsumptionData;

//     new Chart(ctxConsumption, {
//       type: 'bar',
//       data: {
//         labels: Array.from(
//           { length: 24 },
//           (_, i) => `${i.toString().padStart(2, '0')}:00`
//         ),
//         datasets: [
//           {
//             label: 'Haushaltsverbrauch (W)',
//             data: consumptionData,
//             backgroundColor: 'rgba(255, 99, 132, 0.6)',
//             borderColor: 'rgba(255, 99, 132, 1)',
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
//               label: tooltipItem => `${tooltipItem.raw} W`,
//             },
//           },
//         },
//         scales: {
//           x: { ticks: { color: '#fff' } },
//           y: {
//             ticks: { color: '#fff', callback: value => `${value} W` },
//             beginAtZero: true,
//           },
//         },
//       },
//     });
//   } catch (error) {
//     console.error('Error in consumption tile:', error);
//   }
// })();
