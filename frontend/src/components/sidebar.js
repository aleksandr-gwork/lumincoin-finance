export class Sidebar {

    constructor() {
        this.addEvents();
    }

    addEvents() {
        let sidebarWrapper = document.getElementById("wrapper");
        let sidebarToggleButton = document.getElementById("menu-toggle");
        let categoryButton = document.getElementById("category-button");

        window.addEventListener('load', () => {
            if (sidebarWrapper.classList.contains('toggled')) {
                sidebarWrapper.classList.remove('toggled');
            }
            sidebarWrapper.classList.toggle('toggled', window.matchMedia('(min-width: 992px)').matches);
        });

        window.addEventListener('resize', () => {
            sidebarWrapper.classList.toggle('toggled', window.matchMedia('(min-width: 992px)').matches);
        });

        sidebarToggleButton.addEventListener("click", () => {
            sidebarWrapper.classList.toggle("toggled");
        });

        categoryButton.addEventListener("click", () => {
            categoryButton.classList.toggle("active");
        });
    }
}


