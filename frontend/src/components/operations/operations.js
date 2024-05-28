import config from "../../config/config.js";
import {operationsUtils} from "./operations-utils.js";

export class Operations {

    constructor() {
        this.deleteId = '';
        // Загрузка
        this.load().then();
    }

    searchElements() {
        this.operationsSection = document.getElementById("operations-section");
        this.operationsWrapper = document.getElementById("operations-wrapper");

        this.createIncomeButton = document.getElementById("income");
        this.createIncomeButton.addEventListener('click', () => {
           operationsUtils.type = 'income';
        });

        this.createExpenseButton = document.getElementById("expense");
        this.createExpenseButton.addEventListener('click', () => {
            operationsUtils.type = 'expense';
        });

        this.radioOperations = document.querySelectorAll('input[name="options"]');

        this.rangeDateFrom = document.getElementById('date-from');
        this.rangeDateTo = document.getElementById('date-to');

        this.addEventsToRanges();

    } // Поиск элементов

    addEventsToRanges() {
        this.rangeDateFrom.addEventListener('input', async () => {
            if (operationsUtils.currentFilter === 'interval') {
                this.dateFrom = this.rangeDateFrom.value;
                await this.loadOperations(operationsUtils.currentFilter, this.dateFrom, this.dateTo);
            }
        });
        this.rangeDateTo.addEventListener('input', async () => {
            if (operationsUtils.currentFilter === 'interval') {
                this.dateTo = this.rangeDateTo.value;
                await this.loadOperations(operationsUtils.currentFilter, this.dateFrom, this.dateTo);
            }
        });
    }

    createPopup() {
        this.popupMessage = 'Вы действительно хотите удалить операцию?';
        this.popupId = 'popup';

        this.operationsSection.append(
            this.operationsPopup(this.popupId, 'success-button', 'cancel-button', this.popupMessage)
        ); // Добавляем popup в контейнер
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

    addFilterEvents() {
        this.radioOperations.forEach(item => {
            item.addEventListener('click', async () => {
                if (item.id === 'all') {
                    operationsUtils.currentFilter = 'all';
                    await this.loadOperations(item.id);
                } else if (item.id === 'today') {
                    operationsUtils.currentFilter = 'today';
                    this.dateFrom = this.currentYear + '-' + this.currentMonth + '-' + this.currentDay;
                    this.dateTo = this.currentDateTo;
                    await this.loadOperations(item.id, this.dateFrom, this.dateTo);
                } else if (item.id === 'week') {
                    operationsUtils.currentFilter = 'week';
                    this.dateFrom = this.currentYear + '-' + this.currentMonth + '-' + (this.currentDay - 6);
                    this.dateTo = this.currentDateTo;
                    await this.loadOperations(item.id, this.dateFrom, this.dateTo);
                } else if (item.id === 'month') {
                    operationsUtils.currentFilter = 'month';
                    this.dateFrom = this.currentYear + '-' + (this.currentMonth - 1) + '-' + this.currentDay;
                    this.dateTo = this.currentDateTo;
                    await this.loadOperations(item.id, this.dateFrom, this.dateTo);
                } else if (item.id === 'year') {
                    operationsUtils.currentFilter = 'year';
                    this.dateFrom = (this.currentYear - 1) + '-' + this.currentMonth + '-' + this.currentDay;
                    this.dateTo = this.currentDateTo;
                    await this.loadOperations(item.id, this.dateFrom, this.dateTo);
                } else if (item.id === 'interval') {
                    operationsUtils.currentFilter = 'interval';
                    this.dateFrom = this.rangeDateFrom.value;
                    this.dateTo = this.rangeDateTo.value;
                    await this.loadOperations(item.id, this.rangeDateFrom.value, this.rangeDateTo.value);
                }
            })
        })
    }

    async load() {

        this.searchElements(); // Поиск элементов

        this.createPopup(); // Создание popup

        this.createDate(); // Создание дат

        this.addFilterEvents();

        await this.loadOperations(operationsUtils.currentFilter);

        this.radioOperations.forEach(item => {
            if (item.id === operationsUtils.currentFilter) {
                item.checked = true;
            }
        })
    }


    async loadOperations(period, dateFrom, dateTo) {
        this.operationsWrapper.innerHTML = ''; // Очистка контейнера
        this.operationsArray = []; // Очистка массива
        this.numOperations = 1;

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
            alert('Ошибка' - error);
            console.log(error);
        }
    }

    addRowTable(id, type, category, amount, date, comment = '') {

        const row = document.createElement('tr');

        const numCell = document.createElement('td');
        numCell.innerHTML = this.numOperations++;
        numCell.classList.add('fw-bold');

        const typeCell = document.createElement('td');
        typeCell.innerHTML = type;

        if (type === 'income') {
            typeCell.classList.add('text-success');
            typeCell.innerHTML = 'Доход';
        } else if (type === 'expense') {
            typeCell.classList.add('text-danger');
            typeCell.innerHTML = 'Расход';
        }

        const categoryCell = document.createElement('td');
        categoryCell.innerHTML = category;
        const amountCell = document.createElement('td');
        amountCell.innerHTML = new Intl.NumberFormat('ru-RU').format(amount) + '$';
        const dateCell = document.createElement('td');
        dateCell.innerHTML = date;
        const commentCell = document.createElement('td');
        commentCell.innerHTML = comment;

        const buttonsCell = document.createElement('td');
        buttonsCell.classList.add('d-flex', 'gap-2');

        const deleteButton = document.createElement('a');
        deleteButton.classList.add('link-body-emphasis');
        deleteButton.href ='javascript:void(0)';
        deleteButton.id = id;
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
        buttonsCell.appendChild(deleteButton);


        deleteButton.addEventListener('click', () => {
            this.deleteId = deleteButton.id;
            document.getElementById(this.popupId).classList.remove('d-none');
        });

        const editButton = document.createElement('a');
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
        this.operationsWrapper.appendChild(row);

    }



    operationsPopup(popupId, successId, cancelId, message) {

        const popup = document.createElement('div');
        popup.classList.add('d-none', 'vh-100', 'vw-100', 'position-fixed', 'top-0', 'start-0', 'bg-opacity-50', 'bg-black', 'z-3');
        popup.id = popupId;

        const popupCard = document.createElement('div');
        popupCard.classList.add('popup-card', 'card', 'position-fixed', 'top-50', 'start-50', 'translate-middle');
        popupCard.style.padding = '40px';

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'text-center');

        const h4 = document.createElement('h4');
        h4.classList.add('h4', 'mb-3');
        h4.innerText = message;

        const buttons = document.createElement('div');
        buttons.classList.add('d-flex', 'gap-3', 'justify-content-center');

        const successButton = document.createElement('button');
        successButton.classList.add('btn', 'btn-success', 'px-3', 'py-2');
        successButton.innerText = 'Да, удалить';
        successButton.id = successId;
        successButton.type = 'button';

        successButton.addEventListener('click', async () => {
            await this.deleteRowRequest(this.deleteId);
            popup.classList.add('d-none');
        });

        const cancelButton = document.createElement('button');
        cancelButton.classList.add('btn', 'btn-danger', 'px-3', 'py-2');
        cancelButton.innerText = 'Не удалять';
        cancelButton.id = cancelId;
        cancelButton.type = 'button';

        cancelButton.addEventListener('click',  () => {
            popup.classList.add('d-none');
        });

        buttons.append(successButton, cancelButton);
        popupCard.append(cardBody);
        cardBody.append(h4, buttons);
        popup.append(popupCard);

        return popup;
    } // Метод создания попапа

    async deleteRowRequest(id) {
        const card = await fetch(config.api + '/operations/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-auth-token': localStorage.getItem("accessToken"),
            }
        });

        if (card.ok) {
            await this.loadOperations(operationsUtils.currentFilter, this.dateFrom, this.dateTo);
        }
    }

}