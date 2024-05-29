export class CreateElement {
    static successDeleteId: string = '';
    private static expensePopup: HTMLElement | null;

    static PopupExpenseAndIncome(popupId: string, successId: string, cancelId: string, message: string, deleteRequest: (id:string) => void): HTMLElement {

        const popup: HTMLDivElement = document.createElement('div');
        popup.classList.add('d-none', 'vh-100', 'vw-100', 'position-fixed', 'top-0', 'start-0', 'bg-opacity-50', 'bg-black', 'z-3');
        popup.id = popupId;

        const popupCard: HTMLDivElement = document.createElement('div');
        popupCard.classList.add('popup-card', 'card', 'position-fixed', 'top-50', 'start-50', 'translate-middle');
        popupCard.style.padding = '40px';

        const cardBody: HTMLDivElement = document.createElement('div');
        cardBody.classList.add('card-body', 'text-center');

        const h4: HTMLHeadElement = document.createElement('h4');
        h4.classList.add('h4', 'mb-3');
        h4.innerText = message;

        const buttons: HTMLDivElement = document.createElement('div');
        buttons.classList.add('d-flex', 'gap-3', 'justify-content-center');

        const successButton: HTMLButtonElement = document.createElement('button');
        successButton.classList.add('btn', 'btn-success', 'px-3', 'py-2');
        successButton.innerText = 'Да, удалить';
        successButton.id = successId;
        successButton.type = 'button';

        successButton.addEventListener('click', async (): Promise<void> => {
            await deleteRequest(this.successDeleteId);
            popup.classList.add('d-none');
        });

        const cancelButton = document.createElement('button');
        cancelButton.classList.add('btn', 'btn-danger', 'px-3', 'py-2');
        cancelButton.innerText = 'Не удалять';
        cancelButton.id = cancelId;
        cancelButton.type = 'button';

        cancelButton.addEventListener('click', () => {
            popup.classList.add('d-none');
        });

        buttons.append(successButton, cancelButton);
        popupCard.append(cardBody);
        cardBody.append(h4, buttons);
        popup.append(popupCard);

        return popup;
    } // Метод создания попапа

    static CardElement(operation: string, id: string, title: string, insertWrapper: HTMLElement, popupId: string) {
        this.expensePopup = document.getElementById(popupId); // Попап

        const card = document.createElement('div');
        card.classList.add('col-sm-4', 'col-lg-4', 'col-md-6');
        card.id = `card-${id}`;

        const cardElement = document.createElement('div');
        cardElement.classList.add('card');

        const cardBody = document.createElement('div');
        cardBody.classList.add('container', 'card-body');

        const titleElement = document.createElement('h5');
        titleElement.classList.add('card-title', 'card-title-styles', 'h3', 'mb-3', 'text-truncate');
        titleElement.textContent = title;

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('row', 'gap-2', 'px-2');

        const editButton = document.createElement('a');
        editButton.classList.add('btn', 'btn-primary', 'col-xl-6', 'text-truncate');
        editButton.href = `#/${operation}-edit?id=${id}&title=${title}`;
        editButton.textContent = 'Редактировать';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger', 'col-xl-4', 'text-truncate', 'delete-button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Удалить';
        deleteButton.id = `${id}`;

        deleteButton.addEventListener('click', (e: MouseEvent) => {
            this.successDeleteId = (e.target as HTMLButtonElement).id;
        });

        deleteButton.addEventListener('click', () => {
            (this.expensePopup as HTMLElement).classList.remove('d-none');
        });

        buttonContainer.append(editButton, deleteButton);
        cardBody.append(titleElement, buttonContainer);

        cardElement.append(cardBody);
        card.append(cardElement);

        insertWrapper.appendChild(card);
    }

    static CardAddElement(insertWrapper: HTMLElement, createLink: string) {
        const card: HTMLDivElement = document.createElement('div');
        card.classList.add('col-sm-4', 'col-lg-4', 'col-md-6');

        const cardElement: HTMLDivElement = document.createElement('div');
        cardElement.classList.add('card', 'h-100');

        const cardBody: HTMLDivElement = document.createElement('div');
        cardBody.classList.add('card-body');

        const link: HTMLAnchorElement = document.createElement('a');
        link.href = createLink;
        link.classList.add('d-flex', 'align-items-center', 'justify-content-center', 'h-100');

        const icon: HTMLElement = document.createElement('i');
        icon.classList.add('bi', 'bi-plus', 'fs-2', 'text-secondary');

        link.append(icon);
        cardBody.append(link);
        cardElement.append(cardBody);
        card.append(cardElement);

        insertWrapper.appendChild(card);
    }
}