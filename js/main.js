/* MENU MOBILE + AJUSTES GLOBAIS */
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const submenuParents = document.querySelectorAll('.has-submenu');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
        });
    }

    const usesTapSubmenu = function () {
        return window.innerWidth <= 768 || window.matchMedia('(hover: none)').matches;
    };

    submenuParents.forEach(function (item) {
        const trigger = item.querySelector(':scope > a');
        if (!trigger) return;

        trigger.addEventListener('click', function (event) {
            if (!usesTapSubmenu()) return;

            const isOpen = item.classList.contains('submenu-open');
            submenuParents.forEach(function (otherItem) {
                if (otherItem !== item) {
                    otherItem.classList.remove('submenu-open');
                }
            });

            if (!isOpen) {
                event.preventDefault();
                item.classList.add('submenu-open');
            }
        });
    });

    document.addEventListener('click', function (event) {
        submenuParents.forEach(function (item) {
            if (!item.contains(event.target)) {
                item.classList.remove('submenu-open');
            }
        });
    });

    window.addEventListener('resize', function () {
        if (!usesTapSubmenu()) {
            submenuParents.forEach(function (item) {
                item.classList.remove('submenu-open');
            });
        }
    });

    if (!document.querySelector('.scroll-top-btn')) {
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.type = 'button';
        scrollTopBtn.className = 'scroll-top-btn';
        scrollTopBtn.setAttribute('aria-label', 'Voltar ao topo');
        scrollTopBtn.innerHTML = '&#8593;';

        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        document.body.appendChild(scrollTopBtn);

        const toggleScrollButton = function () {
            const shouldShow = window.scrollY > Math.max(320, window.innerHeight * 0.45);
            scrollTopBtn.classList.toggle('is-visible', shouldShow);
        };

        window.addEventListener('scroll', toggleScrollButton, { passive: true });
        toggleScrollButton();
    }
});
