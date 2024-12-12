'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const slidersContainer = document.getElementById('sliders');

  // PV-Daten aus Session Storage laden oder mit Standardwerten initialisieren
  const pvData = JSON.parse(sessionStorage.getItem('pvData')) || [
    0, 0, 0, 0, 0, 0, 50, 150, 300, 500, 700, 800, 850, 800, 700, 500, 300, 150,
    50, 0, 0, 0, 0, 0,
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
    valueLabel.textContent = `${pvData[hour]} W`;
    valueLabel.style.fontSize = '1em';
    valueLabel.style.color = '#fff';
    valueLabel.style.marginTop = '5px';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 5000; // Maximal 5000 W
    slider.value = pvData[hour];
    slider.dataset.hour = hour;

    // Event-Listener für Änderungen
    slider.addEventListener('input', event => {
      const hourIndex = event.target.dataset.hour;
      pvData[hourIndex] = Number(event.target.value);
      valueLabel.textContent = `${pvData[hourIndex]} W`;
      updateChart();
      saveToSessionStorage();
      triggerPVDataUpdate();
    });

    sliderWrapper.appendChild(timeLabel);
    sliderWrapper.appendChild(slider);
    sliderWrapper.appendChild(valueLabel);
    slidersContainer.appendChild(sliderWrapper);
  }

  // Diagramm initialisieren
  const ctx = document.getElementById('pvChart').getContext('2d');
  const chartColor = 'rgba(54, 162, 235, 1)';
  const chartBackgroundColor = 'rgba(54, 162, 235, 0.2)';
  const pvChart = new Chart(ctx, {
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
          borderColor: chartColor,
          backgroundColor: chartBackgroundColor,
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

  // Diagramm aktualisieren
  function updateChart() {
    pvChart.data.datasets[0].data = pvData;
    pvChart.update();
  }

  // PV-Daten im Session Storage speichern
  function saveToSessionStorage() {
    sessionStorage.setItem('pvData', JSON.stringify(pvData));
  }

  // Event auslösen, wenn PV-Daten geändert werden
  function triggerPVDataUpdate() {
    const event = new CustomEvent('pvDataUpdated', { detail: [...pvData] });
    window.dispatchEvent(event);
  }
});
