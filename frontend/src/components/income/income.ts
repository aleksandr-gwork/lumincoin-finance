import config from "../../config/config";
import {CreateElement} from "../utils/create-element-component";

export class Income {
    readonly popupMessage: string;
    readonly popupId: string;
    readonly incomeSection: HTMLElement | null;
    readonly incomesWrapper: HTMLElement | null;
    private incomes: Array<{id: string, title: string}> = [];

    constructor() {
        this.popupMessage = 'Вы действительно хотите удалить категорию? Связанные доходы будут удалены навсегда.';
        this.popupId = 'income-popup';

        this.incomesWrapper = document.getElementById("incomes-wrapper"); // Контейнер для карточек доходов
        this.incomeSection = document.getElementById("income-section");

        // Загрузка
        this.load().then();

    }

    private async load(): Promise<void> {
        if (this.incomeSection) this.incomeSection.append(
            CreateElement.PopupExpenseAndIncome(this.popupId, 'success-button', 'cancel-button', this.popupMessage, this.deleteCardRequest.bind(this))
        ); // Добавляем popup в контейнер


        await this.loadIncomes();
    }

    private async loadIncomes(): Promise<void> {
        if (this.incomesWrapper) {
            this.incomesWrapper.innerHTML = ''; // Очистка контейнера доходов
        }
        this.incomes = []; // Очистка массива доходов

        // Запрос на получение карточек доходов
        try {
            let responseCategories: Response = await fetch(config.api + '/categories/income', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-auth-token': localStorage.getItem("accessToken") ?? "",
                }
            }) // Получение title и id карточек доходов

            if (responseCategories.ok) { // Если запрос выполнен успешно

                this.incomes.push(...await responseCategories.json()); // Добавление карточек доходов в массив

                console.log(this.incomes);
                // Создание карточек доходов через forEach в массиве this.incomes
                this.incomes.forEach((element) => {
                    CreateElement.CardElement('income', element.id, element.title, (this.incomesWrapper as HTMLElement), this.popupId) // Создание карточек
                });

                CreateElement.CardAddElement((this.incomesWrapper as HTMLElement), '#/income-create'); // Добавление карточки добавления нового расхода

            } else {
                alert('Не удалось загрузить карточки доходов');
                window.location.href = '#/';
            }

        } catch (error) {
            alert('Не удалось загрузить карточки доходов - ' + error);
            console.log(error);
        }
    }

    // Запрос на удаление карточки по id
    private async deleteCardRequest(id: string): Promise<void> {
        const card: Response = await fetch(config.api + '/categories/income/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-auth-token': localStorage.getItem("accessToken") ?? "",
            }
        });

        if (card.ok) {
            await this.loadIncomes();
        }
    }
}