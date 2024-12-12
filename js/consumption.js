'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const slidersContainer = document.getElementById('sliders');

  // Verbrauchsdaten aus Session Storage laden oder mit Standardwerten initialisieren
  const consumptionData = JSON.parse(
    sessionStorage.getItem('consumptionData')
  ) || [
    400, 380, 370, 360, 350, 340, 850, 600, 380, 400, 400, 700, 1200, 850, 600,
    450, 550, 450, 750, 1100, 600, 750, 600, 450,
  ];

  // Dynamisch Schieberegler erstellen
  for (let hour = 0; hour < 24; hour++) {
    const sliderWrapper = document.createElement('div');
    sliderWrapper.classList.add('slider');

    const timeLabel = document.createElement('span');
    timeLabel.textContent = `${hour.toString().padStart(2, '0')}:00`;
    timeLabel.style.fontSize = '0.85em';
    timeLabel.style.color = '#aaa';
    timeLabel.style.marginBottom = '5px';

    const valueLabel = document.createElement('span');
    valueLabel.textContent = `${consumptionData[hour]} W`;
    valueLabel.style.fontSize = '1em';
    valueLabel.style.color = '#fff';
    valueLabel.style.marginTop = '5px';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 5000;
    slider.value = consumptionData[hour];
    slider.dataset.hour = hour;

    slider.addEventListener('input', event => {
      const hourIndex = event.target.dataset.hour;
      consumptionData[hourIndex] = Number(event.target.value);
      valueLabel.textContent = `${consumptionData[hourIndex]} W`;
      updateChart();
      saveToSessionStorage();
    });

    sliderWrapper.appendChild(timeLabel);
    sliderWrapper.appendChild(slider);
    sliderWrapper.appendChild(valueLabel);
    slidersContainer.appendChild(sliderWrapper);
  }

  // Diagramm initialisieren
  const ctx = document.getElementById('consumptionChart').getContext('2d');
  const chartColor = 'rgba(255, 99, 132, 1)';
  const chartBackgroundColor = 'rgba(255, 99, 132, 0.2)';
  const consumptionChart = new Chart(ctx, {
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
          backgroundColor: chartBackgroundColor,
          borderColor: chartColor,
          borderWidth: 1,
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

  // Diagramm aktualisieren
  function updateChart() {
    consumptionChart.data.datasets[0].data = consumptionData;
    consumptionChart.update();
  }

  // Verbrauchsdaten im Session Storage speichern
  function saveToSessionStorage() {
    sessionStorage.setItem('consumptionData', JSON.stringify(consumptionData));
  }
});
