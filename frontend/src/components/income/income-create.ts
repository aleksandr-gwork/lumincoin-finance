import config from "../../config/config";

export class IncomeCreate {
    private incomeNameInput: HTMLElement | null;
    readonly createIncomeButton: HTMLElement | null;

    constructor() {
        this.incomeNameInput = document.getElementById("income-name");
        this.createIncomeButton = document.getElementById("accept-button");
        this.load().then();
    }

    async load(): Promise<void> {
        await this.editIncomeEdit();
    }

    async edit(): Promise<void> {
        let response: Response = await fetch(config.api + '/categories/income/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-auth-token': localStorage.getItem("accessToken") ?? "",
            },
            body: JSON.stringify({
                title: (this.incomeNameInput as HTMLInputElement).value
            })
        })

        if (response.ok) {
            window.location.hash = "#/income";
        } else {
            alert('Произошла ошибка');
        }
    }

    async editIncomeEdit(): Promise<void> {
        if (this.createIncomeButton) {
            this.createIncomeButton.addEventListener("click", () => {
                this.edit();
            });
        }

    }
}