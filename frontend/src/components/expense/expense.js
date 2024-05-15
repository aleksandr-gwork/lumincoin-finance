import config from "../../config/config.js";
import {CreateElement} from "../create-element-component.js";


export class Expense {
    constructor() {

        this.searchElements(); // Поиск элементов
        this.popupMessage = 'Вы действительно хотите удалить категорию?';

        // Загрузка
        this.load().then();

    }

    async load() {
        this.expenseSection.append(
            CreateElement.PopupExpenseAndIncome('expense-popup','success-button', 'cancel-button', this.popupMessage)
        ); // Добавляем popup в контейнер

        await this.loadExpenses();
    }

    searchElements() {
        this.expensesWrapper = document.getElementById("expenses-wrapper"); // Контейнер для карточек расходов
        this.expenseSection = document.getElementById("expense-section");

    } // Поиск элементов

    // Создание карточки расхода
    expenseCardElement(id, title) {
        this.expensePopup = document.getElementById("expense-popup"); // Попап
        this.successDeleteId = '';

        const card = document.createElement('div');
        card.classList.add('col-sm-4', 'col-lg-4', 'col-md-6');
        card.id = `card-${id}`;

        const cardElement = document.createElement('div');
        cardElement.classList.add('card');

        const cardBody = document.createElement('div');
        cardBody.classList.add('container', 'card-body');

        const titleElement = document.createElement('h5');
        titleElement.classList.add('card-title', 'card-title-styles', 'h3', 'mb-3', 'text-truncate');
        titleElement.textContent = title;

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('row', 'gap-2', 'px-2');

        const editButton = document.createElement('a');
        editButton.classList.add('btn', 'btn-primary', 'col-xl-6', 'text-truncate');
        editButton.href = `#/expense-edit?id=${id}&title=${title}`;
        editButton.textContent = 'Редактировать';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger', 'col-xl-4', 'text-truncate', 'delete-button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Удалить';
        deleteButton.id = `${id}`;

        deleteButton.addEventListener('click', (e) => {
            this.successDeleteId = e.target.id;
        });

        deleteButton.addEventListener('click', () => {
            this.expensePopup.classList.remove('d-none');
        });

        buttonContainer.append(editButton, deleteButton);
        cardBody.append(titleElement, buttonContainer);

        cardElement.append(cardBody);
        card.append(cardElement);

        this.expensesWrapper.appendChild(card);
    }

    // Создание карточки добавления нового расхода
    expenseCardAddElement() {
        const card = document.createElement('div');
        card.classList.add('col-sm-4', 'col-lg-4', 'col-md-6');

        const cardElement = document.createElement('div');
        cardElement.classList.add('card', 'h-100');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const link = document.createElement('a');
        link.href = '#/expense-create';
        link.classList.add('d-flex', 'align-items-center', 'justify-content-center', 'h-100');

        const icon = document.createElement('i');
        icon.classList.add('bi', 'bi-plus', 'fs-2', 'text-secondary');

        link.append(icon);
        cardBody.append(link);
        cardElement.append(cardBody);
        card.append(cardElement);

        this.expensesWrapper.appendChild(card);
    }



    // createPopup(popupId, successId, cancelId) {
    //
    //     const popup = document.createElement('div');
    //     popup.classList.add('d-none', 'vh-100', 'vw-100', 'position-fixed', 'top-0', 'start-0', 'bg-opacity-50', 'bg-black', 'z-3');
    //     popup.id = popupId;
    //
    //     const popupCard = document.createElement('div');
    //     popupCard.classList.add('popup-card', 'card', 'position-fixed', 'top-50', 'start-50', 'translate-middle');
    //     popupCard.style.padding = '40px';
    //
    //     const cardBody = document.createElement('div');
    //     cardBody.classList.add('card-body', 'text-center');
    //
    //     const h4 = document.createElement('h4');
    //     h4.classList.add('h4', 'mb-3');
    //     h4.innerText = 'Вы действительно хотите удалить категорию?';
    //
    //     const buttons = document.createElement('div');
    //     buttons.classList.add('d-flex', 'gap-3', 'justify-content-center');
    //
    //     const successButton = document.createElement('button');
    //     successButton.classList.add('btn', 'btn-success', 'px-3', 'py-2');
    //     successButton.innerText = 'Да, удалить';
    //     successButton.id = successId;
    //     successButton.type = 'button';
    //
    //     successButton.addEventListener('click', async () => {
    //         await this.deleteCardRequest(this.successDeleteId);
    //         popup.classList.add('d-none');
    //     });
    //
    //     const cancelButton = document.createElement('button');
    //     cancelButton.classList.add('btn', 'btn-danger', 'px-3', 'py-2');
    //     cancelButton.innerText = 'Не удалять';
    //     cancelButton.id = cancelId;
    //     cancelButton.type = 'button';
    //
    //     cancelButton.addEventListener('click', () => {
    //         popup.classList.add('d-none');
    //     });
    //
    //     buttons.append(successButton, cancelButton);
    //     popupCard.append(cardBody);
    //     cardBody.append(h4, buttons);
    //     popup.append(popupCard);
    //
    //     return popup;
    // } // Метод создания попапа

    async loadExpenses() {
        this.expensesWrapper.innerHTML = ''; // Очистка контейнера расходов
        this.expenses = []; // Очистка массива расходов

        // Запрос на получение карточек расходов
        try {
            let responseCategories = await fetch(config.api + '/categories/expense', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-auth-token': localStorage.getItem("accessToken"),
                }
            }) // Получение title и id карточек расходов

            if (responseCategories.ok) { // Если запрос выполнен успешно

                this.expenses.push(...await responseCategories.json()); // Добавление карточек расходов в массив

                // Создание карточек расходов через forEach в массиве this.expenses
                this.expenses.forEach(element => {
                    this.expenseCardElement(element.id, element.title);
                });

                this.expenseCardAddElement(); // Добавление карточки добавления нового расхода
                // await this.addDeleteEvents(); // Добавление событий удаления карточки
            } else {
                alert('Не удалось загрузить карточки расходов');
                window.location.href = '#/';
            }

        } catch (error) {
            alert('Не удалось загрузить карточки расходов' - error);
            console.log(error);
        }
    }

    // Запрос на удаление карточки по id
    async deleteCardRequest(id) {
        const card = await fetch(config.api + '/categories/expense/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-auth-token': localStorage.getItem("accessToken"),
            }
        });

        if (card.ok) {
            await this.loadExpenses();
        }
    }
}