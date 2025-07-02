import { renderCountdown, renderParticipants } from './ui.js';
import { renderChart } from './chart.js';

async function loadData() {
    const response = await fetch(`../data/progress.json?t=${Date.now()}`);
    return await response.json();
}

loadData().then(data => {
    renderCountdown(data.endDate);
    renderParticipants(data.participants);
    renderChart(data.participants, data.endDate);
});
