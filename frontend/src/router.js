import {Sidebar} from "./components/sidebar.js";
import {Main} from "./components/main.js";
import {Validation} from "./components/validation.js";
import {Login} from "./components/auth/login.js";
import {Logout} from "./components/auth/logout.js";
import {Registration} from "./components/auth/registration.js";
import {Auth} from "./components/auth/auth.js";
import {Income} from "./components/income/income.js";
import {IncomeEdit} from "./components/income/income-edit.js";
import {IncomeCreate} from "./components/income/income-create.js";
import {Expense} from "./components/expense/expense.js";
import {ExpenseCreate} from "./components/expense/expense-create.js";
import {ExpenseEdit} from "./components/expense/expense-edit.js";
import {Operations} from "./components/operations/operations.js";
import {OperationsEdit} from "./components/operations/operations-edit.js";
import {OperationsCreate} from "./components/operations/operations-create.js";

export class Router {
    constructor() {
        this.contentPageElement = document.getElementById('content');
        this.styleElement = document.getElementById('styles');
        this.titlePageElement = document.getElementById('page-title');

        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/main.html',
                styles: 'styles/main.css',
                useSidebar: 'templates/sidebar.html',
                load: () => {
                    new Sidebar();
                    new Main();
                }
            },
            {
                route: '#/login',
                title: 'Вход',
                template: 'templates/login.html',
                styles: 'styles/login-register-pages.css',
                load: () => {
                    new Login();
                }
            },
            {
                route: '#/logout',
                load: () => {
                    new Logout();
                }
            },
            {
                route: '#/registration',
                title: 'Регистрация',
                template: 'templates/registration.html',
                styles: 'styles/login-register-pages.css',
                load: () => {
                    new Registration();
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income/income.html',
                useSidebar: 'templates/sidebar.html',
                load: () => {
                    new Sidebar();
                    new Income();
                }
            },
            {
                route: '#/income-edit',
                title: 'Редактирование категории доходов',
                template: 'templates/income/income-edit.html',
                useSidebar: 'templates/sidebar.html',
                load: () => {
                    new Sidebar();
                    new Validation();
                    new IncomeEdit();
                }
            },
            {
                route: '#/income-create',
                title: 'Создание категории расходов',
                template: 'templates/income/income-create.html',
                useSidebar: 'templates/sidebar.html',
                load: () => {
                    new Sidebar();
                    new Validation();
                    new IncomeCreate();
                }
            },
            {
                route: '#/expense',
                title: 'Расходы',
                template: 'templates/expense/expense.html',
                useSidebar: 'templates/sidebar.html',
                load: () => {
                    new Sidebar();
                    new Expense();
                }
            },
            {
                route: '#/expense-edit',
                title: 'Редактирование категории расходов',
                template: 'templates/expense/expense-edit.html',
                useSidebar: 'templates/sidebar.html',
                load: () => {
                    new Sidebar();
                    new Validation();
                    new ExpenseEdit();
                }
            },
            {
                route: '#/expense-create',
                title: 'Создание категории расходов',
                template: 'templates/expense/expense-create.html',
                useSidebar: 'templates/sidebar.html',
                load: () => {
                    new Sidebar();
                    new Validation();
                    new ExpenseCreate();
                }
            },
            {
                route: '#/operations',
                title: 'Доходы и расходы',
                template: 'templates/operations/operations.html',
                useSidebar: 'templates/sidebar.html',
                load: () => {
                    new Sidebar();
                    new Operations();
                }
            },
            {
                route: '#/operations-edit',
                title: 'Редактирование категории расходов',
                template: 'templates/operations/operations-edit.html',
                useSidebar: 'templates/sidebar.html',
                load: () => {
                    new Sidebar();
                    new Validation();
                    new OperationsEdit();
                }
            },
            {
                route: '#/operations-create',
                title: 'Создание категории расходов',
                template: 'templates/operations/operations-create.html',
                useSidebar: 'templates/sidebar.html',
                load: () => {
                    new Sidebar();
                    new Validation();
                    new OperationsCreate();
                }
            }
        ]
    }

    async openRoute() {

        const urlRoute = window.location.hash.split('?')[0];

        // Find route
        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        });

        // if (!newRoute) {
        //     window.location.href = '#/';
        //     return;
        // }

        if (newRoute && newRoute.route !== '#/login' && newRoute.route !== '#/registration' && localStorage.getItem(Auth.accessTokenKey) === null) {
            window.location.href = '#/login';
            return;
        }

        if (!newRoute || (newRoute && (newRoute.route === '#/login' || newRoute.route === '#/registration') && localStorage.getItem(Auth.accessTokenKey))) {
            window.location.href = '#/';
            return;
        }

        if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement.innerHTML = newRoute.title + ' | Lumincoin Finance';
            }
            if (newRoute.template) {
                let contentBlock = this.contentPageElement;
                if (newRoute.useSidebar) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useSidebar).then(response => response.text());
                    contentBlock = document.getElementById('page-content-wrapper');
                }
                contentBlock.innerHTML = await fetch(newRoute.template).then(response => response.text());
            }
            if (newRoute.styles) {
                this.styleElement.setAttribute('href', newRoute.styles);
            }
            newRoute.load();
        }
    }


}