import config from "../config/config";
import {Auth} from "./auth/auth";

export class Sidebar {
    readonly sidebarWrapper: HTMLElement | null;
    readonly logoutBtn: HTMLElement | null;
    readonly sidebarMain: HTMLElement | null;
    readonly categoryButton: HTMLElement | null;
    readonly sidebarIncome: HTMLElement | null;
    readonly sidebarExpense: HTMLElement | null;
    readonly sidebarExpenseAndIncomes: HTMLElement | null;
    readonly balance: HTMLElement | null;
    private userName!: HTMLElement | null;
    readonly sidebarToggleButton: HTMLElement | null;

    constructor() {
        this.sidebarWrapper = document.getElementById("wrapper");
        this.sidebarToggleButton = document.getElementById("menu-toggle");
        this.logoutBtn = document.getElementById("logoutBtn");

        this.sidebarMain = document.getElementById("sidebar-main");
        this.categoryButton = document.getElementById("category-button");
        this.sidebarIncome = document.getElementById("sidebar-income");
        this.sidebarExpense = document.getElementById("sidebar-expense");
        this.sidebarExpenseAndIncomes = document.getElementById("sidebar-expense-income");

        this.balance = document.getElementById("balance");

        window.addEventListener('load', (): void => {
            if (!this.sidebarWrapper) {
                return;
            }
            if (this.sidebarWrapper.classList.contains('toggled')) {
                this.sidebarWrapper.classList.remove('toggled');
            }
            this.sidebarWrapper.classList.toggle('toggled', window.matchMedia('(min-width: 992px)').matches);
        });

        window.addEventListener('resize', (): void => {
            if (this.sidebarWrapper) {
                this.sidebarWrapper.classList.toggle('toggled', window.matchMedia('(min-width: 992px)').matches);
            }
        });

        if (this.sidebarToggleButton && this.sidebarWrapper) {
            this.sidebarToggleButton.addEventListener("click", (): void => {
                this.sidebarWrapper!.classList.toggle("toggled");
            });
        }

        if (this.categoryButton) {
            this.categoryButton.addEventListener("click", (): void => {
                this.categoryButton!.classList.toggle("active");
            });
        }

        if (this.logoutBtn) {
            this.logoutBtn.addEventListener("click", (): void => {
                location.href = "#/logout";
            });
        }

        this.getUserInfo();
        this.getBalance().then();
        this.searchActiveNavLink();
    }

    private getUserInfo(): void {
        this.userName = document.getElementById("userName");
        let userInfoString: string | null = Auth.getUserInfo();
        let userInfo: { name: string, lastName: string } | null = userInfoString ? JSON.parse(userInfoString) : null;
        if (userInfo && this.userName) {
            this.userName.innerText = userInfo.name + " " + userInfo.lastName;
        }
    }

    private async getBalance(): Promise<void> {
        let userBalance: Response = await fetch(config.api + '/balance', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-auth-token': localStorage.getItem('accessToken') ?? '',
            }
        })

        await Auth.processUnauthorizedRequest();

        if (userBalance.ok) {
            let result: { balance: string } = await userBalance.json();
            if (this.balance) {
                this.balance.innerText = result.balance;
            }
        }
    }

    private searchActiveNavLink(): void {
        if (this.sidebarMain) {
            if (window.location.hash === "#/") {
                this.sidebarMain.classList.add("active");
            }
        }

        if (window.location.hash === "#/income" && this.sidebarIncome && this.categoryButton) {
            this.sidebarIncome.classList.add("active");
            this.categoryButton.classList.add("active");
        }

        if (window.location.hash === "#/expense" && this.sidebarExpense && this.categoryButton) {
            this.sidebarExpense.classList.add("active");
            this.categoryButton.classList.add("active");
        }

        if (window.location.hash === "#/operations" && this.sidebarExpenseAndIncomes) {
            this.sidebarExpenseAndIncomes.classList.add("active");
        }

        if (this.categoryButton) {
            this.categoryButton.addEventListener('click', (): void => {
                if (this.categoryButton && this.sidebarMain && this.sidebarExpenseAndIncomes && this.categoryButton.classList.contains("active")) {
                    this.sidebarMain.classList.remove("active");
                    this.sidebarExpenseAndIncomes.classList.remove("active");
                } else {
                    this.categoryButton!.classList.add("active");
                }
            })
        }

        if (this.sidebarIncome) this.sidebarIncome.addEventListener('mouseover', (): void => {
            if (this.sidebarExpense && this.sidebarExpense.classList.contains("active")) {
                this.sidebarExpense.classList.remove("active");
            }
        })

        if (this.sidebarExpense) this.sidebarExpense.addEventListener('mouseover', (): void => {
            if (this.sidebarIncome && this.sidebarIncome.classList.contains("active")) {
                this.sidebarIncome.classList.remove("active");
            }
        })
    }
}


