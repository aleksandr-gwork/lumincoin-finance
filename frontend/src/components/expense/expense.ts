import config from "../../config/config";
import {CreateElement} from "../create-element-component";

export class Expense {
    readonly popupMessage: string;
    readonly popupId: string;
    private expenseSection!: HTMLElement | null;
    private expensesWrapper!: HTMLElement | null;
    private expenses!: any[];

    constructor() {

        this.searchElements(); // Поиск элементов
        this.popupMessage = 'Вы действительно хотите удалить категорию?';
        this.popupId = 'expense-popup';

        // Загрузка
        this.load().then();

    }

    private async load(): Promise<void> {
        if (this.expenseSection) {
            this.expenseSection.append(
                CreateElement.PopupExpenseAndIncome(this.popupId, 'success-button', 'cancel-button', this.popupMessage, this.deleteCardRequest.bind(this))
            ); // Добавляем popup в контейнер
        }
        await this.loadExpenses();
    }

    private searchElements(): void {
        this.expensesWrapper = document.getElementById("expenses-wrapper"); // Контейнер для карточек расходов
        this.expenseSection = document.getElementById("expense-section");

    } // Поиск элементов

    async loadExpenses(): Promise<void> {
        if (this.expensesWrapper) {
            this.expensesWrapper.innerHTML = ''; // Очистка контейнера расходов
        }
        this.expenses = []; // Очистка массива расходов

        // Запрос на получение карточек расходов
        try {
            let responseCategories: Response = await fetch(config.api + '/categories/expense', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-auth-token': localStorage.getItem("accessToken") ?? "",
                }
            }) // Получение title и id карточек расходов

            if (responseCategories.ok) { // Если запрос выполнен успешно

                this.expenses.push(...await responseCategories.json()); // Добавление карточек расходов в массив

                // Создание карточек расходов через forEach в массиве this.expenses
                this.expenses.forEach(element => {
                    CreateElement.CardElement('expense', element.id, element.title, (this.expensesWrapper as HTMLElement), this.popupId) // Создание карточек
                });

                CreateElement.CardAddElement((this.expensesWrapper as HTMLElement), '#/expense-create'); // Добавление карточки добавления нового расхода

            } else {
                alert('Не удалось загрузить карточки расходов');
                window.location.href = '#/';
            }

        } catch (error) {
            alert('Не удалось загрузить карточки расходов - ' + error);
            console.log(error);
        }
    }

    // Запрос на удаление карточки по id
    private async deleteCardRequest(id: string): Promise<void> {
        const card: Response = await fetch(config.api + '/categories/expense/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-auth-token': localStorage.getItem("accessToken") ?? "",
            }
        });

        if (card.ok) {
            await this.loadExpenses();
        }
    }
}