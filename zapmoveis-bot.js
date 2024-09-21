const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const something = "Cabo Frio";
const valueToClick = "BR-Rio_de_Janeiro-NULL-Cabo_Frio-Barrios-Parque_Burle"; // o valor do checkbox que você quer clicar
const targetNumber = "2733393319"; // Número que desejamos buscar no href
const messageToSeller =
    "Oi, boa noite, gostaria de mais informações... A casa vem com a mobília? ";
puppeteer
    .launch({
        headless: false,
        executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
        userDataDir: "C:/Users/sttar/AppData/Local/Google/Chrome/User Data",
    })
    .then(async (browser) => {
        console.log("Running tests...");
        const page = await browser.newPage();

        // Navega até a página desejada
        await page.goto("https://www.zapimoveis.com.br/");

        // Aguarda o campo de entrada estar disponível e interage com ele
        await page.waitForSelector(".l-input__input-wrapper input");
        const inputElement = await page.$(".l-input__input-wrapper input");
        await inputElement.click();
        await inputElement.type(something);

        // Aguarda até que o checkbox com o valor desejado esteja presente
        await page.waitForSelector(
            `input[type="checkbox"][value="${valueToClick}"]`,
            {
                visible: true,
            }
        );

        // Executa o clique no checkbox com o valor correto
        await page.evaluate((valueToClick) => {
            const checkbox = document.querySelector(
                `input[type="checkbox"][value="${valueToClick}"]`
            );
            if (checkbox) {
                checkbox.click();
            }
        }, valueToClick);
        console.log("Checkbox clicked based on value!");

        await page.waitForSelector('div[title="Todos os imóveis"]', {
            visible: true,
        });

        // Clica no <div> com base no title
        await page.click('div[title="Todos os imóveis"]');
        console.log("Clicou no elemento 'Todos os imóveis'!");

        await page.waitForSelector('input[type="checkbox"][value="HOME"]', {
            visible: true,
        });

        // Clica no checkbox correspondente ao valor "HOME"
        await page.click('input[type="checkbox"][value="HOME"]');
        console.log("Clicou no elemento casa");

        await page.waitForSelector('button[type="submit"]', {
            visible: true,
        });

        // Clica no botão "Buscar"
        await page.click('button[type="submit"]');

        // Aguarda o carregamento dos resultados
        await page.waitForSelector(".listing-wrapper__content", {
            visible: true,
        });
        try {
            await page.click(
                `.listing-wrapper__content > div > div > a[data-id="${targetNumber}"]`
            );
            await page.waitForNavigation({ waitUntil: "networkidle0" }); // Aguarda a navegação completa

            await page.waitForSelector("#l-input-9");
            await page.click("#l-input-9");

            // Opcional: se você quiser definir um valor após o clique
            await page.type("#l-input-9", "Seu valor aqui");
        } catch {
            console.log("Não achou o anuncio");
        }
    });
