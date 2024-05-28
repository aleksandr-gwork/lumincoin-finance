import config from "../config/config.js";
import {Auth} from "./auth/auth.js";

export class Sidebar {

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
        this.userName = document.getElementById("userName");

        window.addEventListener('load', () => {
            if (this.sidebarWrapper.classList.contains('toggled')) {
                this.sidebarWrapper.classList.remove('toggled');
            }
            this.sidebarWrapper.classList.toggle('toggled', window.matchMedia('(min-width: 992px)').matches);
        });

        window.addEventListener('resize', () => {
            this.sidebarWrapper.classList.toggle('toggled', window.matchMedia('(min-width: 992px)').matches);
        });

        this.sidebarToggleButton.addEventListener("click", () => {
            this.sidebarWrapper.classList.toggle("toggled");
        });

        this.categoryButton.addEventListener("click", () => {
            this.categoryButton.classList.toggle("active");
        });

        this.logoutBtn.addEventListener("click", () => {
            location.href = "#/logout";
        });

        this.getUserInfo();
        this.getBalance().then();
        this.searchActiveNavLink();
    }

    getUserInfo() {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        let userName = userInfo.name;
        let userLastName = userInfo.lastName;
        this.userName.innerText = `${userName} ${userLastName}`
    }

    async getBalance() {
        let userBalance = await fetch(config.api + '/balance', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-auth-token': localStorage.getItem("accessToken"),
            }
        })

        await Auth.processUnauthorizedRequest();

        if (userBalance.ok) {
            let result = await userBalance.json();
            this.balance.innerText = result.balance;
        }
    }

    searchActiveNavLink() {
        if (window.location.hash === "#/") {
            this.sidebarMain.classList.add("active");
        }

        if (window.location.hash === "#/income") {
            this.sidebarIncome.classList.add("active");
            this.categoryButton.classList.add("active");
        }

        if (window.location.hash === "#/expense") {
            this.sidebarExpense.classList.add("active");
            this.categoryButton.classList.add("active");
        }

        if (window.location.hash === "#/operations") {
            this.sidebarExpenseAndIncomes.classList.add("active");
        }

        this.categoryButton.addEventListener('click', () => {
            if (this.categoryButton.classList.contains("active")) {
                this.sidebarMain.classList.remove("active");
                this.sidebarExpenseAndIncomes.classList.remove("active");
            } else {
                this.categoryButton.classList.add("active");
            }
        })
        this.sidebarIncome.addEventListener('mouseover', () => {
            if (this.sidebarExpense.classList.contains("active")) {
                this.sidebarExpense.classList.remove("active");
            }
        })

        this.sidebarExpense.addEventListener('mouseover', () => {
            if (this.sidebarIncome.classList.contains("active")) {
                this.sidebarIncome.classList.remove("active");
            }
        })
    }

}


