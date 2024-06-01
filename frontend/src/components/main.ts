import {Chart} from 'chart.js/auto';
import config from "../config/config";
import {operationsUtils} from "./operations/operations-utils";
import {DateUtils} from "./utils/date-utils";
import {ChartsOperationsType} from "../types/charts-operations.type";
import {ChartsLoadDataType, ChartsOptionsType} from "../types/charts.type";
import {PushDataType} from "../types/push-data.type";

export class Main {
    readonly incomeElement: HTMLElement | null;
    readonly expenseElement: HTMLElement | null;
    private radioOperations: NodeListOf<HTMLInputElement>;
    readonly rangeDateFrom: HTMLElement | null;
    readonly rangeDateTo: HTMLElement | null;
    private income: ChartsOperationsType | undefined;
    private expense: ChartsOperationsType | undefined;
    private dataIncome: ChartsLoadDataType | undefined;
    private dataExpense: ChartsLoadDataType | undefined;
    private incomeOptions: ChartsOptionsType | undefined;
    private expenseOptions: ChartsOptionsType | undefined;

    private chartIncome: Chart<'pie', number[], string> | undefined;
    private chartExpense: Chart<'pie', number[], string> | undefined;

    private operationsArray: Array<PushDataType>;
    private interval: string;
    private dateFrom: string | undefined;
    private dateTo: string | undefined;

    constructor() {
        this.interval = '';
        this.operationsArray = [];

        this.income = {
            labels: [],
            data: []
        };

        this.expense = {
            labels: [],
            data: []
        };


        this.incomeElement = document.getElementById('incomeChart');
        this.expenseElement = document.getElementById('expenseChart');

        this.radioOperations = document.querySelectorAll('input[name="options"]');
        this.rangeDateFrom = document.getElementById('date-from');
        this.rangeDateTo = document.getElementById('date-to');

        this.addEventsToRanges();

        DateUtils.createDate();
        this.addFilterEvents();
        this.radioOperations.forEach((item: HTMLInputElement) => {
            if (item.id === operationsUtils.currentFilter) {
                item.checked = true;
            }
        })
    }

    async Charts(id: string, dateFrom?: string, dateTo?: string): Promise<void> {
        this.income = {
            labels: [],
            data: []
        };

        this.expense = {
            labels: [],
            data: []
        };
        await this.loadOperations(id, dateFrom ? dateFrom : '', dateTo ? dateTo : ''); // Загрузка операций
        this.loadChartsOptions(); // Настройка графиков
        this.loadChartsData(); // Заполнение графиков
        this.addCharts();
    }

    private loadChartsData(): void {
        this.dataIncome = {
            labels: (this.income as ChartsOperationsType).labels,
            datasets: [{
                label: ' - Доходы',
                data: (this.income as ChartsOperationsType).data,
                borderWidth: 1
            }]
        };

        this.dataExpense = {
            labels: (this.expense as ChartsOperationsType).labels,
            datasets: [{
                label: ' - Расходы',
                data: (this.expense as ChartsOperationsType).data,
                borderWidth: 1
            }]
        };
    }

    private loadChartsOptions(): void {
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

    private addCharts(): void {
        const incomeCanvasElement: HTMLCanvasElement = this.incomeElement as HTMLCanvasElement;
        const expenseCanvasElement: HTMLCanvasElement = this.expenseElement as HTMLCanvasElement;

        if (this.dataIncome && this.dataExpense) {
            this.chartIncome = new Chart(incomeCanvasElement, {
                type: 'pie',
                data: this.dataIncome,
                options: this.incomeOptions,
            });

            this.chartExpense = new Chart(expenseCanvasElement, {
                type: 'pie',
                data: this.dataExpense,
                options: this.expenseOptions,
            });
        }
    }

    private destroyCharts(): void {
        if (this.chartIncome) {
            this.chartIncome.destroy();
        }
        if (this.chartExpense) {
            this.chartExpense.destroy();
        }
    }

    private async loadOperations(period: string, dateFrom: string, dateTo: string): Promise<void> {
        this.operationsArray = []; // Очистка массива
        if (this.expense) {
            this.expense.data = [];
            this.expense.labels = [];
        }

        if (this.income) {
            this.income.data = [];
            this.income.labels = [];
        }

        if (dateFrom && dateTo) {
            this.interval = '&dateFrom=' + dateFrom + '&dateTo=' + dateTo;
        } else {
            this.interval = '';
        }

        try {
            let responseOperations: Response = await fetch(config.api + '/operations' + '?period=' + period + this.interval, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-auth-token': localStorage.getItem("accessToken") ?? '',
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
            alert('Ошибка -' + error);
            console.log(error);
        }
    }

    private pushData(array: Array<PushDataType>): void {
        array.forEach((item: PushDataType) => {
            if (item.type === 'income') {
                if (this.income && this.income.labels.includes(item.category)) {
                    let index: number = this.income!.labels.indexOf(item.category);
                    this.income!.data[index] += item.amount;
                } else {
                    this.income!.labels.push(item.category);
                    this.income!.data.push(item.amount);
                }
            } else if (item.type === 'expense') {
                if (this.expense && this.expense.labels.includes(item.category)) {
                    let index: number = this.expense!.labels.indexOf(item.category);
                    this.expense!.data[index] += item.amount;
                } else {
                    this.expense!.labels.push(item.category);
                    this.expense!.data.push(item.amount);
                }
            }
        });
    }

    private addFilterEvents(): void {
        this.radioOperations.forEach(item => {
            item.addEventListener('click', async (): Promise<void> => {
                if (item.id === 'all') {
                    operationsUtils.currentFilter = 'all';
                    this.destroyCharts();
                    await this.Charts(item.id);
                } else if (item.id === 'today') {
                    operationsUtils.currentFilter = 'today';
                    this.dateFrom = DateUtils.currentYear + '-' + DateUtils.currentMonth + '-' + DateUtils.currentDay;
                    this.dateTo = DateUtils.currentDateTo;
                    this.destroyCharts();
                    await this.Charts(item.id, this.dateFrom, this.dateTo);
                } else if (item.id === 'week') {
                    operationsUtils.currentFilter = 'week';
                    this.dateFrom = DateUtils.currentYear + '-' + DateUtils.currentMonth + '-' + (DateUtils.currentDay - 6);
                    this.dateTo = DateUtils.currentDateTo;
                    this.destroyCharts();
                    await this.Charts(item.id, this.dateFrom, this.dateTo);
                } else if (item.id === 'month') {
                    operationsUtils.currentFilter = 'month';
                    this.dateFrom = DateUtils.currentYear + '-' + (DateUtils.currentMonth - 1) + '-' + DateUtils.currentDay;
                    this.dateTo = DateUtils.currentDateTo;
                    this.destroyCharts();
                    await this.Charts(item.id, this.dateFrom, this.dateTo);
                } else if (item.id === 'year') {
                    operationsUtils.currentFilter = 'year';
                    this.dateFrom = (DateUtils.currentYear - 1) + '-' + DateUtils.currentMonth + '-' + DateUtils.currentDay;
                    this.dateTo = DateUtils.currentDateTo;
                    this.destroyCharts();
                    await this.Charts(item.id, this.dateFrom, this.dateTo);
                } else if (item.id === 'interval') {
                    operationsUtils.currentFilter = 'interval';
                    if (this.rangeDateFrom) {
                        this.dateFrom = (this.rangeDateFrom as HTMLInputElement).value;
                    }
                    if (this.rangeDateTo) {
                        this.dateTo = (this.rangeDateTo as HTMLInputElement).value;
                    }
                    this.destroyCharts();
                    if (this.rangeDateFrom && this.rangeDateTo) {
                        await this.Charts(item.id, (this.rangeDateFrom as HTMLInputElement).value, (this.rangeDateTo as HTMLInputElement).value);
                    }
                }
            })
        })
    }

    private addEventsToRanges(): void {
        if (this.rangeDateFrom) {
            this.rangeDateFrom.addEventListener('input', async (): Promise<void> => {
                if (operationsUtils.currentFilter === 'interval' && (this.rangeDateFrom as HTMLInputElement)?.value) {
                    this.dateFrom = (this.rangeDateFrom as HTMLInputElement).value;
                    this.destroyCharts();
                    await this.Charts(operationsUtils.currentFilter, this.dateFrom, this.dateTo);
                }
            });
        }

        if (this.rangeDateTo) {
            this.rangeDateTo.addEventListener('input', async (): Promise<void> => {
                if (operationsUtils.currentFilter === 'interval' && (this.rangeDateTo as HTMLInputElement)?.value) {
                    this.dateTo = (this.rangeDateTo as HTMLInputElement).value;
                    this.destroyCharts();
                    await this.Charts(operationsUtils.currentFilter, this.dateFrom, this.dateTo);
                }
            });
        }
    }
}
