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

function playUiSound(relativePath, volume) {
    try {
        const sound = new Audio(resolveSiteUrl(relativePath));
        sound.volume = volume;
        sound.currentTime = 0;
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
        text.textContent = 'Em desenvolvimento';

        message.appendChild(text);
        badge.appendChild(label);
        badge.appendChild(message);
    });
}

function createFooterLegalLinks() {
    const footer = document.querySelector('footer');
    if (!footer) {
        return;
    }

    footer.querySelectorAll('.footer-legal, .footer-brand, .footer-divider, .footer-site-map').forEach(function (node) {
        node.remove();
    });
}

function ensureQuestoesLink() {
    document.querySelectorAll('.nav-links').forEach(function (navLinks) {
        const topLevelItems = Array.from(navLinks.children);
        const hasQuestoes = topLevelItems.some(function (item) {
            const link = item.querySelector(':scope > a');
            if (!link) {
                return false;
            }

            const href = link.getAttribute('href') || '';
            return href.includes('questoes.html');
        });

        if (hasQuestoes) {
            return;
        }

        const questoesItem = document.createElement('li');
        const questoesLink = document.createElement('a');
        questoesLink.href = resolveSiteUrl('questoes.html');
        questoesLink.textContent = 'Quiz';
        questoesItem.appendChild(questoesLink);

        const materiasItem = topLevelItems.find(function (item) {
            const link = item.querySelector(':scope > a');
            if (!link) {
                return false;
            }

            const href = link.getAttribute('href') || '';
            return href.includes('materias.html');
        });

        if (materiasItem) {
            navLinks.insertBefore(questoesItem, materiasItem);
            return;
        }

        navLinks.appendChild(questoesItem);
    });
}

function ensureSubmenuLinks() {
    const submenuConfigs = [
        {
            menuHref: 'mural.html',
            items: [
                { href: 'slide.html', label: 'Slides' },
                { href: 'trabalhos.html', label: 'Trabalhos' },
                { href: 'livros.html', label: 'Livros' },
                { href: 'apostilas.html', label: 'Apostilas' },
                { href: 'videos.html', label: 'VÃ­deos' },
                { href: 'acervo.html', label: 'Acervo' },
                { href: 'mural.html', label: 'MURAL', className: 'nav-highlight' }
            ]
        },
        {
            menuHref: 'noticias.html',
            items: [
                { href: 'noticias/retorno-as-aulas.html', label: 'Retorno às aulas' },
                { href: 'noticias/bullying.html', label: 'Bullying' },
                { href: 'noticias/pascoa.html', label: 'P\u00e1scoa' }
            ]
        }
    ];

    submenuConfigs.forEach(function (config) {
        document.querySelectorAll('.has-submenu').forEach(function (menuItem) {
            const trigger = menuItem.querySelector(':scope > a');
            const submenu = menuItem.querySelector(':scope > .submenu');
            if (!trigger || !submenu) {
                return;
            }

            const href = trigger.getAttribute('href') || '';
            if (!href.includes(config.menuHref)) {
                return;
            }

            if (config.menuHref === 'mural.html') {
                trigger.removeAttribute('href');
                trigger.setAttribute('aria-disabled', 'true');
                trigger.setAttribute('role', 'button');
            }

            config.items.forEach(function (item) {
                const targetPath = new URL(resolveSiteUrl(item.href)).pathname.replace(/\/+$/, '');
                const exists = Array.from(submenu.querySelectorAll(':scope > li > a')).some(function (link) {
                    const linkHref = link.getAttribute('href') || '';
                    const linkPath = new URL(linkHref, window.location.href).pathname.replace(/\/+$/, '');
                    return linkPath === targetPath;
                });

                if (exists) {
                    return;
                }

                const li = document.createElement('li');
                if (item.className) {
                    li.className = item.className;
                }
                const link = document.createElement('a');
                link.href = resolveSiteUrl(item.href);
                link.textContent = item.label;
                li.appendChild(link);
                submenu.appendChild(li);
            });
        });
    });
}

function ensureNoticiasMenu() {
    document.querySelectorAll('.nav-links').forEach(function (navLinks) {
        const topLevelItems = Array.from(navLinks.children);
        const noticiasItems = topLevelItems.filter(function (item) {
            const link = item.querySelector(':scope > a');
            if (!link) {
                return false;
            }

            const href = link.getAttribute('href') || '';
            const text = (link.textContent || '').toLowerCase();
            return href.includes('noticias.html') || text.includes('notícias') || text.includes('noticias');
        });

        if (noticiasItems.length > 1) {
            noticiasItems.slice(1).forEach(function (duplicateItem) {
                duplicateItem.remove();
            });
        }

        let noticiasItem = noticiasItems[0] || null;

        if (!noticiasItem) {
            noticiasItem = document.createElement('li');
            noticiasItem.className = 'has-submenu';

            const link = document.createElement('a');
            link.href = resolveSiteUrl('noticias.html');
            link.textContent = 'Not\u00edcias';
            noticiasItem.appendChild(link);

            const submenu = document.createElement('ul');
            submenu.className = 'submenu';
            noticiasItem.appendChild(submenu);
        }

        const submenu = noticiasItem.querySelector(':scope > .submenu');
        if (!submenu) {
            const novoSubmenu = document.createElement('ul');
            novoSubmenu.className = 'submenu';
            noticiasItem.appendChild(novoSubmenu);
        }

        const noticiasMenuLink = noticiasItem.querySelector(':scope > a');
        if (noticiasMenuLink) {
            noticiasMenuLink.href = resolveSiteUrl('noticias.html');
            noticiasMenuLink.textContent = 'Not\u00edcias';
        }

        const questoesItem = topLevelItems.find(function (item) {
            const link = item.querySelector(':scope > a');
            if (!link) {
                return false;
            }

            const href = link.getAttribute('href') || '';
            return href.includes('questoes.html');
        });

        const materiasItem = topLevelItems.find(function (item) {
            const link = item.querySelector(':scope > a');
            if (!link) {
                return false;
            }

            const href = link.getAttribute('href') || '';
            return href.includes('materias.html');
        });

        if (questoesItem) {
            navLinks.insertBefore(noticiasItem, questoesItem);
            return;
        }

        if (materiasItem) {
            navLinks.insertBefore(noticiasItem, materiasItem);
            return;
        }

        navLinks.appendChild(noticiasItem);
    });
}

function normalizeMuralMenuLabel() {
    document.querySelectorAll('.nav-links > .has-submenu > a').forEach(function (link) {
        const href = link.getAttribute('href') || '';
        const text = (link.textContent || '').trim().toLowerCase();

        if (!href.includes('mural.html') && text !== 'mural') {
            return;
        }

        link.removeAttribute('href');
        link.setAttribute('aria-disabled', 'true');
        link.setAttribute('role', 'button');
    });
}

function ensureEdFinanceiraLink() {
    document.querySelectorAll('.has-submenu').forEach(function (menuItem) {
        const trigger = menuItem.querySelector(':scope > a');
        const submenu = menuItem.querySelector(':scope > .submenu');
        if (!trigger || !submenu) {
            return;
        }

        const href = trigger.getAttribute('href') || '';
        if (!href.includes('materias.html')) {
            return;
        }

        const exists = Array.from(submenu.querySelectorAll(':scope > li > a')).some(function (link) {
            const linkHref = link.getAttribute('href') || '';
            return linkHref.includes('materias/educacao-financeira/index.html');
        });

        if (exists) {
            return;
        }

        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = resolveSiteUrl('materias/educacao-financeira/index.html');
        link.textContent = 'Ed. Financeira';
        li.appendChild(link);
        submenu.insertBefore(li, submenu.firstChild);
    });
}

function normalizeVisibleLabels() {
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.textContent = '\u2630';
    }

    document.querySelectorAll('.nav-links > li > a').forEach(function (link) {
        const href = link.getAttribute('href') || '';

        if (href.includes('index.html')) link.textContent = 'In\u00edcio';
        if (href.includes('noticias.html')) link.textContent = 'Not\u00edcias';
        if (href.includes('questoes.html')) link.textContent = 'Quiz';
        if (href.includes('videos.html')) link.textContent = 'V\u00eddeos';
        if (href.includes('materias.html') || href.includes('materias/educacao-financeira/index.html')) {
            link.textContent = 'Mat\u00e9rias';
        }
    });
}

function normalizeEducacaoFinanceiraMenu() {
    document.querySelectorAll('.nav-links').forEach(function (navLinks) {
        const materiasItem = Array.from(navLinks.children).find(function (item) {
            const link = item.querySelector(':scope > a');
            if (!link) return false;

            const href = link.getAttribute('href') || '';
            const text = (link.textContent || '').toLowerCase();
            return href.includes('materias.html') || text.includes('mater');
        });

        if (!materiasItem) {
            return;
        }

        const link = materiasItem.querySelector(':scope > a');
        if (!link) {
            return;
        }

        link.href = resolveSiteUrl('materias.html');
        link.textContent = 'Mat\u00e9rias';

        const submenu = materiasItem.querySelector(':scope > .submenu');
        if (submenu) {
            Array.from(submenu.querySelectorAll(':scope > li')).forEach(function (li) {
                const link = li.querySelector(':scope > a');
                if (!link) {
                    return;
                }

                const href = link.getAttribute('href') || '';
                if (!href.includes('materias/educacao-financeira/index.html')) {
                    li.remove();
                }
            });
        }
    });
}

function ensurePrivacyMenuIcon() {
    document.querySelectorAll('.nav-links').forEach(function (navLinks) {
        const topLevelItems = Array.from(navLinks.children);
        const hasPrivacyIcon = topLevelItems.some(function (item) {
            const link = item.querySelector(':scope > a');
            return link && link.classList.contains('nav-privacy-link');
        });

        if (hasPrivacyIcon) {
            return;
        }

        const privacyItem = document.createElement('li');
        privacyItem.className = 'nav-privacy-item';

        const privacyLink = document.createElement('a');
        privacyLink.href = resolveSiteUrl('diretrizes.html#diretrizes');
        privacyLink.className = 'nav-privacy-link';
        privacyLink.setAttribute('aria-label', 'PolÃ­tica e diretrizes do site');
        privacyLink.title = 'PolÃ­tica e diretrizes do site';
        privacyLink.innerHTML = '<svg class="nav-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 5 5v6c0 5.05 3.41 9.57 7 11 3.59-1.43 7-5.95 7-11V5l-7-3zm0 2.18L17 6.32v4.62c0 3.98-2.53 7.67-5 8.86-2.47-1.19-5-4.88-5-8.86V6.32l5-2.14z"/></svg>';
        privacyItem.appendChild(privacyLink);

        const sobreItem = topLevelItems.find(function (item) {
            const link = item.querySelector(':scope > a');
            if (!link) {
                return false;
            }

            const href = link.getAttribute('href') || '';
            return href.includes('sobre.html');
        });

        if (sobreItem && sobreItem.nextSibling) {
            navLinks.insertBefore(privacyItem, sobreItem.nextSibling);
            return;
        }

        navLinks.appendChild(privacyItem);
    });
}

function setupFloatingAlerts() {
    document.querySelectorAll('[data-floating-alert]').forEach(function (alertElement) {
        const alertId = alertElement.getAttribute('data-floating-alert');
        if (!alertId) {
            return;
        }

        const storageKey = `cecmtan.alert.dismissed.${alertId}`;

        try {
            if (window.localStorage.getItem(storageKey) === '1') {
                alertElement.remove();
                return;
            }
        } catch (error) {
            /* armazenamento indisponivel */
        }

        const closeButton = alertElement.querySelector('.floating-alert__close');
        if (!closeButton) {
            return;
        }

        window.requestAnimationFrame(function () {
            alertElement.classList.add('is-visible');
        });

        window.setTimeout(function () {
            if (document.body.contains(alertElement)) {
                playUiSound('assets/audio/alerta-botÃ£o-novidade-flutuante.mp3', 0.7);
            }
        }, 180);

        closeButton.addEventListener('click', function () {
            try {
                window.localStorage.setItem(storageKey, '1');
            } catch (error) {
                /* armazenamento indisponivel */
            }

            alertElement.classList.remove('is-visible');

            window.setTimeout(function () {
                alertElement.remove();
            }, 220);
        });
    });
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
                <strong>NÃ³s usamos cookies</strong>
            </div>
            <p>
                Este site usa cookies e recursos similares para lembrar sua preferÃªncia de navegaÃ§Ã£o,
                registrar o consentimento e manter a experiÃªncia estÃ¡vel. Recursos externos podem seguir
                polÃ­ticas prÃ³prias.
            </p>
            <details class="cookie-banner__details">
                <summary>InformaÃ§Ãµes sobre privacidade</summary>
                <p>
                    O projeto segue as diretrizes institucionais do colÃ©gio e apresenta orientaÃ§Ãµes de
                    privacidade alinhadas Ã  LGPD. Leia mais em
                    <a href="${resolveSiteUrl('diretrizes.html#diretrizes')}">Diretrizes do Site</a>
                    e
                    <a href="${resolveSiteUrl('diretrizes.html#privacidade')}">Privacidade e LGPD</a>.
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
    ensureNoticiasMenu();
    ensureSubmenuLinks();
    normalizeMuralMenuLabel();
    ensureEdFinanceiraLink();
    ensureQuestoesLink();
    normalizeEducacaoFinanceiraMenu();
    normalizeVisibleLabels();
    ensurePrivacyMenuIcon();

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const submenuParents = document.querySelectorAll('.has-submenu');
    let navScrim = document.querySelector('.nav-scrim');

    if (!navScrim) {
        navScrim = document.createElement('button');
        navScrim.type = 'button';
        navScrim.className = 'nav-scrim';
        navScrim.setAttribute('aria-label', 'Fechar menu');
        document.body.appendChild(navScrim);
    }

    const closeMobileMenu = function () {
        if (!navLinks || !menuToggle) {
            return;
        }

        navLinks.classList.remove('active');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');

        submenuParents.forEach(function (item) {
            item.classList.remove('submenu-open');
        });
    };

    if (menuToggle && navLinks) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');

        menuToggle.addEventListener('click', function () {
            const isOpen = navLinks.classList.toggle('active');
            menuToggle.classList.toggle('is-active', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            document.body.classList.toggle('nav-open', isOpen);
        });
    }

    if (navScrim) {
        navScrim.addEventListener('click', closeMobileMenu);
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

        if (!navLinks || !menuToggle || window.innerWidth > 768) {
            return;
        }

        if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', function () {
        if (!usesTapSubmenu()) {
            closeMobileMenu();
        }
    });

    document.querySelectorAll('.nav-links a').forEach(function (link) {
        link.addEventListener('click', function () {
            const parentItem = link.closest('.has-submenu');

            if (window.innerWidth <= 768 && (!parentItem || parentItem.classList.contains('submenu-open'))) {
                closeMobileMenu();
            }
        });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && window.innerWidth <= 768) {
            closeMobileMenu();
        }
    });

    if (!document.querySelector('.scroll-top-btn')) {
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.type = 'button';
        scrollTopBtn.className = 'scroll-top-btn';
        scrollTopBtn.setAttribute('aria-label', 'Voltar ao topo');
        scrollTopBtn.innerHTML = '&#8593;';

        scrollTopBtn.addEventListener('click', function () {
            playUiSound('assets/audio/alerta-botÃ£o-novidade-flutuante.mp3', 0.7);
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
    setupFloatingAlerts();
    createCookieBanner();
});

