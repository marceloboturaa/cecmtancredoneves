/* MENU MOBILE – usa o botão já existente no HTML */
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // flip-card click handler for color change
    document.querySelectorAll('.flip-card > .flip-inner > a').forEach(link => {
        link.addEventListener('click', function(e) {
            // toggle clicked class on parent flip-card
            const card = this.closest('.flip-card');
            if (card) {
                card.classList.toggle('clicked');
            }
            // allow navigation after toggling
        });
    });
});