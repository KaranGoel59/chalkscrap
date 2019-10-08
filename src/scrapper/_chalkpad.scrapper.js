import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

import selector from './_selector.map';


export async function getStudentInfo(username, password) {
    return  puppeteer
    .launch({devtools: true})
    .then(async browser => {
        const pages = await Promise.all([browser.newPage(),browser.newPage(), browser.newPage()])
        const indexPage = pages[0];
        const userPage = pages[1];
        const coursePage = pages[2];

        return indexPage.goto(selector.studentLogin.url)
        .then(async () => {
            await indexPage.type('#username',username);
            await indexPage.type('#password',password);
            await indexPage.click('.button_send');

            let data = null
            if(indexPage.url() === selector.studentLogin.success) {
                data = await Promise.all([getStudeDetails(userPage),getCourseDetails(coursePage)]);
            }

            indexPage.close();
            userPage.close();

            // browser.close();

            return data;
        })
    })
    .catch((err)=> {
        throw err;
    });
}

async function getStudeDetails(page) {
    return page.goto(selector.studentInfo.url)
        .then(() => page.content())
        .then((html) => {
            const $ = cheerio.load(html);
            const id = $(selector.studentInfo.id).text();
            const firstName = $(selector.studentInfo.firstName).text();
            const lastName = $(selector.studentInfo.lastName).text();
            const email = $(selector.studentInfo.email).text();
            const image = $(selector.studentInfo.image).attr('src');

            const json = {
                id: id.trim(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                image: image
            }

            return json;
        })
        .catch((err) => {
            throw err;
        });
}

async function getCourseDetails(page) {
    return page.goto(selector.studentInfo.url)
           .then(() => page.click(selector.courseInfo.tab))
           .then(() => page.target().createCDPSession())
           .then(async (client) => {
               await client.send('Network.enable')
            })
           .catch((err) => {
               throw err;
           });
}
