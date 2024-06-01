import config from "../../config/config";

export class IncomeEdit {
    private incomeNameInput: HTMLElement | null;
    readonly editIncomeButton: HTMLElement | null;

    constructor() {
        this.incomeNameInput = document.getElementById("income-name");
        this.editIncomeButton = document.getElementById("accept-button");
        this.load().then();
    }

    private async load(): Promise<void> {
        let title: string = window.location.hash.split('title=')[1];
        (this.incomeNameInput as HTMLInputElement).value = decodeURI(title);
        await this.editIncomeEdit();
    }

    private async save(): Promise<void> {
        let id: string = window.location.hash.split('id=')[1];
        id = id.split('&')[0];

        let response: Response = await fetch(config.api + '/categories/income/' + id, {
            method: 'PUT',
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

    private async editIncomeEdit(): Promise<void> {
        if (this.editIncomeButton) {
            this.editIncomeButton.addEventListener("click", () => {
                this.save();
            });
        }
    }
}