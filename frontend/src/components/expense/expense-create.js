import config from "../../config/config.js";

export class ExpenseCreate {

    constructor() {
        this.expenseNameInput = document.getElementById("expense-name");
        this.createExpenseButton = document.getElementById("accept-button");
        this.load().then();
    }

    async load() {
        await this.editExpenseEdit();
    }

    async edit() {
        let response = await fetch(config.api + '/categories/expense/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-auth-token': localStorage.getItem("accessToken"),
            },
            body: JSON.stringify({
                title: this.expenseNameInput.value
            })
        })

        if (response.ok) {
            window.location.hash = "#/expense";
        } else {
            alert('Произошла ошибка');
        }
    }

    async editExpenseEdit() {
        this.createExpenseButton.addEventListener("click", () => {
            this.edit();
        });
    }
}