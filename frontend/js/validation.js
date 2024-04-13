// form validation
const form = document.querySelector('.needs-validation');
const createButton = document.getElementById('accept-button');
createButton.addEventListener('click', function (event) {
    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
}, false);