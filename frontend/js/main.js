const incomeElement = document.getElementById('incomeChart');
const expenseElement = document.getElementById('expenseChart');

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

new Chart(incomeElement, {
    type: 'pie',
    data: dataIncome,
    options: incomeOptions,
});

new Chart(expenseElement, {
    type: 'pie',
    data: dataExpense,
    options: expenseOptions,
});