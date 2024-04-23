export class Sidebar {

    constructor() {
        this.sidebarWrapper = document.getElementById("wrapper");
        this.sidebarToggleButton = document.getElementById("menu-toggle");
        this.categoryButton = document.getElementById("category-button");

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
    }
}


