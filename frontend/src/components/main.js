import Chart from 'chart.js/auto'

export class Main {
    constructor() {
        this.incomeElement = document.getElementById('incomeChart');
        this.expenseElement = document.getElementById('expenseChart');

        this.addCharts();
    }

    addCharts() {
        let dataIncome = {
            labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
            datasets: [{
                label: ' - Доходы',
                data: [19, 12, 3, 5, 2, 3],
                borderWidth: 1
            }]
        };

        let dataExpense = {
            labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
            datasets: [{
                label: ' - Расходы',
                data: [10, 12, 20, 5, 20, 3],
                borderWidth: 1
            }]
        };

        const incomeOptions = {
            plugins: {
                title: {
                    display: true,
                    text: 'Доходы',
                    font: {
                        size: 28,
                    },
                    color: '#290661',
                    padding: {
                        bottom: 20,
                    }
                }
            }
        };
        const expenseOptions = {
            plugins: {
                title: {
                    display: true,
                    text: 'Расходы',
                    font: {
                        size: 28,
                    },
                    color: '#290661',
                    padding: {
                        bottom: 20,
                    }
                }
            }
        }

        new Chart(this.incomeElement, {
            type: 'pie',
            data: dataIncome,
            options: incomeOptions,
        });

        new Chart(this.expenseElement, {
            type: 'pie',
            data: dataExpense,
            options: expenseOptions,
        });
    }
}
