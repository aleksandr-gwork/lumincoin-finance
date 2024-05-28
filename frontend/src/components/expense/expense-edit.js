import config from "../../config/config.js";

export class ExpenseEdit {

    constructor() {
        this.expenseNameInput = document.getElementById("expense-name");
        this.editExpenseButton = document.getElementById("accept-button");
        this.load().then();
    }

    async load() {
        let title = window.location.hash.split('title=')[1];
        this.expenseNameInput.value = decodeURI(title);
        await this.editExpenseEdit();
    }

    async save() {
        let id = window.location.hash.split('id=')[1];
        id = id.split('&')[0];

        let response = await fetch(config.api + '/categories/expense/' + id, {
            method: 'PUT',
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
        this.editExpenseButton.addEventListener("click", () => {
            this.save();
        });
    }
}