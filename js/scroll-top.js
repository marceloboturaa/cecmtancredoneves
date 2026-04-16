(function () {
    function playScrollTopSound() {
        try {
            const sound = new Audio(new URL('../assets/audio/alerta-botão-novidade-flutuante.mp3', window.location.href).href);
            sound.volume = 0.7;
            const playPromise = sound.play();

            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    /* audio bloqueado pelo navegador */
                });
            }
        } catch (error) {
            /* audio indisponivel */
        }
    }

    function injectScrollTopStyles() {
        if (document.getElementById('scroll-top-inline-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'scroll-top-inline-styles';
        style.textContent = `
            .scroll-top-btn {
                position: fixed;
                right: 24px;
                bottom: 24px;
                width: 46px;
                height: 46px;
                border: none;
                border-radius: 999px;
                background: #68813c;
                color: #ffffff;
                font-size: 1.35rem;
                line-height: 1;
                box-shadow: 0 16px 30px rgba(0, 0, 0, 0.18);
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transform: translateY(10px);
                transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease, background 0.2s ease;
                z-index: 1200;
            }

            .scroll-top-btn:hover {
                background: #496b2e;
            }

            .scroll-top-btn.is-visible {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            @media (max-width: 640px) {
                .scroll-top-btn {
                    right: 16px;
                    bottom: 16px;
                    width: 42px;
                    height: 42px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function initScrollTopButton(options) {
        const settings = options || {};
        const threshold = settings.threshold || 220;
        const target = settings.scrollContainer || window;
        const button = document.createElement('button');
        const eventTarget = target === window ? window : target;

        injectScrollTopStyles();

        button.type = 'button';
        button.className = 'scroll-top-btn';
        button.setAttribute('aria-label', 'Voltar ao topo');
        button.innerHTML = '&#8593;';

        function getScrollTop() {
            if (target === window) {
                return window.scrollY || document.documentElement.scrollTop || 0;
            }

            return target.scrollTop;
        }

        function isScrollable() {
            if (target === window) {
                const doc = document.documentElement;
                return doc.scrollHeight > window.innerHeight + 10;
            }

            return target.scrollHeight > target.clientHeight + 10;
        }

        function toggleButton() {
            const shouldShow = isScrollable() && getScrollTop() > threshold;
            button.classList.toggle('is-visible', shouldShow);
        }

        button.addEventListener('click', function () {
            playScrollTopSound();

            if (target === window) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            target.scrollTo({ top: 0, behavior: 'smooth' });
        });

        eventTarget.addEventListener('scroll', toggleButton, { passive: true });
        window.addEventListener('resize', toggleButton);
        document.body.appendChild(button);
        toggleButton();

        return button;
    }

    window.initScrollTopButton = initScrollTopButton;
})();
