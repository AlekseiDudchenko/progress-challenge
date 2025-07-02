export function renderChart(participants, endDateStr) {
    const container = document.getElementById('chartContainer');
    container.innerHTML = '<canvas id="weightChart" width="400" height="200"></canvas>';
    const ctx = document.getElementById('weightChart').getContext('2d');

    const datasets = [];
    const labels = [];

    participants.forEach(p => {
        const weightDates = p.records.map(r => r.date);
        const weights = p.records.map(r => r.weight);
        datasets.push({
            label: p.name,
            data: weights,
            fill: false,
            tension: 0.3,
            borderColor: getColorForName(p.name)
        });

        if (labels.length < weightDates.length) {
            weightDates.forEach(d => {
                if (!labels.includes(d)) labels.push(d);
            });
        }

        // Estimated line
        const startDate = new Date(p.records[0].date);
        const endDate = new Date(endDateStr);
        const controlDates = generateControlDates(startDate, endDate);

        const totalMs = endDate - startDate;
        const estData = controlDates.map(d => {
            const ratio = (d - startDate) / totalMs;
            const estWeight = p.startWeight - (p.startWeight - p.targetWeight) * ratio;
            return { date: formatDate(d), weight: estWeight };
        });

        estData.forEach(({ date }) => {
            if (!labels.includes(date)) labels.push(date);
        });

        datasets.push({
            label: `${p.name} (Estimated)`,
            data: estData.map(d => d.weight),
            borderDash: [5, 5],
            borderColor: getColorForName(p.name, true),
            tension: 0,
            pointRadius: 3
        });
    });

    labels.sort();

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
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });
}

function getColorForName(name, isEstimated = false) {
    const colors = {
        'Aleksei': '#e74c3c',
        'Alfred': '#3498db',
    };
    const base = colors[name] || '#666';
    return isEstimated ? base + '80' : base; // прозрачнее для линии цели
}

function generateControlDates(startDate, endDate) {
    const dates = [];
    let date = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

    while (date <= endDate) {
        if (date >= startDate) dates.push(new Date(date));
        const mid = new Date(date.getFullYear(), date.getMonth(), 15);
        if (mid >= startDate && mid <= endDate) dates.push(mid);
        date.setMonth(date.getMonth() + 1);
    }

    dates.sort((a, b) => a - b);
    return dates;
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}