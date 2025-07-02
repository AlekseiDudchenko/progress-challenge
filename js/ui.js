export function renderCountdown(endDateStr) {
    const endDate = new Date(endDateStr);
    const now = new Date();
    const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    document.getElementById('countdown').textContent = `Days remaining: ${daysLeft}`;
}

export function renderParticipants(participants) {
    const container = document.getElementById('participants');
    container.innerHTML = '';

    participants.forEach(p => {
        const latest = p.records[p.records.length - 1];
        const { done, remaining, percent } = calculateProgress(p.startWeight, latest.weight, p.targetWeight);

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
      <h2>${p.name}</h2>
      <p>Current weight: ${latest.weight} kg</p>
      <p>Target weight: ${p.targetWeight} kg</p>
      <p>Lost: ${done.toFixed(1)} kg</p>
      <p>Remaining: ${remaining.toFixed(1)} kg</p>
      <div class="progress-bar"><div class="progress-fill" style="width:${percent}%;"></div></div>
    `;
        container.appendChild(card);
    });
}

function calculateProgress(start, current, target) {
    const total = start - target;
    const done = start - current;
    const percent = total > 0 ? Math.min((done / total) * 100, 100) : 0;
    return { done, remaining: current - target, percent };
}
