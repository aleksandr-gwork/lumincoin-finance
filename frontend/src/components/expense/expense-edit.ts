import config from "../../config/config";

export class ExpenseEdit {
    private expenseNameInput: HTMLElement | null;
    readonly editExpenseButton: HTMLElement | null;

    constructor() {
        this.expenseNameInput = document.getElementById("expense-name");
        this.editExpenseButton = document.getElementById("accept-button");
        this.load().then();
    }

    async load(): Promise<void> {
        let title: string = window.location.hash.split('title=')[1];
        (this.expenseNameInput as HTMLInputElement).value = decodeURI(title);
        await this.editExpenseEdit();
    }

    async save(): Promise<void> {
        let id: string = window.location.hash.split('id=')[1];
        id = id.split('&')[0];

        let response: Response = await fetch(config.api + '/categories/expense/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-auth-token': localStorage.getItem("accessToken") ?? "",
            },
            body: JSON.stringify({
                title: (this.expenseNameInput as HTMLInputElement).value
            })
        })

        if (response.ok) {
            window.location.hash = "#/expense";
        } else {
            alert('Произошла ошибка');
        }
    }

    async editExpenseEdit(): Promise<void> {
        if (this.editExpenseButton) {
            this.editExpenseButton.addEventListener("click", () => {
                this.save();
            });
        }
    }
}