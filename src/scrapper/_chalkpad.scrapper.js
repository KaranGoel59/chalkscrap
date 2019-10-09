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

        const pages = await Promise.all([context.newPage(),context.newPage()])
        const indexPage = await pages[0];
        const timetable = await pages[1];

        return indexPage.goto(selector.studentLogin.url)
            .then(async () => {
                await indexPage.type('#username', username);
                await indexPage.type('#password', password);
                await indexPage.click('.button_send');

                let data = null
                if (indexPage.url() === selector.studentLogin.success) {
                    await indexPage.goto(selector.studentInfo.url);
                    const studentdetails = await this.getStudentDetails(indexPage);
                    const studentdata = await Promise.all([this.getCourseDetails(indexPage),
                                                           this.getTimeTable(timetable)])

                    data = {
                        student : studentdetails,
                        courses : studentdata[0],
                        timetable: studentdata[1]
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
                const gender = $(selector.studentInfo.gender).text();
                const image = $(selector.studentInfo.image).attr('src');
    
                const json = {
                    id: id.trim(),
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    gender: gender.trim(),
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
        return page.goto(selector.timetable.url,{ waitUntil: 'networkidle0' })
        .then(() => page.content())
        .then((html) => {
            const $ = cheerio.load(html);
            const days = $(selector.timetable.days);

            const week =["monday","tuesday","wednesday","thursday","friday"];
            const timetable = {};

            let i = 0;
            let j = 0;
            let periods = [];
            days.each(function() {
                const period = $(this).text().trim();
                periods.push(period);
                j++;

                if(j == 8) {
                    j = 0;
                    const day = week[i];
                    timetable[day] = periods;
                    periods = [];
                    i++;
                }
            });

            return timetable;
        })
        .catch((err) => {
            throw err;
        });
    }
}