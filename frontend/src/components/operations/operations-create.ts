import {operationsUtils} from "./operations-utils";
import config from "../../config/config";

export class OperationsCreate {
    private type!: string;
    private category!: string;
    private amount!: string;
    private date!: string;
    private comment!: string;
    private acceptButton!: HTMLElement | null;
    private categoryElement!: HTMLElement | null;
    private amountElement!: HTMLElement | null;
    private commentElement!: HTMLElement | null;
    private typeElement!: HTMLElement | null;
    private dateElement!: HTMLElement | null;

    constructor() {
        this.searchElements();
        this.load().then();
    }

    private async load(): Promise<void> {
        if (this.type) {
            (this.type as unknown as HTMLInputElement).value = operationsUtils.type;
        }

        await this.categoryResponse();
        const typeElement: HTMLElement | null = document.getElementById('type');
        if (typeElement) {
            typeElement.addEventListener('change', async () => {
                await this.categoryResponse();
            })
        }
    }

    private searchElements(): void {
        this.typeElement = document.getElementById('type');
        if (this.typeElement) {
            (this.typeElement as HTMLInputElement).value = operationsUtils.type;
        }
        this.categoryElement = document.getElementById('category');
        this.amountElement = document.getElementById('amount');
        this.dateElement = document.getElementById('date');
        this.commentElement = document.getElementById('comment');

        this.acceptButton = document.getElementById('accept-button');

        if (this.acceptButton) {
            this.acceptButton.addEventListener('click', async (): Promise<void> => {
                await this.operationsResponse();
            });
        }

    }

    private async categoryResponse(): Promise<void> {
        if (this.categoryElement) {
            this.type = operationsUtils.type;
            this.categoryElement.innerHTML = '';
        }
        const response: Response = await fetch(config.api + '/categories/' + this.type, {
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
            if (this.categoryElement) {
                this.categoryElement.appendChild(option);
            }
        })
    }


    private operationRequest(): void {
        this.type = (this.typeElement as HTMLInputElement).value;
        this.category = (this.categoryElement as HTMLInputElement).value;
        this.amount = (this.amountElement as HTMLInputElement).value;
        this.date = (this.dateElement as HTMLInputElement).value;
        this.comment = (this.commentElement as HTMLInputElement).value;
    }

    async operationsResponse(): Promise<void> {
        this.operationRequest();

        const response: Response = await fetch(config.api + '/operations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-auth-token': localStorage.getItem("accessToken") ?? '',
            },
            body: JSON.stringify({
                "type": this.type,
                "amount": this.amount,
                "date": this.date,
                "comment": this.comment,
                "category_id": Number(this.category)
            })
        });

        const result = await response.json();

        if (result) {
            window.location.href = '#/operations';
        }
    }


}