import puppeteer from 'puppeteer';
// import cheerio from 'cheerio';

// import selector from './_selector.map';

export async function getStudentInfo(username,password) {
    return puppeteer
    .launch()
    .then(browser => browser.newPage())
    .then(page => {
        return page.goto('https://hp.chitkara.edu.in//Interface/index.php')
        .then(async () => {
            await page.type('#username',username);
            await page.type('#password',password);
            await page.click('.button_send');

            await page.goto(page.url());

            return page.content();
        })
    })
    .then(html => {
        console.log(html);
    })
    .catch(console.error);
}