import {operationsUtils} from "./operations-utils.js";
import config from "../../config/config.js";


export class OperationsEdit {
    constructor() {

        this.load().then();

    }

    searchElements() {
        this.inputElements = {
            type: document.getElementById('type'),
            category: document.getElementById('category'),
            amount: document.getElementById('amount'),
            date: document.getElementById('date'),
            comment: document.getElementById('comment'),
        }

        this.buttonElements = {
            acceptButton: document.getElementById('accept-button'),
            exitButton: document.getElementById('exit-button'),
        }

        this.addEvents();
        this.setValues();
    }

    addEvents() {
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

    setValues() {
        this.inputElements.type.value = operationsUtils.type;
        this.inputElements.category.value = operationsUtils.category;
        this.inputElements.amount.value = operationsUtils.amount;
        this.inputElements.date.value = operationsUtils.date;
        this.inputElements.comment.value = operationsUtils.comment;
    }

    async load() {
        this.searchElements();

        await this.categoryResponse();

    }


    async categoryResponse() {
        this.inputElements.category.innerHTML = '';
        const response = await fetch(config.api + '/categories/' + this.inputElements.type.value, {
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
            this.inputElements.category.appendChild(option);

            if (element.title === operationsUtils.category) {
                option.selected = true;
            }
        })


    }

    async operationsResponse() {
        const response = await fetch(config.api + '/operations/' + operationsUtils.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem("accessToken"),
            },
            body: JSON.stringify({
                "type": this.inputElements.type.value,
                "amount": Number(this.inputElements.amount.value),
                "date": this.inputElements.date.value,
                "comment": this.inputElements.comment.value,
                "category_id": Number(this.inputElements.category.value)
            })
        });

        if (response.ok) {
            window.location.href = '#/operations';
        } else {
            alert('Не удалось создать карточку');
        }
    }
}