import {operationsUtils} from "./operations-utils";
import config from "../../config/config.js";

export class OperationsCreate {

    constructor() {
        this.searchElements();

        this.load().then();


    }

    async load() {
        this.type.value = operationsUtils.type;
        await this.categoryResponse();
        document.getElementById('type').addEventListener('change', async () => {
            await this.categoryResponse();
        })
    }

    searchElements() {
        this.type = document.getElementById('type');
        this.category = document.getElementById('category');
        this.amount = document.getElementById('amount');
        this.date = document.getElementById('date');
        this.comment = document.getElementById('comment');

        this.acceptButton = document.getElementById('accept-button');
        this.acceptButton.addEventListener('click', async () => {
            await this.operationsResponse();
        });
    }

    async categoryResponse() {
        this.type = document.getElementById('type').value;
        this.category.innerHTML = '';
        const response = await fetch(config.api + '/categories/' + this.type, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-auth-token': localStorage.getItem("accessToken"),
            }
        });
        const result = await response.json();
        result.forEach(element => {
            const option = document.createElement('option');
            option.value = element.id;
            option.textContent = element.title;
            this.category.appendChild(option);
        })
    }


    operationRequest() {
        this.type = this.type.value;
        this.category = this.category.value;
        this.amount = this.amount.value;
        this.date = this.date.value;
        this.comment = this.comment.value;
    }

    async operationsResponse() {
        this.operationRequest();

        const response = await fetch(config.api + '/operations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-auth-token': localStorage.getItem("accessToken"),
            },
            body: JSON.stringify({
                "type": document.getElementById('type').value,
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