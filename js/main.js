/* MENU MOBILE + AJUSTES GLOBAIS */
const mainScriptElement = document.currentScript;
const siteBaseUrl = mainScriptElement
    ? new URL(mainScriptElement.getAttribute('src'), window.location.href).href.replace(/js\/main\.js(?:\?.*)?$/, '')
    : new URL('./', window.location.href).href;
const cookieConsentKey = 'cecmtan.cookies.choice';

function resolveSiteUrl(relativePath) {
    return new URL(relativePath, siteBaseUrl).href;
}

function getStoredConsent() {
    try {
        return window.localStorage.getItem(cookieConsentKey);
    } catch (error) {
        return null;
    }
}

function storeConsent(choice) {
    try {
        window.localStorage.setItem(cookieConsentKey, choice);
    } catch (error) {
        /* armazenamento indisponivel */
    }
}

function enhanceBetaBadges() {
    const betaBadges = document.querySelectorAll('.beta-badge');

    if (!betaBadges.length) {
        return;
    }

    betaBadges.forEach(function (badge) {
        if (badge.querySelector('.beta-badge__label')) {
            return;
        }

        const labelText = (badge.textContent || '').trim() || 'Beta';
        badge.textContent = '';

        const label = document.createElement('span');
        label.className = 'beta-badge__label';
        label.textContent = labelText;

        const message = document.createElement('span');
        message.className = 'beta-badge__message';

        const text = document.createElement('span');
        text.textContent = 'Novidades em breve';

        message.appendChild(text);
        badge.appendChild(label);
        badge.appendChild(message);
    });
}

function getLegalIconMarkup(type) {
    if (type === 'mapa') {
        return '<svg class="footer-legal-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5.5 9 3 3 5.5v15L9 18l6 2.5 6-2.5v-15L15 5.5zM9 16.3l-4 1.67V6.83L9 5.17v11.13zm2 0V5.17l4 1.66v11.14L11 16.3zm8 1.67-4 1.67V8.53l4-1.7v11.14z"/></svg>';
    }

    if (type === 'privacidade') {
        return '<svg class="footer-legal-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zm-7-2a2 2 0 1 1 4 0v2h-4V7zm7 12H7v-8h10v8z"/></svg>';
    }

    return '<svg class="footer-legal-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 5 5v6c0 5.05 3.41 9.57 7 11 3.59-1.43 7-5.95 7-11V5l-7-3zm0 2.18L17 6.32v4.62c0 3.98-2.53 7.67-5 8.86-2.47-1.19-5-4.88-5-8.86V6.32l5-2.14z"/></svg>';
}

function createFooterLegalLinks() {
    const footer = document.querySelector('footer');
    if (!footer || footer.querySelector('.footer-legal')) {
        return;
    }

    const legalContainer = document.createElement('div');
    legalContainer.className = 'footer-legal';

    [
        {
            href: resolveSiteUrl('mapa-do-site.html'),
            label: 'Mapa do site',
            icon: getLegalIconMarkup('mapa')
        },
        {
            href: resolveSiteUrl('politicas.html#diretrizes'),
            label: 'Política e diretrizes do site',
            icon: getLegalIconMarkup('politica')
        },
        {
            href: resolveSiteUrl('politicas.html#privacidade'),
            label: 'Privacidade e LGPD',
            icon: getLegalIconMarkup('privacidade')
        }
    ].forEach(function (item) {
        const link = document.createElement('a');
        link.className = 'footer-legal-link';
        link.href = item.href;
        link.setAttribute('aria-label', item.label);
        link.title = item.label;
        link.innerHTML = `${item.icon}<span class="footer-legal-label">${item.label}</span>`;
        legalContainer.appendChild(link);
    });

    const footerBottom = footer.querySelector('.footer-bottom');

    if (footerBottom) {
        footerBottom.appendChild(legalContainer);
        return;
    }

    footer.appendChild(legalContainer);
}

function createCookieBanner() {
    if (getStoredConsent() || document.querySelector('.cookie-banner')) {
        return;
    }

    const banner = document.createElement('aside');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Aviso de cookies');
    banner.innerHTML = `
        <div class="cookie-banner__content">
            <div class="cookie-banner__headline">
                <span class="cookie-banner__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10c-4.42 0-8-3.58-8-8 0-.7.09-1.38.26-2.03A9.95 9.95 0 0 0 12 2zm-3 7.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zm5 1.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM8.5 14a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm6.25 2a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"/></svg>
                </span>
                <strong>Nós usamos cookies</strong>
            </div>
            <p>
                Este site usa cookies e recursos similares para lembrar sua preferência de navegação,
                registrar o consentimento e manter a experiência estável. Recursos externos podem seguir
                políticas próprias.
            </p>
            <details class="cookie-banner__details">
                <summary>Informações sobre privacidade</summary>
                <p>
                    O projeto segue as diretrizes institucionais do colégio e apresenta orientações de
                    privacidade alinhadas à LGPD. Leia mais em
                    <a href="${resolveSiteUrl('politicas.html#diretrizes')}">Diretrizes do Site</a>
                    e
                    <a href="${resolveSiteUrl('politicas.html#privacidade')}">Privacidade e LGPD</a>.
                </p>
            </details>
        </div>
        <div class="cookie-banner__actions">
            <button type="button" class="btn btn-outline cookie-banner__btn" data-cookie-choice="rejeitado">Recusar</button>
            <button type="button" class="btn cookie-banner__btn" data-cookie-choice="aceito">Ok</button>
        </div>
    `;

    const closeBanner = function (choice) {
        storeConsent(choice);
        document.body.classList.remove('has-cookie-banner');
        banner.classList.add('is-hidden');
        window.setTimeout(function () {
            banner.remove();
        }, 220);
    };

    banner.querySelectorAll('[data-cookie-choice]').forEach(function (button) {
        button.addEventListener('click', function () {
            closeBanner(button.getAttribute('data-cookie-choice'));
        });
    });

    document.body.appendChild(banner);
    document.body.classList.add('has-cookie-banner');
}

document.addEventListener('DOMContentLoaded', function () {
    enhanceBetaBadges();

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

    createFooterLegalLinks();
    createCookieBanner();
});
