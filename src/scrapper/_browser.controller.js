import puppeteer from 'puppeteer';
import to from 'await-to-js';

class Browser {
    constructor() {
        this.browser = (async () => { return await to(puppeteer.launch({devtools: true}))});
    }

    createClient(page) {
        return page.target().createCDPSession();
    }

    createPages(count) {
        return Promise.all(new Array(count).fill(new this.browser.newPage()));
    }

    intercept() {
        //
    }
}

export default new Browser;
