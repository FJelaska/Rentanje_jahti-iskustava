(() => {
    const INCLUDED = "hr,en,de,it";
    const PAGE_LANG = "en";

    function ensureHiddenContainer() {
        let el = document.getElementById("google_translate_element");
        if(!el){
            el = document.createElement("div");
            el.id = "google_translate_element";
            el.style.display = "none";
            document.body.appendChild(el);
        }
    }

    window.googleTranslateElementInit = function() {
        new google.translate.TranslateElement(
            {
                pageLanguage: PAGE_LANG,
                includedLanguages: INCLUDED,
                autoDisplay: false
            },
            "google_translate_element"
        );
    };

    function injectGoogleScriptOnce() {
        if(document.querySelector('script[src*="translate_a/element.js"]')) return;

        const s =document.createElement("script");
        s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        s.async = true;
        document.head.appendChild(s);
    }

    function setLang(lang){
        const select = document.querySelector("select.goog-te-combo");
        if(!select) return false;
        select.value = lang;
        select.dispatchEvent(new Event("change"));
        return true;
    }

    function normalizeButtons() {
        document.querySelectorAll("a.js-lang").forEach((a) => {
            if(a.dataset.gtLang) return;
            const t = (a.textContent || "").trim().toUpperCase();
            if(t === "HR") a.dataset.gtLang = "hr";
            if(t === "ENG" || t === "EN") a.dataset.gtLang = "en";
            if(t === "DE") a.dataset.gtLang = "de";
            if(t === "IT") a.dataset.gtLang = "it";
        });
    }

    function bindClicks() {
        document.addEventListener("click", (e) => {
            const btn = e.target.closest("a.js-lang");
            if(!btn) return;

            const lang = btn.dataset.gtLang;
            if(!lang) return;

            e.preventDefault();

            if (setLang(lang)) return;

            let tries=0;
            const t = setInterval(() => {
                if(setLang(lang) || tries > 30) clearInterval(t);
            }, 100);
        });
    }

    document.addEventListener("DOMContentLoaded", () =>{
        ensureHiddenContainer();
        normalizeButtons();
        bindClicks();
        injectGoogleScriptOnce();
    });
})();