//Run in console by pressing F12 in browser, It selects all as Neutral 

(function() {
    const selectRadios = (doc) => {
        const radios = doc.querySelectorAll('input[type="radio"][value="3"]');
        radios.forEach(radio => {
            radio.checked = true;
            // This triggers the "change" event in case the site is watching for it
            radio.dispatchEvent(new Event('change', { bubbles: true }));
            // Some systems need a literal click to register
            radio.click(); 
        });
        console.log(`Selected ${radios.length} buttons in a document.`);
    };

    // 1. Check the main page
    selectRadios(document);

    // 2. Check all iframes (where ERP forms usually live)
    document.querySelectorAll('iframe').forEach(iframe => {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDoc) selectRadios(iframeDoc);
        } catch (e) {
            console.warn("Could not access an iframe due to security (CORS), but usually ERPs are on the same domain.");
        }
    });
})();