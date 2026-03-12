// js/loader.js
const Loader = (function() {
    function loadResources(paths, callback, onFailed, addTimestamp = true) {
        const head = document.getElementsByTagName('head')[0];
        const pathArray = Array.isArray(paths) ? paths : [paths];
        let loaded = 0;
        const total = pathArray.length;

        if (total === 0) {
            callback && callback();
            return;
        }

        function onLoad() {
            loaded++;
            if (loaded === total && callback) callback();
        }

        function onError(e) {
            console.error('Falha ao carregar recurso:', e.target.src || e.target.href);
            if (loaded === 0 && onFailed) onFailed();
        }

        function addTimeParam(url) {
            if (!addTimestamp) return url;
            if (url.includes('?')) return url;
            return url + '?t=' + Date.now();
        }

        pathArray.forEach(url => {
            if (!url) return;
            const finalUrl = addTimeParam(url);
            let element;

            if (url.endsWith('.css')) {
                element = document.createElement('link');
                element.href = finalUrl;
                element.rel = 'stylesheet';
                element.type = 'text/css';
            } else {
                element = document.createElement('script');
                element.src = finalUrl;
                element.type = 'text/javascript';
                element.async = false;
            }

            element.onload = onLoad;
            element.onerror = onError;
            head.appendChild(element);
        });
    }

    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    return {
        load: loadResources,
        isMobile: isMobile
    };
})();