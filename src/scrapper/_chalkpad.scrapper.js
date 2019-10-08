import cheerio from 'cheerio';
import pEvent from 'p-event';

import selector from './_selector.map';


export class ChalkPad {
    constructor(browser) {
        this.browser = browser;
    }

    async getStudentInfo(username, password) {
        const browser = this.browser;
        const context = await browser.createIncognitoBrowserContext();

        const indexPage = await context.newPage();

        return indexPage.goto(selector.studentLogin.url)
            .then(async () => {
                await indexPage.type('#username', username);
                await indexPage.type('#password', password);
                await indexPage.click('.button_send');

                let data = null
                if (indexPage.url() === selector.studentLogin.success) {
                    await indexPage.goto(selector.studentInfo.url);
                    const studentdata = await this.getStudentDetails(indexPage);
                    const coursedata = await this.getCourseDetails(indexPage);
                    const timetable = await this.getTimeTable(indexPage);

                    data = {
                        student : studentdata,
                        courses : coursedata,
                        timetable: timetable
                    }
                }

                context.close();

                return data;
            })
            .catch((err) => {
                throw err;
            });
    }


    async getStudentDetails(page) {
        return page.content()
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
    
    async getCourseDetails(page) {
        return page.click(selector.courseInfo.tab)
            .then(async () => {
                const result = await pEvent(page,'response', (response) => {
                    if(response.url() === selector.courseInfo.xurl) {
                        return true;
                    }
                });

                const data = await result.json();
                return data;
            })
            .catch((err) => {
                throw err;
            });
    }

    async getTimeTable(page) {
        return page.click(selector.timetable.tab)
        .then(async () => {
            const result = await pEvent(page,'response', (response) => {
                if(response.url() === selector.timetable.xurl) {
                    return true;
                }
            });

            const html = await result.text();
            const $ = cheerio.load(html);
            const days = $(selector.courseInfo.days).each((i,element) => {
                console.log(element.text());
            });

            return html;
        })
        .catch((err) => {
            throw err;
        });
    }
}