const puppeteer = require('puppeteer');
const jsdom = require("jsdom");
const fs = require('fs')
const {
    JSDOM
} = jsdom;

const express = require('express');
const bodyParser = require('body-parser')
const api = express();
api.use(express.json());
api.use(express.urlencoded({
    extended: true
}));
api.use(bodyParser.urlencoded({ extended: false }))
api.use(bodyParser.json())

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))



function isDirectoryEmpty(path) {
    return fs.readdirSync(path).length === 0;
}

app()

async function app() {

    try {

        api.post('/', async (req, res) => {
            console.log(req.body)
            res.status(200).end()

        var options = {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            ignoreDefaultArgs: ['--disable-extensions'],
            headless: true,
            userDataDir: './ChromeSession'
          };

        let browser = await puppeteer.launch(options);
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 600 });

        console.log("Browser Opened!");

            if (req.body.login) {
                await page.goto("https://my.soundful.com/")
                console.log("Open my.soundful.com/")

                await delay(15000)

                    await delay(3000)
                    await page.type('#mui-1', 'feliperosenek@gmail.com');
                    await page.type('#mui-2', 'Feliperosene2130*');
                    await page.click("button[type='submit']");
                
                    await delay(45000)
            }

            if(req.body.makeMusic){


            await page.goto("https://my.soundful.com/templates")

            console.log("Open my.soundful.com/templates")

            var dataPage = await page.evaluate(() => document.querySelector('*').outerHTML); // carrega o HTML de página
            var domPage = new JSDOM(dataPage)

            var template = await page.$$('div[data-testid="templateItem"]');
            var templateName = domPage.window.document.querySelectorAll('div[data-testid="templateItem"] > p');

            var i = 0
            templateName.forEach(function (element) {
                if (element.textContent == req.body.templatename) {
                    template[i].click()
                }

                i++
            });
            console.log("Set Template")

            var x =0

            while (x < req.body.qnt) {

                console.log("New music creating.... [" + (x + 1) + "]")
                await delay(5000)
                await page.click("#createTrackFAB")
                await delay(2000)
                await page.click("#pinWheelSimilar")
                await delay(9000)
                await page.type("input[type='number']", "0")
                await page.keyboard.press('Backspace');
                await page.keyboard.press('Backspace');
                await page.keyboard.press('Backspace');
                await page.keyboard.press('Backspace');
                await page.keyboard.press('Backspace');
                await page.type("input[type='number']", req.body.bpm)

                await page.type("#trackName", req.body.trackname)
                page.click("button[data-testid='createPreview']")
                await delay(40000)
                page.click("button[data-testid='save']")
                console.log("Music create!")
                x++
            }

            console.log("Music Create Success!")
        }

            await delay(7000)

            if(req.body.render){     
        
            console.log("Initializing Render Process...")

            await page.goto("https://my.soundful.com/library")
            console.log("Open my.soundful.com/library")
            delay(10000)

            console.log("Loading sounds")

            var y = 0
            var divMain = await page.$('#scrollableContent');
            for (let index = 0; index < 25; index++) {
                await page.evaluate((div) => {
                    div.scrollBy(0, 600);
                }, divMain);
                index++

                await delay(3000)
            }

            console.log("Loading sounds OK!")

            dataPage = await page.evaluate(() => document.querySelector('*').outerHTML);
            domPage = new JSDOM(dataPage)

            await delay(5000)

            var getButtons = await page.$$("button[data-testid='renderDownload']")
            var buttonText = await domPage.window.document.querySelectorAll("button[data-testid='renderDownload']");
            var musicName = await domPage.window.document.querySelectorAll("h6[aria-label=" + req.body.trackname + "]");

            await delay(5000)

            while (y <= musicName.length) {
                var element = buttonText[y].childNodes
                if (element[0].nodeName == "SPAN") {
                    await getButtons[y].click()
                    await delay(5000)
                    await page.click("button[data-testid='submitDialog']")
                    console.log("New Render! [" + (y + 1) + " > " + musicName.length + "]")
                    await delay(90000)
                }


                divMain = await page.$('#scrollableContent');

                await page.evaluate((div) => {
                    div.scrollBy(0, 600);
                }, divMain);

                y++
            };

            console.log("Rendering Process Completed")    
        }     

        })

    } catch (err) {
        console.log(err)
        app()
    }
}


api.listen(process.env.PORT || 3000, () => {
    console.log('API RUN!');
});
