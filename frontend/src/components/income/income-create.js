import config from "../../config/config.js";

export class IncomeCreate {

    constructor() {
        this.incomeNameInput = document.getElementById("income-name");
        this.createIncomeButton = document.getElementById("accept-button");
        this.load().then();
    }

    async load() {
        await this.editIncomeEdit();
    }

    async edit() {
        let response = await fetch(config.api + '/categories/income/', {
            method: 'POST',
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
        this.createIncomeButton.addEventListener("click", () => {
            this.edit();
        });
    }
}