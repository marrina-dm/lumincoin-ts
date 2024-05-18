import {Chart, PieController, ArcElement, Legend} from "chart.js";

export class Dashboard {
    constructor() {
        Chart.register(PieController, ArcElement, Legend);
        new Chart(document.getElementById('income-chart'), {
            type: 'pie',
            data: {
                labels: [
                    'Red',
                    'Orange',
                    'Yellow',
                    'Green',
                    'Blue'
                ],
                datasets: [{
                    label: 'My First Dataset',
                    data: [300, 50, 100, 200, 30],
                    backgroundColor: [
                        'rgb(220, 53, 69)',
                        'rgb(253, 126, 20)',
                        'rgb(255, 193, 7)',
                        'rgb(32, 201, 151)',
                        'rgb(13, 110, 253)'
                    ],
                    hoverOffset: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        padding: 15
                    },
                    title: {
                        display: true,
                        text: 'Chart.js Pie Chart'
                    }
                }
            }
        });
        new Chart(document.getElementById('expense-chart'), {
            type: 'pie',
            data: {
                labels: [
                    'Red',
                    'Orange',
                    'Yellow',
                    'Green',
                    'Blue'
                ],
                datasets: [{
                    label: 'My First Dataset',
                    data: [300, 50, 100, 200, 30],
                    backgroundColor: [
                        'rgb(220, 53, 69)',
                        'rgb(253, 126, 20)',
                        'rgb(255, 193, 7)',
                        'rgb(32, 201, 151)',
                        'rgb(13, 110, 253)'
                    ],
                    hoverOffset: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }
}