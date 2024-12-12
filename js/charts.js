'use strict';

export function createChart(canvasId, label, data, chartType, color, showTime) {
  if (data.length === 0) {
    console.warn(`Keine Daten für ${canvasId}`);
    return;
  }

  const ctx = document.getElementById(canvasId).getContext('2d');
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

  const values = data.map(entry => entry.marketprice / 1000);

  new Chart(ctx, {
    type: chartType,
    data: {
      labels,
      datasets: [
        {
          label: `${label} (€/kWh)`,
          data: values,
          borderColor: color.border,
          backgroundColor: color.background,
          borderWidth: 1,
          fill: chartType === 'line',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#fff' } },
        title: { display: true, text: label, color: '#fff' },
      },
      scales: {
        x: { ticks: { color: '#fff' } },
        y: { ticks: { color: '#fff' } },
      },
    },
  });
}
