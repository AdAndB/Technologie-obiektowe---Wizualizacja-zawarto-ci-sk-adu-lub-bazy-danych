const puppeteer = require('puppeteer');

(async () => {
    // Uruchomienie przeglądarki
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Przejście na stronę
    await page.goto('http://localhost:3000'); // Zamień na adres swojej aplikacji

    // Tworzenie zrzutu ekranu
    await page.screenshot({
        path: 'screenshot.png',
        fullPage: true
    });

    // Zamknięcie przeglądarki
    await browser.close();
})();
