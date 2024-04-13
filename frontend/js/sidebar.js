const sidebarWrapper = document.getElementById("wrapper");
const sidebarToggleButton = document.getElementById("menu-toggle");
const categoryButton = document.getElementById("category-button");


window.addEventListener('load', () => {
    if (sidebarWrapper.classList.contains('toggled')) {
        sidebarWrapper.classList.remove('toggled');
    }
    sidebarWrapper.classList.toggle('toggled', window.matchMedia('(min-width: 992px)').matches);
});

window.addEventListener('resize', () => {
    sidebarWrapper.classList.toggle('toggled', window.matchMedia('(min-width: 992px)').matches);
});

sidebarToggleButton.addEventListener("click", function() {
    sidebarWrapper.classList.toggle("toggled");
});

categoryButton.addEventListener("click", function() {
    categoryButton.classList.toggle("active");
});