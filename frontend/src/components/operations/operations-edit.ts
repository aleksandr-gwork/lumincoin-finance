import {operationsUtils} from "./operations-utils";
import config from "../../config/config";


export class OperationsEdit {
    private inputElements: {
        date: HTMLElement;
        amount: HTMLElement;
        comment: HTMLElement;
        type: HTMLElement;
        category: HTMLElement
    };
    private buttonElements: {
        acceptButton: HTMLElement;
        exitButton: HTMLElement;
    };


    constructor() {
        this.inputElements = {
            date: document.getElementById('date')!,
            amount: document.getElementById('amount')!,
            comment: document.getElementById('comment')!,
            type: document.getElementById('type')!,
            category: document.getElementById('category')!
        };

        this.buttonElements = {
            acceptButton: document.getElementById('accept-button')!,
            exitButton: document.getElementById('exit-button')!
        };
        this.addEvents();
        this.setValues();

        this.load().then();

    }


    private addEvents(): void {
        this.buttonElements.acceptButton.addEventListener('click', async () => {
            await this.operationsResponse();
        });

        this.buttonElements.exitButton.addEventListener('click', () => {
            window.location.href = '#/operations';
        });

        this.inputElements.type.addEventListener('change', async () => {
            await this.categoryResponse();
        });
    }

    private setValues(): void {
        (this.inputElements.type as HTMLInputElement).value = operationsUtils.type;
        (this.inputElements.category as HTMLInputElement).value = operationsUtils.category;
        (this.inputElements.amount as HTMLInputElement).value = operationsUtils.amount;
        (this.inputElements.date as HTMLInputElement).value = operationsUtils.date;
        (this.inputElements.comment as HTMLInputElement).value = operationsUtils.comment;
    }

    private async load(): Promise<void> {
        await this.categoryResponse();
    }


    async categoryResponse(): Promise<void> {
        this.inputElements.category.innerHTML = '';
        const response: Response = await fetch(config.api + '/categories/' + (this.inputElements.type as HTMLInputElement).value, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-auth-token': localStorage.getItem("accessToken") ?? '',
            }
        });
        const result = await response.json();

        result.forEach((element: any): void => {
            const option: HTMLOptionElement = document.createElement('option');
            option.value = element.id;
            option.textContent = element.title;
            this.inputElements.category.appendChild(option);

            if (element.title === operationsUtils.category) {
                option.selected = true;
            }
        })


    }

    private async operationsResponse(): Promise<void> {
        const response = await fetch(config.api + '/operations/' + operationsUtils.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem("accessToken") ?? '',
            },
            body: JSON.stringify({
                "type": (this.inputElements.type as HTMLInputElement).value,
                "amount": Number((this.inputElements.amount as HTMLInputElement).value),
                "date": (this.inputElements.date as HTMLInputElement).value,
                "comment": (this.inputElements.comment as HTMLInputElement).value,
                "category_id": Number((this.inputElements.category as HTMLInputElement).value)
            })
        });

        if (response.ok) {
            window.location.href = '#/operations';
        } else {
            alert('Не удалось создать карточку');
        }
    }
}