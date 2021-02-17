document.querySelectorAll('.buttons button').forEach(button => {
    button.addEventListener('click', e => {
        document.querySelectorAll('.buttons button').forEach(item => {
            item.classList.remove('active');
        });
        e.target.classList.add('active');
    });
});