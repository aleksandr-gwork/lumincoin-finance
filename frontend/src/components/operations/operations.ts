import config from "../../config/config";
import {operationsUtils} from "./operations-utils";
import {DateUtils} from "../utils/date-utils";

export class Operations {
    private deleteId: string;
    private operationsSection!: HTMLElement | null;
    private operationsWrapper!: HTMLElement | null;
    private createIncomeButton!: HTMLElement | null;
    private createExpenseButton!: HTMLElement | null;
    private radioOperations!: NodeListOf<HTMLInputElement> | null;
    private rangeDateFrom!: HTMLElement | null;
    private rangeDateTo!: HTMLElement | null;
    private popupMessage!: string;
    private popupId!: string;
    private operationsArray!: any[];
    private numOperations!: number;
    private interval!: string;


    constructor() {
        this.deleteId = '';
        // Загрузка
        this.load().then();
    }

    private searchElements(): void {
        this.operationsSection = document.getElementById("operations-section");
        this.operationsWrapper = document.getElementById("operations-wrapper");

        this.createIncomeButton = document.getElementById("income");
        if (this.createIncomeButton) {
            this.createIncomeButton.addEventListener('click', () => {
                operationsUtils.type = 'income';
            });
        }

        this.createExpenseButton = document.getElementById("expense");
        if (this.createExpenseButton) {
            this.createExpenseButton.addEventListener('click', () => {
                operationsUtils.type = 'expense';
            });
        }

        this.radioOperations = document.querySelectorAll('input[name="options"]');

        if (this.rangeDateFrom && this.rangeDateTo) {
            this.rangeDateFrom = document.getElementById('date-from');
            this.rangeDateTo = document.getElementById('date-to');
        }


        this.addEventsToRanges();

    } // Поиск элементов

    private addEventsToRanges(): void {
        if (this.rangeDateFrom && this.rangeDateTo) {
            this.rangeDateFrom.addEventListener('input', async () => {
                if (operationsUtils.currentFilter === 'interval') {
                    DateUtils.dateFrom = (this.rangeDateFrom as HTMLInputElement).value;
                    await this.loadOperations(operationsUtils.currentFilter, DateUtils.dateFrom, DateUtils.dateTo);
                }
            });
            this.rangeDateTo.addEventListener('input', async () => {
                if (operationsUtils.currentFilter === 'interval') {
                    DateUtils.dateTo = (this.rangeDateTo as HTMLInputElement).value;
                    await this.loadOperations(operationsUtils.currentFilter, DateUtils.dateFrom, DateUtils.dateTo);
                }
            });
        }

    }

    private createPopup(): void {
        this.popupMessage = 'Вы действительно хотите удалить операцию?';
        this.popupId = 'popup';

        if (this.operationsSection) {
            this.operationsSection.append(
                this.operationsPopup(this.popupId, 'success-button', 'cancel-button', this.popupMessage)
            ); // Добавляем popup в контейнер
        }

    }

    // createDate() {
    //     this.currentDate = new Date();
    //     this.currentDateTo = this.currentDate.getFullYear() + '-' + (this.currentDate.getMonth() + 1) + '-' + this.currentDate.getDate();
    //     this.currentDay = this.currentDate.getDate();
    //     this.currentMonth = this.currentDate.getMonth() + 1;
    //     this.currentYear = this.currentDate.getFullYear();
    //
    //     this.dateFrom = '';
    //     this.dateTo = '';
    // }

    private addFilterEvents(): void {
        if (this.radioOperations) {
            this.radioOperations.forEach((item: HTMLInputElement): void => {
                item.addEventListener('click', async (): Promise<void> => {
                    if (item.id === 'all') {
                        operationsUtils.currentFilter = 'all';
                        await this.loadOperations(item.id);
                    } else if (item.id === 'today') {
                        operationsUtils.currentFilter = 'today';
                        DateUtils.dateFrom = DateUtils.currentYear + '-' + DateUtils.currentMonth + '-' + DateUtils.currentDay;
                        DateUtils.dateTo = DateUtils.currentDateTo;
                        await this.loadOperations(item.id, DateUtils.dateFrom, DateUtils.dateTo);
                    } else if (item.id === 'week') {
                        operationsUtils.currentFilter = 'week';
                        DateUtils.dateFrom = DateUtils.currentYear + '-' + DateUtils.currentMonth + '-' + (DateUtils.currentDay - 6);
                        DateUtils.dateTo = DateUtils.currentDateTo;
                        await this.loadOperations(item.id, DateUtils.dateFrom, DateUtils.dateTo);
                    } else if (item.id === 'month') {
                        operationsUtils.currentFilter = 'month';
                        DateUtils.dateFrom = DateUtils.currentYear + '-' + (DateUtils.currentMonth - 1) + '-' + DateUtils.currentDay;
                        DateUtils.dateTo = DateUtils.currentDateTo;
                        await this.loadOperations(item.id, DateUtils.dateFrom, DateUtils.dateTo);
                    } else if (item.id === 'year') {
                        operationsUtils.currentFilter = 'year';
                        DateUtils.dateFrom = (DateUtils.currentYear - 1) + '-' + DateUtils.currentMonth + '-' + DateUtils.currentDay;
                        DateUtils.dateTo = DateUtils.currentDateTo;
                        await this.loadOperations(item.id, DateUtils.dateFrom, DateUtils.dateTo);
                    } else if (item.id === 'interval') {
                        operationsUtils.currentFilter = 'interval';
                        if (this.rangeDateFrom && this.rangeDateTo) {
                            DateUtils.dateFrom = (this.rangeDateFrom as HTMLInputElement).value;
                            DateUtils.dateTo = (this.rangeDateTo as HTMLInputElement).value;
                        }

                        await this.loadOperations(item.id, (this.rangeDateFrom as HTMLInputElement).value, (this.rangeDateTo as HTMLInputElement).value);
                    }
                })
            })
        }

    }

    async load() {

        this.searchElements(); // Поиск элементов

        this.createPopup(); // Создание popup

        // this.createDate(); // Создание дат
        DateUtils.createDate();

        this.addFilterEvents();

        await this.loadOperations(operationsUtils.currentFilter);

        if (this.radioOperations) {
            this.radioOperations.forEach((item: HTMLInputElement): void => {
                if (item.id === operationsUtils.currentFilter) {
                    item.checked = true;
                }
            })
        }

    }


    async loadOperations(period: string, dateFrom?: string, dateTo?: string): Promise<void> {
        if (this.operationsWrapper) {
            this.operationsWrapper.innerHTML = ''; // Очистка контейнера
        }
        this.operationsArray = []; // Очистка массива
        this.numOperations = 1;

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

                this.operationsArray.push(...await responseOperations.json()); // Добавление карточек доходов в массив

                // Создание карточек доходов через forEach в массиве this.operationsArray
                this.operationsArray.forEach(element => {
                    this.addRowTable(element.id, element.type, element.category, element.amount, element.date, element.comment);
                });

            } else {
                alert('Не удалось загрузить карточки доходов');
                window.location.href = '#/';
            }

        } catch (error) {
            alert('Ошибка - ' + error);
            console.log(error);
        }
    }

    private addRowTable(id: string, type: string, category: string, amount: string, date: string, comment: string = ''): void {

        const row: HTMLTableRowElement = document.createElement('tr');

        const numCell: HTMLTableCellElement = document.createElement('td');
        numCell.innerHTML = String(this.numOperations++);
        numCell.classList.add('fw-bold');

        const typeCell: HTMLTableCellElement = document.createElement('td');
        typeCell.innerHTML = type;

        if (type === 'income') {
            typeCell.classList.add('text-success');
            typeCell.innerHTML = 'Доход';
        } else if (type === 'expense') {
            typeCell.classList.add('text-danger');
            typeCell.innerHTML = 'Расход';
        }

        const categoryCell: HTMLTableCellElement = document.createElement('td');
        categoryCell.innerHTML = category;
        const amountCell: HTMLTableCellElement = document.createElement('td');
        amountCell.innerHTML = new Intl.NumberFormat('ru-RU').format(Number(amount)) + '$';
        const dateCell: HTMLTableCellElement = document.createElement('td');
        dateCell.innerHTML = date;
        const commentCell: HTMLTableCellElement = document.createElement('td');
        commentCell.innerHTML = comment;

        const buttonsCell: HTMLTableCellElement = document.createElement('td');
        buttonsCell.classList.add('d-flex', 'gap-2');

        const deleteButton: HTMLAnchorElement = document.createElement('a');
        deleteButton.classList.add('link-body-emphasis');
        deleteButton.href = 'javascript:void(0)';
        deleteButton.id = id;
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
        buttonsCell.appendChild(deleteButton);


        deleteButton.addEventListener('click', (): void => {
            this.deleteId = deleteButton.id;
            if (this.popupId) {
                const popupElement: HTMLElement | null = document.getElementById(this.popupId);
                if (popupElement) {
                    popupElement.classList.remove('d-none');
                }
            }
        });

        const editButton: HTMLAnchorElement = document.createElement('a');
        editButton.classList.add('link-body-emphasis');
        editButton.href = `#/operations-edit`;
        editButton.innerHTML = '<i class="bi bi-pencil"></i>';
        buttonsCell.appendChild(editButton);
        row.appendChild(buttonsCell);

        editButton.addEventListener('click', () => {
            operationsUtils.operationEdit(id, type, category, amount, date, comment);
            operationsUtils.type = type;
            operationsUtils.category = category;
        })

        row.append(numCell, typeCell, categoryCell, amountCell, dateCell, commentCell, buttonsCell);
        if (this.operationsWrapper) {
            this.operationsWrapper.appendChild(row);
        }
    }


    private operationsPopup(popupId: string, successId: string, cancelId: string, message: string): HTMLElement {

        const popup: HTMLDivElement | null = document.createElement('div');
        popup.classList.add('d-none', 'vh-100', 'vw-100', 'position-fixed', 'top-0', 'start-0', 'bg-opacity-50', 'bg-black', 'z-3');
        popup.id = popupId;

        const popupCard: HTMLDivElement = document.createElement('div');
        popupCard.classList.add('popup-card', 'card', 'position-fixed', 'top-50', 'start-50', 'translate-middle');
        popupCard.style.padding = '40px';

        const cardBody: HTMLDivElement = document.createElement('div');
        cardBody.classList.add('card-body', 'text-center');

        const h4: HTMLHeadingElement = document.createElement('h4');
        h4.classList.add('h4', 'mb-3');
        h4.innerText = message;

        const buttons: HTMLDivElement = document.createElement('div');
        buttons.classList.add('d-flex', 'gap-3', 'justify-content-center');

        const successButton: HTMLButtonElement = document.createElement('button');
        successButton.classList.add('btn', 'btn-success', 'px-3', 'py-2');
        successButton.innerText = 'Да, удалить';
        successButton.id = successId;
        successButton.type = 'button';

        successButton.addEventListener('click', async (): Promise<void> => {
            await this.deleteRowRequest(this.deleteId);
            popup.classList.add('d-none');
        });

        const cancelButton: HTMLButtonElement = document.createElement('button');
        cancelButton.classList.add('btn', 'btn-danger', 'px-3', 'py-2');
        cancelButton.innerText = 'Не удалять';
        cancelButton.id = cancelId;
        cancelButton.type = 'button';

        cancelButton.addEventListener('click', (): void => {
            popup.classList.add('d-none');
        });

        buttons.append(successButton, cancelButton);
        popupCard.append(cardBody);
        cardBody.append(h4, buttons);
        popup.append(popupCard);

        return popup;
    } // Метод создания попапа

    async deleteRowRequest(id: string): Promise<void> {
        const card: Response = await fetch(config.api + '/operations/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-auth-token': localStorage.getItem("accessToken") ?? '',
            }
        });

        if (card.ok) {
            await this.loadOperations(operationsUtils.currentFilter, DateUtils.dateFrom, DateUtils.dateTo);
        }
    }

}