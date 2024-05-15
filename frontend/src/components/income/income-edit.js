import config from "../../config/config.js";

export class IncomeEdit {

    constructor() {
        this.incomeNameInput = document.getElementById("income-name");
        this.editIncomeButton = document.getElementById("accept-button");
        this.load().then();
    }

    async load() {
        let title = window.location.hash.split('title=')[1];
        this.incomeNameInput.value = decodeURI(title);
        await this.editIncomeEdit();
    }

    async save() {
        let id = window.location.hash.split('id=')[1];
        id = id.split('&')[0];

        let response = await fetch(config.api + '/categories/income/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-auth-token': localStorage.getItem("accessToken"),
            },
            body: JSON.stringify({
                title: this.incomeNameInput.value
            })
        })

        if (response.ok) {
            window.location.hash = "#/income";
        } else {
            alert('Произошла ошибка');
        }
    }

    async editIncomeEdit() {
        this.editIncomeButton.addEventListener("click", () => {
            this.save();
        });
    }
}