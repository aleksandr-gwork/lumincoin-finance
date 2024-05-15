import config from "../../config/config.js";
import {CreateElement} from "../create-element-component.js";

export class Income {
    constructor() {

        this.searchElements(); // Поиск элементов
        this.popupMessage = 'Вы действительно хотите удалить категорию? Связанные доходы будут удалены навсегда.';

        // Загрузка
        this.load().then();

    }

    async load() {
        this.incomeSection.append(
            CreateElement.PopupExpenseAndIncome('expense-popup','success-button', 'cancel-button', this.popupMessage)
        ); // Добавляем popup в контейнер

        await this.loadIncomes();
    }

    searchElements() {
        this.incomesWrapper = document.getElementById("incomes-wrapper"); // Контейнер для карточек доходов
        this.incomeSection = document.getElementById("income-section");

    } // Поиск элементов

    // Создание карточки дохода
    incomeCardElement(id, title) {
        this.incomePopup = document.getElementById("income-popup"); // Попап
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
        editButton.href = `#/income-edit?id=${id}&title=${title}`;
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
            this.incomePopup.classList.remove('d-none');
        });

        buttonContainer.append(editButton, deleteButton);
        cardBody.append(titleElement, buttonContainer);

        cardElement.append(cardBody);
        card.append(cardElement);

        this.incomesWrapper.appendChild(card);
    }

    // Создание карточки добавления нового дохода
    incomeCardAddElement() {
        const card = document.createElement('div');
        card.classList.add('col-sm-4', 'col-lg-4', 'col-md-6');

        const cardElement = document.createElement('div');
        cardElement.classList.add('card', 'h-100');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const link = document.createElement('a');
        link.href = '#/income-create';
        link.classList.add('d-flex', 'align-items-center', 'justify-content-center', 'h-100');

        const icon = document.createElement('i');
        icon.classList.add('bi', 'bi-plus', 'fs-2', 'text-secondary');

        link.append(icon);
        cardBody.append(link);
        cardElement.append(cardBody);
        card.append(cardElement);

        this.incomesWrapper.appendChild(card);
    }

    async loadIncomes() {
        this.incomesWrapper.innerHTML = ''; // Очистка контейнера доходов
        this.incomes = []; // Очистка массива доходов

        // Запрос на получение карточек доходов
        try {
            let responseCategories = await fetch(config.api + '/categories/income', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-auth-token': localStorage.getItem("accessToken"),
                }
            }) // Получение title и id карточек доходов

            if (responseCategories.ok) { // Если запрос выполнен успешно

                this.incomes.push(...await responseCategories.json()); // Добавление карточек доходов в массив

                // Создание карточек доходов через forEach в массиве this.incomes
                this.incomes.forEach(element => {
                    this.incomeCardElement(element.id, element.title);
                });

                this.incomeCardAddElement(); // Добавление карточки добавления нового дохода
                // await this.addDeleteEvents(); // Добавление событий удаления карточки
            } else {
                alert('Не удалось загрузить карточки доходов');
                window.location.href = '#/';
            }

        } catch (error) {
            alert('Не удалось загрузить карточки доходов' - error);
            console.log(error);
        }
    }

    // Запрос на удаление карточки по id
    async deleteCardRequest(id) {
        const card = await fetch(config.api + '/categories/income/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-auth-token': localStorage.getItem("accessToken"),
            }
        });

        if (card.ok) {
            await this.loadIncomes();
        }
    }
}