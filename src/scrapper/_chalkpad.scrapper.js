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
                                                           this.getSchedule(timetable)])

                    data = {
                        student : studentdetails,
                        courses : studentdata[0],
                        schedule: studentdata[1]
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
                const id = $(selector.studentInfo.id).text().trim();
                const firstName = $(selector.studentInfo.firstName).text().trim();
                const lastName = $(selector.studentInfo.lastName).text().trim();
                const email = $(selector.studentInfo.email).text().trim();
                const gender = $(selector.studentInfo.gender).text().trim();
                const image = $(selector.studentInfo.image).attr('src');
    
                const json = {
                    id: id,
                    firstName: firstName,
                    lastName: lastName,
                    gender: gender,
                    email: email,
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

    async getSchedule(page) {
        return page.goto(selector.timetable.url,{ waitUntil: 'networkidle0' })
        .then(() => page.content())
        .then((html) => {
            const $ = cheerio.load(html);
            const days = $(selector.timetable.days);
            const batch = $(selector.timetable.batch).text().replace(/ /g,'').replace('SEM',' SEM');

            const week =["monday","tuesday","wednesday","thursday","friday"];
            const timetable = {};
            const teachers = new Set();
            const sections = new Set();

            let i = 0;
            let j = 0;
            let periods = [];
            days.each(function() {
                let info =  $(this).html()
                            .replace(/<br>/g,' ')
                            .replace(/<hr>/g,'').trim();

                if(info.substr(-1) == ',') {
                    info = info.slice(0,-1).replace(', ','|');
                } else {
                    info ="";
                }

                info.split('|')
                .forEach((value) => {
                    let arr = value.split(' ');

                    if(arr.length >= 5 ) {
                        const teacher = `${arr[4]} ${arr[5]} ${arr[0]} Section${arr[1]}`;
                        const section = `Section${arr[1]}`;
                        
                        if(!teachers.has(teacher)) {
                            teachers.add(teacher);
                        }

                        if(!sections.has(section)) {
                            sections.add(section);
                        }
                    }
                })

                periods.push(info);
                j++;

                if(j == 8) {
                    j = 0;
                    const day = week[i];
                    timetable[day] = periods;
                    periods = [];
                    i++;
                }
            });

            return {
                batch: batch,
                sections: [...sections],
                teachers: [...teachers],
                timetable: timetable
            };
        })
        .catch((err) => {
            throw err;
        });
    }
}