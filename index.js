const puppeteer = require("puppeteer");
(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: ".tmp",
    });

    const page = await browser.newPage();
    await page.goto("https://www.mercadolivre.com.br");

    const watchHandles = await page.$$(
        ".ui-search-layout ui-search-layout--grid  > .ui-search-layout__item"
    );

    try {
        await page.waitForSelector(".nav-search-input");
        await page.click(".nav-search-input");
        await page.type(".nav-search-input", "mackbook");

        await page.waitForSelector(".nav-search-btn");
        await page.click(".nav-search-btn");

        await page.waitForSelector(".ui-search-item__group");
        for (const watchHandle of watchHandles) {
            const title = await page.evaluate(
                (el) =>
                    el.querySelector(".ui-search-item__group__element > h2")
                        .textContent,
                watchHandle
            );
            console.log(title);
        }
    } catch {}

    // await browser.close();
})();
