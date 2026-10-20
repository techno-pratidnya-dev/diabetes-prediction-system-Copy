/**
 * compare.js — Model Comparison Charts
 * Uses Chart.js to visualize actual ML model performance metrics.
 * All metrics are real results from the student's Colab experiment.
 */

// ============================================================================
// EXPERIMENTAL MODEL DATA (Exact metrics from Colab notebook)
// ============================================================================
const modelData = {
    labels: ['Logistic Regression', 'Decision Tree', 'KNN', 'Random Forest'],
    accuracy: [70.78, 68.18, 75.32, 76.62],
    recall: [50.00, 48.15, 61.11, 59.26]
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Ensure Chart.js is loaded from CDN or local script
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js is not loaded. Please include Chart.js in your HTML to view model charts.');
        return;
    }

    // Set global typography and styling defaults
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#4b5563'; // Neutral gray for labels

    // Render both charts
    initAccuracyChart();
    initComparisonChart();
});

// ============================================================================
// 1. ACCURACY BAR CHART (Horizontal)
// ============================================================================

/**
 * Renders a horizontal bar chart comparing the accuracy of each trained model.
 * Canvas ID: #accuracy-chart
 */
function initAccuracyChart() {
    const canvas = document.getElementById('accuracy-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Inline plugin to render accuracy percentage labels at the end of each bar
    const barDataLabelsPlugin = {
        id: 'accuracyBarLabels',
        afterDatasetsDraw(chart) {
            const { ctx } = chart;
            chart.data.datasets.forEach((dataset, datasetIdx) => {
                const meta = chart.getDatasetMeta(datasetIdx);
                meta.data.forEach((bar, index) => {
                    const value = dataset.data[index];
                    if (value !== undefined && value !== null) {
                        ctx.save();
                        ctx.font = "600 12px 'Inter', sans-serif";
                        ctx.fillStyle = '#1e293b';
                        ctx.textAlign = 'left';
                        ctx.textBaseline = 'middle';
                        // Position label slightly to the right of horizontal bar tip
                        ctx.fillText(`${value}%`, bar.x + 8, bar.y);
                        ctx.restore();
                    }
                });
            });
        }
    };

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: modelData.labels,
            datasets: [
                {
                    label: 'Accuracy (%)',
                    data: modelData.accuracy,
                    // Distinct blue and purple color palette for each model
                    backgroundColor: ['#1a73e8', '#64b5f6', '#7c4dff', '#1557b0'],
                    borderRadius: 6,
                    borderSkipped: false,
                    barPercentage: 0.65
                }
            ]
        },
        options: {
            indexAxis: 'y', // Makes the bar chart horizontal
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    right: 40 // Space for percentage text next to highest bar
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Model Accuracy Comparison',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    },
                    color: '#1f2937'
                },
                legend: {
                    display: false // Only one metric shown, title suffices
                },
                tooltip: {
                    backgroundColor: '#1f2937',
                    titleFont: { size: 13, weight: '600' },
                    bodyFont: { size: 12 },
                    padding: 10,
                    cornerRadius: 6,
                    callbacks: {
                        label: function (context) {
                            return ` Accuracy: ${context.parsed.x}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    min: 0,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Accuracy Percentage (%)',
                        font: { size: 12, weight: '500' }
                    },
                    ticks: {
                        stepSize: 20,
                        callback: function (val) {
                            return val + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        borderColor: 'transparent'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Machine Learning Models',
                        font: { size: 12, weight: '500' }
                    },
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: { weight: '600' }
                    }
                }
            }
        },
        plugins: [barDataLabelsPlugin]
    });
}

// ============================================================================
// 2. ACCURACY VS RECALL GROUPED BAR CHART (Vertical)
// ============================================================================

/**
 * Renders a vertical grouped bar chart comparing Accuracy vs Recall for all models.
 * Highlight: In healthcare diagnostics, Recall is critical to avoid false negatives.
 * Canvas ID: #comparison-chart
 */
function initComparisonChart() {
    const canvas = document.getElementById('comparison-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: modelData.labels,
            datasets: [
                {
                    label: 'Accuracy (%)',
                    data: modelData.accuracy,
                    backgroundColor: '#1a73e8', // Primary Blue
                    borderRadius: 6,
                    borderSkipped: false
                },
                {
                    label: 'Recall (%)',
                    data: modelData.recall,
                    backgroundColor: '#7c4dff', // Deep Purple
                    borderRadius: 6,
                    borderSkipped: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Accuracy vs Recall Comparison',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    },
                    color: '#1f2937'
                },
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 14,
                        boxHeight: 14,
                        font: {
                            size: 13,
                            weight: '500'
                        },
                        padding: 16
                    }
                },
                tooltip: {
                    backgroundColor: '#1f2937',
                    titleFont: { size: 13, weight: '600' },
                    bodyFont: { size: 12 },
                    padding: 10,
                    cornerRadius: 6,
                    callbacks: {
                        label: function (context) {
                            return ` ${context.dataset.label}: ${context.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Machine Learning Models',
                        font: { size: 12, weight: '500' }
                    },
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: { weight: '600' }
                    }
                },
                y: {
                    min: 0,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Percentage (%)',
                        font: { size: 12, weight: '500' }
                    },
                    ticks: {
                        stepSize: 20,
                        callback: function (val) {
                            return val + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        borderColor: 'transparent'
                    }
                }
            }
        }
    });
}
