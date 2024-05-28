import {Chart} from 'chart.js/auto';
import config from "../config/config.js";
import {operationsUtils} from "./operations/operations-utils.js";

export class Main {
    constructor() {
        this.incomeElement = document.getElementById('incomeChart');
        this.expenseElement = document.getElementById('expenseChart');

        this.radioOperations = document.querySelectorAll('input[name="options"]');
        this.rangeDateFrom = document.getElementById('date-from');
        this.rangeDateTo = document.getElementById('date-to');

        this.addEventsToRanges();

        this.createDate();
        this.addFilterEvents();
        this.Charts().then();
        this.radioOperations.forEach(item => {
            if (item.id === operationsUtils.currentFilter) {
                item.checked = true;
            }
        })

    }

    createDate() {
        this.currentDate = new Date();
        this.currentDateTo = this.currentDate.getFullYear() + '-' + (this.currentDate.getMonth() + 1) + '-' + this.currentDate.getDate();
        this.currentDay = this.currentDate.getDate();
        this.currentMonth = this.currentDate.getMonth() + 1;
        this.currentYear = this.currentDate.getFullYear();

        this.dateFrom = '';
        this.dateTo = '';
    }

    async Charts(id, dateFrom, dateTo) {
        this.income = {
            labels: [],
            data: []
        };

        this.expense = {
            labels: [],
            data: []
        };
        await this.loadOperations(id, dateFrom, dateTo); // Загрузка операций
        this.loadChartsOptions(); // Настройка графиков
        this.loadChartsData(); // Заполнение графиков
        this.addCharts();
    }

    loadChartsData() {
        this.dataIncome = {
            labels: this.income.labels,
            datasets: [{
                label: ' - Доходы',
                data: this.income.data,
                borderWidth: 1
            }]
        };

        this.dataExpense = {
            labels: this.expense.labels,
            datasets: [{
                label: ' - Расходы',
                data: this.expense.data,
                borderWidth: 1
            }]
        };
    }
    loadChartsOptions() {
        this.incomeOptions = {
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
        this.expenseOptions = {
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
    }


    addCharts() {
        this.chartIncome = new Chart(this.incomeElement, {
            type: 'pie',
            data: this.dataIncome,
            options: this.incomeOptions,
        });

        this.chartExpense = new Chart(this.expenseElement, {
            type: 'pie',
            data: this.dataExpense,
            options: this.expenseOptions,
        });


    }

    destroyCharts() {
        this.chartIncome.destroy();
        this.chartExpense.destroy();
    }

    async loadOperations(period, dateFrom, dateTo) {
        this.operationsArray = []; // Очистка массива
        this.expense.data = []; // Очистка массива
        this.income.data = []; // Очистка массива
        this.income.labels = []; // Очистка массива
        this.expense.labels = []; // Очистка массива

        if (dateFrom && dateTo) {
            this.interval = '&dateFrom=' + dateFrom + '&dateTo=' + dateTo;
        } else {
            this.interval = '';
        }

        try {
            let responseOperations = await fetch(config.api + '/operations' + '?period=' + period + this.interval, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-auth-token': localStorage.getItem("accessToken"),
                }
            }) // Получение title и id карточек доходов

            if (responseOperations.ok) { // Если запрос выполнен успешно

                this.operationsArray.push(...await responseOperations.json());

                this.pushData(this.operationsArray);

            } else {
                alert('Не удалось загрузить карточки доходов');
                window.location.href = '#/';
            }

        } catch (error) {
            alert('Ошибка' - error);
            console.log(error);
        }
    }

    pushData(array) {
        array.forEach(item => {
            if (item.type === 'income') {
                if (this.income.labels.includes(item.category)) {
                    let index = this.income.labels.indexOf(item.category);
                    this.income.data[index] += item.amount;
                } else {
                    this.income.labels.push(item.category);
                    this.income.data.push(item.amount);
                }
            } else if (item.type === 'expense') {
                if (this.expense.labels.includes(item.category)) {
                    let index = this.expense.labels.indexOf(item.category);
                    this.expense.data[index] += item.amount;
                } else {
                    this.expense.labels.push(item.category);
                    this.expense.data.push(item.amount);
                }
            }
        });
    }

    addFilterEvents() {
        this.radioOperations.forEach(item => {
            item.addEventListener('click', async () => {
                if (item.id === 'all') {
                    operationsUtils.currentFilter = 'all';
                    this.destroyCharts();
                    await this.Charts(item.id);
                } else if (item.id === 'today') {
                    operationsUtils.currentFilter = 'today';
                    this.dateFrom = this.currentYear + '-' + this.currentMonth + '-' + this.currentDay;
                    this.dateTo = this.currentDateTo;
                    this.destroyCharts();
                    await this.Charts(item.id, this.dateFrom, this.dateTo);
                } else if (item.id === 'week') {
                    operationsUtils.currentFilter = 'week';
                    this.dateFrom = this.currentYear + '-' + this.currentMonth + '-' + (this.currentDay - 6);
                    this.dateTo = this.currentDateTo;
                    this.destroyCharts();
                    await this.Charts(item.id, this.dateFrom, this.dateTo);
                } else if (item.id === 'month') {
                    operationsUtils.currentFilter = 'month';
                    this.dateFrom = this.currentYear + '-' + (this.currentMonth - 1) + '-' + this.currentDay;
                    this.dateTo = this.currentDateTo;
                    this.destroyCharts();
                    await this.Charts(item.id, this.dateFrom, this.dateTo);
                } else if (item.id === 'year') {
                    operationsUtils.currentFilter = 'year';
                    this.dateFrom = (this.currentYear - 1) + '-' + this.currentMonth + '-' + this.currentDay;
                    this.dateTo = this.currentDateTo;
                    this.destroyCharts();
                    await this.Charts(item.id, this.dateFrom, this.dateTo);
                } else if (item.id === 'interval') {
                    operationsUtils.currentFilter = 'interval';
                    this.dateFrom = this.rangeDateFrom.value;
                    this.dateTo = this.rangeDateTo.value;
                    this.destroyCharts();
                    await this.Charts(item.id, this.rangeDateFrom.value, this.rangeDateTo.value);
                }
            })
        })
    }

    addEventsToRanges() {
        this.rangeDateFrom.addEventListener('input', async () => {
            if (operationsUtils.currentFilter === 'interval') {
                this.dateFrom = this.rangeDateFrom.value;
                this.destroyCharts();
                await this.Charts(operationsUtils.currentFilter, this.dateFrom, this.dateTo);
            }
        });
        this.rangeDateTo.addEventListener('input', async () => {
            if (operationsUtils.currentFilter === 'interval') {
                this.dateTo = this.rangeDateTo.value;
                this.destroyCharts();
                await this.Charts(operationsUtils.currentFilter, this.dateFrom, this.dateTo);
            }
        });
    }
}
