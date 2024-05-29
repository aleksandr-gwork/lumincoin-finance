import config from "../../config/config";

export class ExpenseCreate {
    private expenseNameInput: HTMLElement | null;
    readonly createExpenseButton: HTMLElement | null;

    constructor() {
        this.expenseNameInput = document.getElementById("expense-name");
        this.createExpenseButton = document.getElementById("accept-button");
        this.load().then();
    }

    async load(): Promise<void> {
        await this.editExpenseEdit();
    }

    async edit(): Promise<void> {
        let response: Response = await fetch(config.api + '/categories/expense/', {
            method: 'POST',
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
        if (this.createExpenseButton) {
            this.createExpenseButton.addEventListener("click", () => {
                this.edit();
            });
        }
    }
}