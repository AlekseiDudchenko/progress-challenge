async function loadData() {
  const response = await fetch(`data/progress.json?t=${Date.now()}`); // disables caching
  const data = await response.json();
  return data;
}

function calculateProgress(start, current, target) {
  const total = start - target;
  const done = start - current;
  const percent = total > 0 ? Math.min((done / total) * 100, 100) : 0;
  return { done, remaining: current - target, percent };
}

function renderCountdown(endDateStr) {
  const endDate = new Date(endDateStr);
  const now = new Date();
  const diff = endDate - now;
  const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
  document.getElementById('endDate').textContent = `End date: ${endDateStr}`;
  document.getElementById('countdown').textContent = `Days remaining: ${daysLeft}`;
}

function renderParticipants(participants) {
  const container = document.getElementById('participants');
  container.innerHTML = '';

  participants.forEach(p => {
    const latest = p.records[p.records.length - 1];
    const { done, remaining, percent } = calculateProgress(p.startWeight, latest.weight, p.targetWeight);

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h2>${p.name}</h2>
      <p>Start weight: ${p.startWeight} kg</p>
      <p>Current weight: ${latest.weight} kg</p>
      <p>Target weight: ${p.targetWeight} kg</p>
      <p>Lost: ${done.toFixed(1)} kg</p>
      <p>Remaining: ${remaining.toFixed(1)} kg</p>
      <div class="progress-bar"><div class="progress-fill" style="width:${percent}%;"></div></div>
    `;
    container.appendChild(card);
  });
}

function renderChart(participants) {
  const ctx = document.getElementById('weightChart').getContext('2d');
  const labels = participants[0].records.map(r => r.date);

  const datasets = participants.map(p => ({
    label: p.name,
    data: p.records.map(r => r.weight),
    fill: false,
    tension: 0.3
  }));

  new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Weight Progress Over Time'
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Weight (kg)'
          }
        }
      }
    }
  });
}

loadData().then(data => {
  renderCountdown(data.endDate);
  renderParticipants(data.participants);
  renderChart(data.participants);
});
