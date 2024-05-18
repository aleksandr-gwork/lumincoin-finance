import config from "../../config/config.js";
import {CreateElement} from "../create-element-component.js";

export class Income {
    constructor() {

        this.searchElements(); // Поиск элементов
        this.popupMessage = 'Вы действительно хотите удалить категорию? Связанные доходы будут удалены навсегда.';
        this.popupId = 'income-popup';

        // Загрузка
        this.load().then();

    }

    async load() {
        this.incomeSection.append(
            CreateElement.PopupExpenseAndIncome(this.popupId, 'success-button', 'cancel-button', this.popupMessage, this.deleteCardRequest.bind(this))
        ); // Добавляем popup в контейнер

        await this.loadIncomes();
    }

    searchElements() {
        this.incomesWrapper = document.getElementById("incomes-wrapper"); // Контейнер для карточек доходов
        this.incomeSection = document.getElementById("income-section");

    } // Поиск элементов

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
                    CreateElement.CardElement(element.id, element.title, this.incomesWrapper, this.popupId) // Создание карточек
                });

                CreateElement.CardAddElement(this.incomesWrapper, '#/income-create'); // Добавление карточки добавления нового расхода

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