import {Sidebar} from "./components/sidebar";
import {Main} from "./components/main";
import {Validation} from "./components/validation";
import {Login} from "./components/auth/login";
import {Logout} from "./components/auth/logout";
import {Registration} from "./components/auth/registration";
import {Auth} from "./components/auth/auth";
import {Income} from "./components/income/income";
import {IncomeEdit} from "./components/income/income-edit";
import {IncomeCreate} from "./components/income/income-create";
import {Expense} from "./components/expense/expense";
import {ExpenseCreate} from "./components/expense/expense-create";
import {ExpenseEdit} from "./components/expense/expense-edit";
import {Operations} from "./components/operations/operations";
import {OperationsEdit} from "./components/operations/operations-edit";
import {OperationsCreate} from "./components/operations/operations-create";
import {RouterType} from "./types/router.type";

export class Router {
    readonly contentPageElement: HTMLElement | null;
    readonly styleElement: HTMLElement | null;
    readonly titlePageElement: HTMLElement | null;
    private routes: RouterType[];

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

    public async openRoute(): Promise<void> {

        const urlRoute: string = window.location.hash.split('?')[0];

        // Find route
        const newRoute: RouterType | undefined = this.routes.find(item => {
            return item.route === urlRoute;
        });

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
                if (this.titlePageElement) {
                    this.titlePageElement.innerHTML = newRoute.title + ' | Lumincoin Finance';
                }

            }
            if (newRoute.template) {
                let contentBlock: HTMLElement | null = this.contentPageElement;
                if (newRoute.useSidebar) {
                    if (this.contentPageElement) {
                        this.contentPageElement.innerHTML = await fetch(newRoute.useSidebar).then(response => response.text());
                    }
                    contentBlock = document.getElementById('page-content-wrapper');
                }
                if (contentBlock) {
                    contentBlock.innerHTML = await fetch(newRoute.template).then(response => response.text());
                }
            }
            if (newRoute.styles) {
                if (this.styleElement) {
                    this.styleElement.setAttribute('href', newRoute.styles);
                }
            }
        }
        if (newRoute && typeof newRoute.load === 'function') {
            newRoute.load();
        }
    }
}